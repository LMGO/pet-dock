<template>
  <div id="post-page">
    <div class="background-Mask"></div>
    <div class="post-box">
      <i class="el-icon-circle-close closeicon" @click="closepopup"></i>
      <!-- 发布动态 -->
      <div class="dynamic-area" v-if="$store.state.PostPopup.post =='post'">
        <div class="title">
          <img src="../assets/img/reg4.jpg" alt class="user-avatar" />
          <span class="text">半途,和大家分享你的宠坞日常吧！</span>
        </div>
        <div class="post-content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="和大家分享你的宠坞日常吧！"
            maxlength="200"
            v-model="dynamic.post_conent"
            show-word-limit
          ></el-input>
          <div class="addtopic">
            <el-tag
              class="topic-item"
              v-for="(topic,topicindex) in dynamic.topiclist"
              :key="topicindex"
              closable
              @close="closetag(topicindex)"
              type
            >#{{question.question_title}}#</el-tag>
            <el-button
              class="add-button"
              v-show="dynamic.topiclist.length <3&&!showinput"
              type="primary"
              @click.stop="showSearchinput"
              icon="el-icon-plus"
            >添加话题({{dynamic.topiclist.length}}/3)</el-button>
            <div class="search-area" v-if="showinput">
              <el-input
                ref="searchtopic"
                class="search-topic"
                placeholder="搜索话题标签"
                prefix-icon="el-icon-search"
                v-model="searchtext"
                @blur="searchblur"
              ></el-input>
              <div class="search-popover">
                <li
                  class="result-list"
                  v-for="(t,tindex) in searchTopicresult"
                  :key="tindex"
                  @click.stop="addtopic(t)"
                >
                  <span class="topic-name">#{{t.topic_name}}#</span>
                </li>
                <div v-show="searchTopicresult.length==0 && !searchtext" class="no-reslut">暂无匹配话题</div>
              </div>
            </div>
          </div>
          <div>
            <span style="margin-right:15px">发表风格：</span>
            <el-radio v-model="dynamic.post_style" label="image">图片</el-radio>
            <el-radio v-model="dynamic.post_style" label="video">视频</el-radio>
          </div>
          <div class="addimage" v-if="dynamic.post_style=='image'">
            <el-upload
              class="up"
              :action="upload_qiniu_url"
              list-type="picture-card"
              :before-upload="beforeUpload1"
              :on-success="handleSuccess1"
              :on-error="handleError1"
              :auto-upload="false"
              :multiple="true"
              :limit="9"
              :on-remove="handleRemove"
              ref="uploadimage"
              accept="image/jpg"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <!-- :on-preview="handlePictureCardPreview" -->
            <!-- <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>-->
          </div>
          <div class="addvideo" v-if="dynamic.post_style=='video'">
            <el-upload
              :action="upload_qiniu_url"
              ref="uploadvideo"
              :data="qiniuData"
              :limit="1"
              :before-upload="beforeUpload2"
              :on-success="handleSuccess2"
              :on-error="handleError2"
              :auto-upload="false"
              list-type="picture"
            >
              <el-button icon="el-icon-video-camera" class="selectvideo" size="small">选择视频</el-button>
            </el-upload>
          </div>
          <div>
            <span style="margin-right:15px">发布方式：</span>
            <el-radio v-model="dynamic.is_public" label="true">公开发布</el-radio>
            <el-radio v-model="dynamic.is_public" label="false">仅自己可见</el-radio>
          </div>
          <el-button type="primary" class="publish-post" @click="publishDynamic">发布动态</el-button>
        </div>
      </div>
      <!-- 创建问题 -->
      <div class="question-area" v-else-if="$store.state.PostPopup.post == 'question'">
        <img src="../assets/img/reg4.jpg" alt class="user-avatar" />
        <div class="question-body">
          <div class="title">
            <el-input
              class="input-text"
              type="textarea"
              ref="questiontitle"
              placeholder="在此写下你的问题，以问号结束。"
              v-model="question.question_title"
              maxlength="30"
              @keyup="question.question_title = question.question_title.replace(/\s+/g,'')"
              show-word-limit
            ></el-input>
          </div>
          <div class="describe">
            <div class="text">问题描述(选填)：</div>
            <div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="描述一下问题，能方便大家更好的为你回答"
                maxlength="200"
                v-model="question.question_description"
                @keyup="question.question_description = question.question_description.replace(/\s+/g,'')"
                show-word-limit
              ></el-input>
            </div>
          </div>
          <div class="image-cover">
            <div class="text">添加图片描述(一张,可不添加)：</div>
            <el-upload
              :action="upload_qiniu_url"
              list-type="picture-card"
              :before-upload="beforeUpload1"
              :on-success="handleSuccess1"
              :on-error="handleError1"
              :auto-upload="false"
              :multiple="true"
              :limit="1"
              :on-remove="handleRemove"
              ref="uploadimage"
              accept="image/jpg"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div class="question-isanonymous">
            <el-checkbox v-model="question.isanonymous">匿名发布</el-checkbox>
          </div>
          <el-button type="primary" class="publish-question" @click="publishquestion">发布问题</el-button>
        </div>
      </div>
      <!-- 创建话题 -->
      <div class="post-topic">
        <img src="../assets/img/reg4.jpg" alt class="user-avatar" />
        <div class="question-body">
          <div class="title">
            <el-input
              class="input-text"
              type="textarea"
              ref="questionname"
              placeholder="填写话题名称"
              v-model="question.question_title"
              maxlength="15"
              :autosize="{ minRows: 1, maxRows: 2}"
              @keyup="topic.topic_name = topic.topic_name.replace(/\s+/g,'')"
              show-word-limit
            ></el-input>
          </div>
          <div class="describe">
            <div class="text">话题描述(选填)：</div>
            <div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="描述一下话题，能方便大家更好的参与"
                maxlength="200"
                v-model="topic.topic_description"
                @keyup="topic.topic_description = topic.topic_description.replace(/\s+/g,'')"
                show-word-limit
              ></el-input>
            </div>
          </div>
          <div class="image-cover">
            <div class="text">添加话题封面(一张,可不添加)：</div>
            <el-upload
              :action="upload_qiniu_url"
              list-type="picture-card"
              :before-upload="beforeUpload1"
              :on-success="handleSuccess1"
              :on-error="handleError1"
              :auto-upload="false"
              :multiple="true"
              :limit="1"
              :on-remove="handleRemove"
              ref="uploadimage"
              accept="image/jpg"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <el-button type="primary" class="publish-question" @click="publishtopic">发布话题</el-button>
        </div>
      </div>
      <!-- <img src="../assets/icon/esc.png" alt="" class=""> -->
    </div>
  </div>
