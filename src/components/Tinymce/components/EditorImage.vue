<template>
  <div class="upload-container">
    <el-button
      icon="el-icon-upload"
      size="mini"
      type=""
      style="background-color: #fdda5a !important;color:#fff"
      @click=" dialogVisible=true"
    >上传本地图片</el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :action="upload_qiniu_url"
        :data="qiniuData"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :auto-upload="false"
        :multiple="false"
        :limit="1"
        :on-remove="handleRemove"
        ref="uploadtopicimage"
        accept="image/jpg"
      >
        <i class="el-icon-plus" style></i>
      </el-upload>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button style="background-color: #fdda5a !important;color:#fff" type="" @click="handleSubmit">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { uuid } from "@/utils/index.js";
import { getQiniuToken } from "@/utils/api/post.js";
export default {
  name: "EditorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff"
    }
  },
  data() {
    return {
      qiniuData: {
        key: "",
        token: ""
      },
      upload_qiniu_url: "http://upload-z2.qiniup.com",
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: "http://cdn.fengblog.xyz/",
      dialogVisible: false,
      listObj: {},
      fileList: []
    };
  },
  methods: {
    // checkAllSuccess() {
    //   return Object.keys(this.listObj).every(
    //     item => this.listObj[item].hasSuccess
    //   );
    // },
    async handleSubmit() {
      if(this.fileList.length) {
        this.$message({
        message: "图片正在上传",
        duration: 2000,
        type: "warning"
      });
      }
      await this.$refs.uploadtopicimage.submit();
      // if (!this.checkAllSuccess()) {
      //   this.$message(
      //     "Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!"
      //   );
      //   return;
      // }
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    beforeUpload(file) {
      this.qiniuData.key = uuid("image");
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isPNG) {
        this.$message.error("图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("图片大小不能超过 5MB!");
        return false;
      }
    },
    handleSuccess(res) {
      this.listObj.url = this.upload_qiniu_addr + res.key;
      this.fileList.push(this.listObj)
      //成功后把图片地址返回给父组件显示在富文本编辑器中
      const arr = this.fileList;
      this.$emit("successCBK", arr);
      // const uid = file.uid;
      // const objKeyArr = Object.keys(this.listObj);
      // for (let i = 0, len = objKeyArr.length; i < len; i++) {
      //   if (this.listObj[objKeyArr[i]].uid === uid) {
      //     this.listObj[objKeyArr[i]].url = response.files.file;
      //     this.listObj[objKeyArr[i]].hasSuccess = true;
      //     return;
      //   }
      // }
    },
    handleError() {
      this.$message({
        message: "图片上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
  },
  created() {
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data;
      console.log(this.qiniuData.token);
    });
  }
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
