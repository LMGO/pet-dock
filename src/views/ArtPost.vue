<template>
  <div class="artpost">
    <div class="back">
      <el-button @click="back" class="back-buton" icon="el-icon-arrow-left" circle></el-button>
    </div>
    <div style="width:100%;display:flex">
      <span></span>
      <el-button
        v-loading="loading"
        style="margin-left:auto;
                color: #fff;
                cursor: pointer;
                width:100px;
                border: 1px solid rgb(238, 236, 236);
                padding: 10px 13px;
                background-color: #fdda5a !important;"
        @click="submitForm"
      >发表</el-button>
    </div>
    <el-form style="margin-top:20px">
      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 30px;" label-width="70px" label="标题:">
          <el-input
            v-model="postForm.art_title"
            :rows="1"
            type="textarea"
            class="article-textarea"
            maxlength="20"
            show-word-limit
            placeholder="请填写文章标题"
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label-width="70px" label="导读:">
          <el-input
            v-model="postForm.art_guide"
            :rows="3"
            type="textarea"
            class="article-textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入文章导读"
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label="发布方式:">
          <el-checkbox v-model="postForm.is_public" :false-label="0" :true-label="1">公开发布</el-checkbox>
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label="上传封面:">
          <div class="upload-container">
            <el-upload
              :data="qiniuData"
              :multiple="false"
              :action="upload_qiniu_url"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :auto-upload="false"
              class="image-uploader"
              :show-file-list="true"
              :limit="1"
              accept="image/jpg"
              list-type="picture-card"
              ref="uploadartcoverimage"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <div style="color:red;margin-bottom:5px">注：编辑区域下方可查看实时预览效果</div>
        <el-form-item prop="art_content" style="margin-bottom: 30px;clear:both !important">
          <Tinymce ref="editor" v-model="postForm.art_content" :height="400" />
        </el-form-item>
        <h1 style="margin-top:10px">实时预览：</h1>
        <div style="margin-top:10px;min-height:100px" v-html="postForm.art_content"></div>
      </div>
    </el-form>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
import { getTime, uuid } from "@/utils/index.js";
import { getQiniuToken } from "@/utils/api/post.js";
import { newart } from "@/utils/api/art.js";
export default {
  name: "artpost",
  components: {
    Tinymce
  },
  data() {
    return {
      loading: false,
      qiniuData: {
        key: "",
        token: ""
      },
      upload_qiniu_url: "http://upload-z2.qiniup.com",
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: "http://cdn.fengblog.xyz/",
      postForm: {
        art_title: "", // 文章题目
        art_content: "", // 文章内容
        art_guide: "", // 文章导读
        art_cover: "", // 文章封面图片
        art_id: "",
        user_id: "",
        is_public: 1,
        id: 1, //编辑器ID，默认随便给1
        post_time: ""
      }
    };
  },
  methods: {
    back() {
      if (this.postForm.art_content || this.postForm.art_guide) {
        this.$confirm("是否保存为草稿?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            localStorage.setItem("artTopost", JSON.stringify(this.postForm));
            this.$message({
              type: "success",
              message: "以保存到本地，下次可继续编辑成功!"
            });
            this.$router.back(1);
          })
          .catch(() => {
            localStorage.removeItem("artTopost");
            this.$router.back(1);
            this.$message({
              type: "info",
              message: "不保存"
            });
          });
      } else {
        this.$router.back(1);
      }
    },
    rmImage() {
      this.postForm.art_cover = "";
    },
    //封面图片部分
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
    //发表时先上传七牛云生成图片地址
    async handleSuccess(resd) {
      //成功时发布内容
      this.postForm.art_cover = this.upload_qiniu_addr + resd.key;
      this.postForm.post_time = getTime();
      this.postForm.user_id = this.$store.state.userInfo.user_id;
      this.postForm.art_id = uuid("art");
      console.log(this.postForm);
      //发表接口
      let data = this.postForm;
      console.log(data);
      let res = await newart(data);
      if (res.data.code == 0) {
        this.$message({
          message: "发表成功！",
          duration: 2000,
          type: "success"
        });
        this.$router.back(1);
      } else {
        this.$message({
          message: "发表失败，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    handleError() {
      this.$message({
        message: "封面图片上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    async submitForm() {
      await this.$refs.uploadartcoverimage.submit();
    }
  },
  mounted() {
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      this.$store.dispatch("getUserInfo", userInfo);
    }
    let datainfo = localStorage.getItem("artTopost");
    console.log(datainfo);
    if (datainfo) {
      this.postForm = JSON.parse(datainfo);
      console.log(this.postForm);
    }
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data;
      console.log(this.qiniuData.token);
    });
  }
};
</script>
<style lang="scss" scoped>
.back {
  position: fixed;
  z-index: 1;
  top: 65px;
  transform: translateX(-70px);
  .back-buton {
    height: 45px;
    width: 45px;
    // background-color: #ffe589;
  }
  .el-button:focus,
  .el-button:hover {
    color: #fff;
    border-color: #ffda5a !important;
    outline: 0;
    background-color: #ffda5a;
  }
}
.artpost {
  position: relative;
  min-height: calc(100vh - 106px);
  width: 1000px;
  background-color: #fff;
  padding: 20px 15px;
  margin: 65px auto 0;
}
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 10px 10px;

    .postInfo-container {
      position: relative;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    // resize: none;
    // border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.upload-container {
  width: 100%;
  position: relative;
  .image-uploader {
    display: flex;
  }
}
</style>