</template>
<script>
// import { newcode } from '@/utils/index.js'
import // addPostAndImages,
// addPost,
// addPostImage,
// addPostVideo,
// getQiniuToken
"@/utils/api/post.js";
export default {
  data() {
    return {
      //动态部分 --------------
      qiniuData: {
        key: "",
        token: ""
      },
      upload_qiniu_url: "http://upload-z2.qiniup.com",
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: "http://cdn.fengblog.xyz/",
      dynamic: {
        is_public: "true", //默认
        user_id: "", //状态管理得到
        post_id: "", //发表前前端生成
        post_content: "",
        post_style: "image",
        topiclist: [],
        post_time: ""
      },
      imagelist: [], //图片和帖子内容分开发表
      showinput: false,
      searchtext: "",
      searchTopicresult: [], //搜索话题结果
      dialogImageUrl: "",
      dialogVisible: false,
      formDate: "",
      //问题部分---------------------
      question: {
        question_id: "",
        question_title: "",
        question_description: "",
        question_cover: "", //（一张）
        isanonymous: false,
        post_time: "",
        user_id: ""
      },
      //话题部分---------------------
      topic: {
        topic_id: "",
        topic_title: "",
        topic_description: "",
        topic_cover: "", //（一张）
        post_time: "",
        user_id: ""
      }
    };
  },
  methods: {
    //禁止滚动
    stopMove() {
      let m = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", m, { passive: false }); //禁止页面滑动
    },
    //开启滚动
    Move() {
      let m = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", m, { passive: true });
    },
    //关闭发布界面
    closepopup() {
      let PostPopup = {
        isclose: true, //控制发布弹窗开闭
        post: "post" //控制发布话题或帖子，默认帖子
      };
      this.Move();
      this.$store.commit("changepostpopup", PostPopup);
    },
    //------------动态部分--------------------------------------------
    //删除话题标签
    closetag(index) {
      this.dynamic.topiclist.splice(index, 1);
    },
    //展示话题搜索框
    showSearchinput() {
      this.showinput = true;
      this.$nextTick(() => {
        this.$refs.searchtopic.focus();
      });
    },
    //话题搜索失去焦点
    searchblur() {
      //有搜索结果时失去焦点不关闭
      if (this.searchTopicresult.length > 0) {
        return;
      }
      this.cleardata();
    },
    //清空数据
    cleardata() {
      //动态
      this.showinput = false;
      this.searchTopicresult = [];
      this.searchtext = "";
      this.dynamic = {};
    },
    //选中添加话题
    addtopic(i) {
      if (this.dynamic.topiclist.length >= 3) {
        this.$message({
          message: "最多三条话题标签！",
          type: "warning"
        });
        return;
      }
      this.dynamic.topiclist.push(i);
      console.log(this.dynamic.topiclist);
    },
    /*------------------------图片事件-----------------------*/
    beforeUpload1(file) {
      // this.qiniuData.key = uuid();
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
    handleSuccess1(res) {
      let imageInfo = {
        id: "",
        pid: ""
      };
      imageInfo.id = this.upload_qiniu_addr + res.key;
      imageInfo.pid = this.postData.post.id;
      console.log(imageInfo);
      // addPostImage(imageInfo); //发表图片
      this.dialogFormVisible = false;
    },
    handleError1() {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    //预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    // elementUI上传
    // uploadFile(file) {
    //   this.formDate.append("file", file.file);
    // },
    /*发表帖子*/
    // toAddPost() {
    //   let _this = this;
    //   this.postData.post.id = uuid();
    //   this.postData.post.time = getTime();
    //   this.postData.post.uid = this.$store.state.userInfo.id;
    //   if (this.postData.post.title == "" || this.postData.post.content == "") {
    //     this.$message.error("标题和内容不能为空！");
    //     return;
    //   }
    //   addPost(this.postData.post).then(res => {
    //     console.log(res.data);
    //     if (res.data.message == "程序员开小差了，请您稍后再试。") {
    //       _this.$message.error("程序员开小差了，请您稍后再试~");
    //       console.log("嚯嚯嚯嚯嚯嚯嚯嚯嚯");
    //       return;
    //     } else {
    //       // 上传图片或视频
    //       _this.$refs.upload.submit();
    //       _this.$message.success("发表成功！");
    //       _this.$emit("fuc", "1");
    //     }
    //   });
    // },
    //发布动态
    publishDynamic() {
      console.log(this.dynamic);
      // this.$refs.upload.clearFiles();
      // this.formDate = new FormData();
      // this.$refs.upload.submit();
      // this.formDate.append("posting_id", "111");
      // console.log(this.formDate.get("file"));

      // this.dynamic.post_id = uuid();
      // this.dynamic.post_time = getTime();
      // this.dynamic.user_id = this.$store.state.userInfo.id;
      if (this.dynamic.post_content == "") {
        this.$message.error("内容不能为空！");
        return;
      }
      //发布帖子内容，回调发布图片或者视频,成功后关闭清除内容
    },
    submitUpload() {
      //提交上传
      this.$refs.upload.submit();
    },
    /*------------------------视频事件-----------------------*/
    beforeUpload2(file) {
      // this.qiniuData.key = uuid();
      const fileType = file.type;
      const isLt50M = file.size / 1024 / 1024 < 50; // 算出文件大小
      if (!isLt50M) {
        // 这里我们限制文件大小为20M
        this.$message.error("最大只能上传50M!");
        this.$ref.uploadvideo.abort();
        return isLt50M;
      }
      if (fileType !== "video/mp4") {
        // 限制文件类型
        this.$ref.uploadvideo.abort();
        this.$message.error("只能上传MP4格式视频!");
        return false;
      }
    },
    handleSuccess2(res) {
      let videoInfo = {
        id: "",
        pid: ""
      };
      videoInfo.id = this.upload_qiniu_addr + res.key;
      videoInfo.pid = this.postData.post.id;
      console.log(videoInfo);
      // addPostVideo(videoInfo); //发表视频
      this.dialogFormVisible = false;
      this.$message.success("发表成功！");
    },
    handleError2() {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    //---------问题--------------------------------------------
    publishquestion() {
      let self = this
      if(!self.question.question_title) {
        this.$message({
          message: "问题不能为空",
          duration: 2000,
          type: "warning"
        });
        this.$nextTick(() => {
          this.$refs.questiontitle.focus();
        });
        return
      }
      if(self.question.question_title[self.question.question_title.length-1]!=='?'||self.question.question_title[self.question.question_title.length-2]=='?') {
        this.$message({
          message: "问题需要以单个问号结尾",
          duration: 2000,
          type: "warning"
        });
        this.$nextTick(() => {
          this.$refs.questiontitle.focus();
        });
        return
      }
      console.log(self.question.isanonymous)
    },
    //---------话题--------------------------------------------
    publishtopic() {
      let self = this
      if(!self.topic.topic_name) {
        this.$message({
          message: "话题名称不能为空",
          duration: 2000,
          type: "warning"
        });
        this.$nextTick(() => {
          this.$refs.topic.topic_name.focus();
        });
        return
      }
      if(self.topic.topic_name.length<4) {
        this.$message({
          message: "话题名称太短",
          duration: 2000,
          type: "warning"
        });
        this.$nextTick(() => {
          this.$refs.topicname.focus();
        });
        return
      }
    }
  },
  watch: {
    "dynamic.post_style": {
      handler(val, oldVal) {
        if (oldVal == "image" && this.$refs.uploadimage !== undefined) {
          this.$refs.uploadimage.clearFiles();
        } else if (oldVal == "image" && this.$refs.uploadvideo !== undefined) {
          this.$refs.uploadvideo.clearFiles();
        }
      },
      immediate: true
      // deep:true
    }
  },
  mounted() {
    this.stopMove();
  },
  created() {
    // getQiniuToken().then(res => {
    //   this.qiniuData.token = res.data;
    //   console.log(this.qiniuData.token);
    // });
  }
};
</script>
<style lang="scss">
.background-Mask {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0);
  opacity: 0.3;
  z-index: 999;
}
.post-box {
  opacity: 1;
  position: fixed;
  top: 15%;
  left: 50%;
  width: 595px;
  // height: 300px;
  padding: 20px;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #00000026;
  z-index: 1000;
  .closeicon {
    position: absolute;
    right: -50px;
    top: -20px;
    font-size: 40px;
    color: #fff;
    border-radius: 50%;
  }
  .dynamic-area {
    .title {
      display: flex;
      align-items: center;
      .user-avatar {
        height: 35px;
        width: 35px;
        border-radius: 50%;
      }
      .text {
        font-size: 18px;
        color: #8590a6;
        margin-left: 10px;
      }
    }
    .post-content {
      margin: 8px 0;
      .addtopic {
        margin: 8px 0px;
        height: 30px;
        display: flex;
        align-items: center;
        .topic-item {
          margin-right: 10px;
          background-color: #fff2c2;
        }
        .add-button {
          background-color: #ffda5a;
          border: none;
        }
        .search-area {
          // position: absolute;
          height: 30px;
          position: relative;
          .search-topic {
            width: 200px;
          }
          .search-popover {
            margin-top: 1px;
            padding: 3px 5px;
            position: absolute;
            min-height: 30px;
            width: 100%;
            box-shadow: 1px 1px 3px rgb(207, 206, 206);
            z-index: 3;
            background-color: #fff;
            .result-list {
              list-style-type: none;
              margin: 5px 0;
              padding: 3px 10px;
              cursor: pointer;
              &:hover {
                background-color: rgb(235, 233, 233);
              }
            }
            .no-reslut {
              color: #8590a6;
              text-align: center;
            }
          }
        }
      }
      .addimage {
        margin: 10px 0;
      }
      .addvideo {
        margin: 10px 0;
        .selectvideo {
          background-color: #fff;
        }
      }
      .publish-way {
        color: #8590a6;
      }
      .publish-post {
        display: block;
        margin-left: auto;
        margin-top: 10px;
        background-color: #ffda5a;
      }
    }
  }
  .question-area,.post-topic {
    display: flex;
    .user-avatar {
      height: 35px;
      width: 35px;
      border-radius: 50%;
    }
    .question-body {
      padding-right: 30px;
      flex: 1;
      .title {
        display: flex;
        align-items: center;
        .input-text {
          font-size: 18px;
          font-weight: 600;
          color: #8590a6;
          margin-left: 15px;
          border: none;
          outline: none;
        }
      }
      .describe {
        margin: 10px 0 0 15px;
        .text {
          margin: 10px 0;
          letter-spacing: 2px;
        }
      }
      .image-cover {
        margin: 10px 0 0 15px;
        .text {
          margin: 10px 0;
        }
      }
      .question-isanonymous {
        margin: 10px 0 0 15px;
      }
      .publish-question {
        display: block;
        margin-top: 10px;
        margin-left: auto;
        background-color: #ffda5a;
      }
    }
  }

}
//动态部分
.el-upload-list--picture-card .el-upload-list__item-actions {
  position: absolute;
  width: 80px;
  height: 80px;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}
.el-upload-list--picture-card .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100px !important;
  height: 100px !important;
  margin: 0 3px 3px 0 !important;
  display: inline-block;
}
// .el-upload-list--picture-card .el-upload-list__item-thumbnail {
//     width: 50px !important;
//     height: 50px !important;
// }
.el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
  vertical-align: top;
  margin-bottom: 3px !important;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #ffda5a !important;
  background: #ffda5a !important;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #ffda5a !important;
}
//话题部分
.el-textarea__inner:focus {
  // outline: none !important;
  border-color: #ffda5a !important;
  // border: none !important;
  // border-bottom: 1px solid #DCDFE6 !important;
}
// .el-textarea__inner {
//     outline: none !important;
//     // border-color: #409EFF;
//     border: none !important;
//     border-radius: 0 !important;
//     border-bottom: 1px solid #DCDFE6 !important;
// }
</style>
