<template>
  <div id="post-page">
    <div class="background-Mask"></div>
    <div class="post-box">
      <i class="el-icon-circle-close closeicon" @click="closepopup"></i>
      <!-- 发布动态 -->
      <div class="dynamic-area" v-if="$store.state.PostPopup.post =='post'">
        <div class="title">
          <img :src="$store.state.userInfo.user_avatar" alt class="user-avatar" />
          <span class="text">半途,和大家分享你的宠坞日常吧！</span>
        </div>
        <div class="post-content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="和大家分享你的宠坞日常吧！"
            maxlength="200"
            v-model="dynamic.post_content"
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
            >#{{topic.topic_name}}#</el-tag>
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
                @blur="searchblur()"
              ></el-input>
              <div class="search-popover" v-show="searchTopicresult.length!=0 && searchtext">
                <li
                  class="result-list"
                  v-for="(t,tindex) in searchTopicresult"
                  :key="tindex"
                  @click="addtopic(t)"
                >
                  <span class="topic-name">#{{t.topic_name}}#</span>
                </li>
                <div v-show="searchTopicresult.length==0 && searchtext" class="no-reslut">暂无匹配话题</div>
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
              :data="qiniuData"
              list-type="picture-card"
              :before-upload="beforeUpload1"
              :on-success="handleSuccess1"
              :on-error="handleError1"
              :auto-upload="false"
              :multiple="true"
              :limit="9"
              :on-remove="handleRemove"
              ref="uploadpostimage"
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
            <el-radio v-model="dynamic.is_public" :label="1">公开发布</el-radio>
            <el-radio v-model="dynamic.is_public" :label="0">仅自己可见</el-radio>
          </div>
          <el-button type="primary" class="publish-post" @click="publishDynamic">发布动态</el-button>
        </div>
      </div>
      <!-- 创建问题 -->
      <div class="question-area" v-else-if="$store.state.PostPopup.post == 'question'">
        <img :src="$store.state.userInfo.user_avatar" alt class="user-avatar" />
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
              :data="qiniuData"
              list-type="picture-card"
              :before-upload="beforeUpload4"
              :on-success="handleSuccess4"
              :on-error="handleError4"
              :auto-upload="false"
              :multiple="false"
              :limit="1"
              :on-remove="handleRemove"
              ref="uploadquestionimage"
              accept="image/jpg"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div class="question-isanonymous">
            <el-checkbox v-model="question.isanonymous" :false-label="0" :true-label="1">匿名发布</el-checkbox>
          </div>
          <el-button type="primary" class="publish-question" @click="publishquestion">发布问题</el-button>
        </div>
      </div>
      <!-- 创建话题 -->
      <div class="post-topic" v-else>
        <img :src="$store.state.userInfo.user_avatar" alt class="user-avatar" />
        <div class="question-body">
          <div class="title">
            <el-input
              class="input-text"
              type="textarea"
              ref="topic_name"
              placeholder="填写话题名称"
              v-model="topic.topic_name"
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
                ref="topic_descrption"
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
              :data="qiniuData"
              list-type="picture-card"
              :before-upload="beforeUpload3"
              :on-success="handleSuccess3"
              :on-error="handleError3"
              :auto-upload="false"
              :multiple="false"
              :limit="1"
              :on-remove="handleRemove"
              ref="uploadtopicimage"
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
import { uuid, getTime } from "@/utils/index.js";
import {
  getQiniuToken,
  newpost,
  postimage,
  postvideo
} from "@/utils/api/post.js";
import { newtopic, topicimage, getbyname } from "@/utils/api/topic.js";
import { newquestion, questionimage } from "@/utils/api/question.js";
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
        is_public: 1, //默认
        user_id: "", //状态管理得到
        post_id: "", //发表前前端生成
        post_content: "",
        post_style: "image",
        topiclist: [],
        post_time: ""
      },
      postimagelist: [], //图片先上传,得到地址后在整体发表
      postvideo: [], //帖子视频
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
        isanonymous: 0,
        post_time: "",
        user_id: ""
      },
      //话题部分---------------------
      topic: {
        topic_id: "",
        topic_name: "",
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
    //-----------------------------动态部分--------------------------------------------
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
      this.showinput = false;
      this.searchtext = "";

      // this.cleardata();
    },
    //清空数据
    cleardata() {
      //动态
      this.showinput = false;
      this.searchTopicresult = [];
      this.searchtext = "";
      this.dynamic = {};
      this.topic = {};
      this.question = {};
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
      this.showinput = false;
      this.searchTopicresult = [];
      this.searchtext = "";
    },
    //发布动态
    async publishDynamic() {
      if (this.dynamic.post_content == "") {
        this.$message.error("帖子内容不能为空！");
        return;
      }
      this.dynamic.post_id = uuid("post");
      let data = {
        post_id: this.dynamic.post_id,
        is_public: this.dynamic.is_public,
        user_id: this.$store.state.userInfo.user_id,
        post_content: this.dynamic.post_content,
        post_style: "text",
        topiclist: this.dynamic.topiclist,
        post_time: getTime()
      };
      console.log(data);
      newpost(data).then(res => {
        if (res.data.code == 0) {
          //回调中上传图片或视频
          if (this.dynamic.post_style == "image") {
            this.$message.success("帖子内容发表成功，正在上传图片！");
            this.$refs.uploadpostimage.submit();
          } else {
            this.$message.success("帖子内容发表成功，正在上传视频！");
            this.$refs.uploadvideo.submit();
          }
        }
      });
    },
    /*------------------------图片事件-----------------------*/
    //动态图片部分
    beforeUpload1(file) {
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
    async handleSuccess1(res) {
      let imageInfo = {
        image_id: "",
        post_id: ""
      };
      imageInfo.image_id = this.upload_qiniu_addr + res.key;
      imageInfo.post_id = this.dynamic.post_id;
      console.log(imageInfo);
      await postimage(imageInfo).then(res => {
        if (res.data.code == 0) {
          this.$message.success("上传图片成功！");
        } else {
          this.$message.error("上传图片失败！");
        }
      });
      this.closepopup();
    },
    handleError1() {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    //话题图片部分
    beforeUpload3(file) {
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
    //发表后上传七牛云生成图片地址
    handleSuccess3(res) {
      //话题封面图地址
      let imageInfo = {
        topic_cover: "",
        topic_id: this.topic.topic_id
      };
      imageInfo.topic_cover = this.upload_qiniu_addr + res.key;
      imageInfo.topic_id = this.topic.topic_id;
      console.log(imageInfo);
      //上传图片的接口
      topicimage(imageInfo).then(res => {
        if (res.data.code == 0) {
          this.$message.success("上传图片成功！");
        } else {
          this.$message.error("上传图片失败！");
        }
      });
      this.closepopup();
    },
    handleError3() {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    //问题图片部分
    beforeUpload4(file) {
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
    //发表时先上传七牛云生成图片地址再和问题内容一起请求
    async handleSuccess4(res) {
      //问题图片地址
      let imageInfo = {
        question_cover: "",
        question_id: ""
      };
      imageInfo.question_cover = this.upload_qiniu_addr + res.key;
      imageInfo.question_id = this.question.question_id;
      console.log(imageInfo);
      //上传图片的接口
      await questionimage(imageInfo).then(res=>{
        if(res.data.code==0){
          this.$message.success("上传问题图片成功！");
          this.closepopup()
        }
      });
    },
    handleError4() {
      this.$message({
        message: "图片上传失败",
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
    submitUpload() {
      //提交上传
      this.$refs.upload.submit();
    },
    /*------------------------视频事件-----------------------*/
    //动态视频部分
    beforeUpload2(file) {
      this.qiniuData.key = uuid("video");
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
      //视频地址
      let videoInfo = {
        video_id: "",
        post_id: ""
      };
      videoInfo.video_id = this.upload_qiniu_addr + res.key;
      videoInfo.post_id = this.dynamic.post_id;
      console.log(videoInfo);
      //上传视频的接口
      postvideo(videoInfo).then(res => {
        if (res.data.code == 0) {
          this.$message.success("上传视频成功！");
        } else {
          this.$message.error("上传视频失败！");
        }
      }); //发表视频
      this.closepopup();
    },
    handleError2() {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    },
    //---------问题--------------------------------------------
    async publishquestion() {
      let self = this;
      if (!self.question.question_title) {
        self.$message({
          message: "问题不能为空",
          duration: 2000,
          type: "warning"
        });
        self.$nextTick(() => {
          self.$refs.questiontitle.focus();
        });
        return;
      }
      if (
        (self.question.question_title[
          self.question.question_title.length - 1
        ] !== "?" &&
          self.question.question_title[
            self.question.question_title.length - 2
          ] == "?") ||
        (self.question.question_title[
          self.question.question_title.length - 1
        ] !== "？" &&
          self.question.question_title[
            self.question.question_title.length - 2
          ] == "？")
      ) {
        self.$message({
          message: "问题需要以单个问号结尾",
          duration: 2000,
          type: "warning"
        });
        self.$nextTick(() => {
          self.$refs.questiontitle.focus();
        });
        return;
      }
      this.question.question_id = uuid("question");
      let data = {
        question_id: this.question.question_id,
        question_title: this.question.question_title,
        question_description: this.question.question_description,
        user_id: this.$store.state.userInfo.user_id,
        question_cover: "",
        post_time: getTime(),
        is_anonymous: this.question.isanonymous
      };
      console.log(data);
      await newquestion(data).then(res=>{
        if(res.data.code==0){
          this.$message.success("帖子内容发表成功，正在上传图片！");
          self.$refs.uploadquestionimage.submit();
        }
      })
    },
    //---------话题--------------------------------------------
    publishtopic() {
      let self = this;
      if (!self.topic.topic_name) {
        self.$message({
          message: "话题名称不能为空",
          duration: 2000,
          type: "warning"
        });
        this.$nextTick(() => {
          self.$refs.topic_name.focus();
        });
        return;
      }
      if (self.topic.topic_name.length < 4) {
        self.$message({
          message: "话题名称太短",
          duration: 2000,
          type: "warning"
        });
        self.$nextTick(() => {
          self.$refs.topic_name.focus();
        });
        return;
      }
      self.topic.topic_id = uuid("topic");
      let data = {
        topic_id: self.topic.topic_id,
        topic_name: self.topic.topic_name,
        topic_description: self.topic.topic_description,
        user_id: self.$store.state.userInfo.user_id,
        topic_cover: "",
        post_time: getTime()
      };
      console.log(data);
      //发表接口
      newtopic(data).then(res => {
        if (res.data.code == 0) {
          self.$message({
            message: "话题内容创建成功",
            duration: 2000,
            type: "success"
          });
          self.$refs.uploadtopicimage.submit();
        }
      });
      //回调中上传话题图片
      // console.log(self.topic)
    }
  },
  watch: {
    "dynamic.post_style": {
      handler(val, oldVal) {
        if (oldVal == "image" && this.$refs.uploadpostimage !== undefined) {
          this.$refs.uploadpostimage.clearFiles();
        } else if (oldVal == "image" && this.$refs.uploadvideo !== undefined) {
          this.$refs.uploadvideo.clearFiles();
        }
      },
      immediate: true
      // deep:true
    },
    searchtext: {
      async handler(val) {
        if (val !== "") {
          let params = {
            topic_name: val
          };
          await getbyname(params).then(res => {
            if (res.data.code == 0) {
              this.searchTopicresult = res.data.data;
              console.log(this.searchTopicresult);
              console.log(this.searchtext);
            }
          });
          console.log(val);
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.stopMove();
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      this.$store.dispatch("getUserInfo", userInfo);
    }
  },
  created() {
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data;
      console.log(this.qiniuData.token);
    });
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
  .question-area,
  .post-topic {
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
