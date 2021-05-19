<template>
  <div class="art-detail" id="art-detail">
    <div class="back">
      <el-button @click="back" class="back-buton" icon="el-icon-arrow-left" circle></el-button>
    </div>
    <div v-if="art.art_id" class="art-body">
      <div class="title">{{art.art_title}}</div>
      <div class="user">
        <img class="avatar" :src="art.user_avatar" alt="用户头像" />
        <div class="user-name">{{art.user_nickname}}</div>
        <div class="time" v-html="gettime(art.post_time)"></div>
        <!-- 还需要判断是不是本人 -->
        <el-button
          class="unfollow"
          @click="followuser"
          v-if="!art.isfollow && $store.state.userInfo.user_id!=art.user_id"
        >关注TA</el-button>
        <el-button
          class="follow"
          v-if="art.isfollow && $store.state.userInfo.user_id!=art.user_id"
        >已关注</el-button>
      </div>
      <div class="art-guide">导读：{{art.art_guide}}</div>
      <div class="art-content" v-html="art.art_content"></div>
      <div class="operate artoperate">
        <div class="art read">
          <span>阅 读：</span>
          <span>{{calculatedata(art.art_browses)}}</span>
        </div>
        <div class="art">
          <img
            @click.stop="collectionart(art)"
            v-if="!art.iscollection"
            src="../assets/icon/collection.png"
            alt
          />
          <img
            @click.stop="uncollectionart(art)"
            v-else
            src="../assets/icon/collection-active.png"
            alt
          />
          <span>{{calculatedata(art.art_collections)}}</span>
        </div>
        <!-- 分割线 -->
        <div class="art line"></div>
        <div class="art">
          <img @click.stop="likeart(art)" v-if="!art.isliked" src="../assets/icon/like.png" alt />
          <img @click.stop="dislikeart(art)" v-else src="../assets/icon/like-active.png" alt />
          <span>{{calculatedata(art.art_likes)}}</span>
        </div>
      </div>
      <el-collapse accordion @change="cleartext">
        <el-collapse-item class="comment-area">
          <template slot="title">展开评论({{calculatedata(art.art_comments)}})</template>
          <div class="post-comment">
            <el-input
              class="comment-input"
              type="textarea"
              :rows="1"
              placeholder="和大家分享你的看法吧！"
              v-model="commenttextarea"
            ></el-input>
            <el-button @click.stop="commentart(art)" class="post-comment-button">发表</el-button>
          </div>
          <div class="sort-order">
            <div class="sort">
              <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
              <span class="sort-text">切换为{{art.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
            </div>
          </div>
          <!-- <div 
                class="" 
                v-loading="true"
                element-loading-text="玩命加载中"
                element-loading-background="rgba(255, 255, 255, 0)">
          </div>-->
          <li class="comment-list" v-for="(comment,cindex) in art.comments" :key="cindex">
            <!-- 一级评论 -->
            <!-- <div class="user"> -->
            <img class="user-avatar" :src="comment.user_avatar" alt="用户头像" />
            <div class="userinfo-comment">
              <div class="user-nickname-like">
                <span class="user-nickname">{{comment.user_nickname}}：</span>
                <!-- <img class="like" v-if="comment.isagreeed" src="../assets/icon/like.png" alt />
                <img class="like" v-else src="../assets/icon/like-active.png" alt />-->
                <!-- 为0不显示 -->
                <!-- <span
                      class="agree-count"
                      v-if="comment.reply_agree_count"
                >{{comment.reply_agree_count}}</span>-->
              </div>
              <p>{{comment.comment_content}}</p>
              <div class="comment-time">
                <span v-html="gettime(comment.reply_time)"></span>
                <!-- <span class="reply">回复</span> -->
              </div>
              <!-- 二级评论 -->
              <!-- <li
                    class="reply-user"
                    v-for="(rcomment,rindex) in comment.related_reply"
                    :key="rindex"
                  >
                    <img
                      class="user-avatar second-avatar"
                      :src="rcomment.author.user_avatar"
                      alt="用户头像"
                    />
                    <div class="userinfo-comment">
                      <div class="user-nickname-like">
                        <span class="user-nickname">{{rcomment.author.user_nickname}}：</span>
                        <img
                          class="like"
                          v-if="rcomment.isagreeed"
                          src="../assets/icon/like.png"
                          alt
                        />
                        <img class="like" v-else src="../assets/icon/like-active.png" alt />
                        <span
                          class="agree-count"
                          v-if="rcomment.reply_agree_count"
                        >{{rcomment.reply_agree_count}}</span>
                      </div>
                      <p>{{rcomment.comment_content}}</p>
                      <div class="comment-time">
                        <span v-html="gettime(comment.reply_time)"></span>
                        <span class="reply">回复</span>
                      </div>
                    </div>
              </li>-->
            </div>
          </li>
        </el-collapse-item>
      </el-collapse>
    </div>
    <NoData v-else text="文章获取异常" />
  </div>
</template>
<script>
import { showformattime, getTime, uuid } from "../utils/index.js";
import { followuser, unfollowuser } from "../utils/api/user.js";
import {
  artdetail,
  likeart,
  dislikeart,
  collectionart,
  uncollectionart,
  commentart
} from "../utils/api/art.js";
import NoData from "@/components/NoData";
export default {
  name: "ArtDetail",
  components: {
    NoData
  },
  props: ["art_id"],
  data() {
    return {
      commenttextarea: "", //评论内容
      art: {
        user_avatar: "http://cdn.fengblog.xyz/54f9b66041ab8c16",
        user_grade: 0,
        user_id: "usera52d428483",
        user_nickname: "半途",
        art_id: "11",
        art_title: "养猫的第十五天",
        art_cover: "http://cdn.fengblog.xyz/54f9b66041ab8c16",
        art_guide: "养猫，",
        art_content: "<p>哈哈哈<h1>hhhhh</h1></p>",
        post_time: "1620279629571",
        art_likes: 0,
        art_collections: 0,
        art_comments: 1,
        art_browses: 0,
        iscollection: 0,
        isliked: 0,
        isfollow: 0,
        is_public: 1,
        comments: [
          {
            comment_content: "哈哈哈哈，我觉得都很可爱，你们觉得呢",
            reply_id: "pce3cc604eaca6a",
            reply_time: "1620284257493",
            user_avatar: "http://cdn.fengblog.xyz/54f9b66041ab8c16",
            user_id: "usera52d4284838",
            user_nickname: "半途"
          }
        ]
      }
    };
  },
  methods: {
    back() {
      this.$router.back(1);
    },
    cleartext() {
      this.commenttextarea = "";
    },
    //格式化时间
    gettime(i) {
      return showformattime(i);
    },
    //格式化点赞收藏数据
    calculatedata(i) {
      if (parseInt(i) >= 10000) {
        i = (parseInt(i) / 10000).toFixed(1);
        return `${i}万`;
      } else {
        return i;
      }
    },
    async followuser(i) {
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        follow: i.user_id,
        fans: this.$store.state.userInfo.user_id,
        follow_time: getTime()
      };
      let res = await followuser(data);
      if (res.data.code == 0) {
        this.$set(i, "isfollow", 1);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    async unfollowuser(i) {
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        follow: i.user_id,
        fans: this.$store.state.userInfo.user_id
      };
      let res = await unfollowuser(data);
      if (res.data.code == 0) {
        this.$set(i, "isfollow", 0);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //点赞
    async likeart(art) {
      console.log(art);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: art.art_id,
        user_id: this.$store.state.userInfo.user_id,
        operate_time: getTime()
      };
      let res = await likeart(data);
      if (res.data.code == 0) {
        let count = art.art_likes + 1;
        this.$set(art, "isliked", 1);
        this.$set(art, "art_likes", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //取消点赞
    async dislikeart(art) {
      console.log(art);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: art.art_id,
        user_id: this.$store.state.userInfo.user_id
      };
      let res = await dislikeart(data);
      if (res.data.code == 0) {
        this.$set(art, "isliked", 0);
        let count = art.art_likes - 1;
        this.$set(art, "art_likes", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //收藏
    async collectionart(art) {
      console.log(art);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: art.art_id,
        user_id: this.$store.state.userInfo.user_id,
        operate_time: getTime()
      };
      let res = await collectionart(data);
      if (res.data.code == 0) {
        this.$set(art, "iscollection", 1);
        let count = art.art_collections + 1;
        this.$set(art, "art_collections", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //取消收藏
    async uncollectionart(art) {
      console.log(art);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: art.art_id,
        user_id: this.$store.state.userInfo.user_id
      };
      let res = await uncollectionart(data);
      if (res.data.code == 0) {
        this.$set(art, "iscollection", 0);
        let count = art.art_collections - 1;
        this.$set(art, "art_collections", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //评论
    async commentart(art) {
      console.log(art);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      if (!this.commenttextarea) {
        this.$message({
          message: "评论内容不能为空！",
          duration: 2000,
          type: "warning"
        });
        return;
      }
      let data = {
        reply_id: uuid("art_comment"),
        art_id: art.art_id,
        user_id: this.$store.state.userInfo.user_id,
        comment_content: this.commenttextarea,
        reply_time: getTime()
      };
      await commentart(data).then(res => {
        if (res.data.code == 0) {
          let list = art.comments;
          let obj = {
            reply_id: data.reply_id,
            comment_content: data.comment_content,
            user_id: this.$store.state.userInfo.user_id,
            user_nickname: this.$store.state.userInfo.user_nickname,
            user_avatar: this.$store.state.userInfo.user_avatar,
            reply_time: data.reply_time
          };
          console.log(list);
          list.push(obj);
          art.comments = list;
          let count = art.art_comments + 1;
          this.$set(art, "art_comments", count);
          console.log(art);
          this.commenttextarea = "";
          this.$message({
            message: "评论成功！",
            duration: 2000,
            type: "success"
          });
        }
      });
    },
    async getdetail() {
      let data = {
        art_id: this.art_id,
        user_id: this.$store.state.userInfo.user_id
      };
      console.log(data);
      let res = await artdetail(data);
      if (res.data.code == 0) {
        this.art = res.data.data;
      } else {
        this.$message({
          message: "系统异常，文章详情获取失败！",
          duration: 2000,
          type: "error"
        });
        this.back();
      }
    }
  },
  mounted() {
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      this.$store.dispatch("getUserInfo", userInfo);
    }
    //获取详情
    this.getdetail();
  }
};
</script>
<style lang="scss" scoped>
.back {
  position: fixed;
  z-index: 1;
  top: 65px;
  transform: translateX(-60px);
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
.art-detail {
  // min-height: 800px;
  width: 1000px;
  background-color: #fff;
  margin: 65px auto 0;
  .art-body {
    padding: 10px 20px;
    .title {
      font-size: 34px;
      font-weight: 600;
      line-height: 44px;
      color: #222;
      padding: 5px 0;
      border-bottom: 1px solid #f0f2f7;
    }
    .user {
      padding: 5px 0;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #777777;
      // border-bottom: 1px solid #f0f2f7;
      .avatar {
        height: 40px;
        width: 40px;
        object-fit: cover;
        border-radius: 50%;
      }
      .user-name {
        margin-left: 15px;
        line-height: 20px;
        letter-spacing: 1px;
      }
      .time {
        margin-left: 15px;
        line-height: 20px;
      }
      .follow {
        line-height: 20px;
        margin-left: auto;
        color: #fff;
        cursor: pointer;
        border: 1px solid rgb(238, 236, 236);
        padding: 5px 8px;
        background-color: #fdda5a !important;
        border-radius: 3px;
        &:hover {
          background-color: #f8c405 !important;
        }
      }
      .unfollow {
        line-height: 20px;
        margin-left: auto;
        color: #a5a5a5;
        cursor: pointer;
        border: 1px solid rgb(238, 236, 236);
        padding: 5px 8px;
        background-color: #fff6d4 !important;
        border-radius: 3px;
        &:hover {
          background-color: #f8c405 !important;
        }
      }
    }
    .art-guide {
      text-indent: 2em;
      font-size: 16px;
    }
    .art-content {
      margin-top: 10px;
      p {
        img {
          width: 200px;
        }
        .wscnph {
          width: 100px;
          height: 200px;
        }
      }
    }
    .operate {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 30px;
      margin: 8px;
      padding-top: 5px;
      border-top: 1px solid #ebeef5;
      .art {
        width: 120px;
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 22px;
          margin-right: 5px;
          cursor: pointer;
        }
        span {
          height: 22px;
          line-height: 26px;
          cursor: pointer;
        }
      }
      .line {
        width: 2px;
        background-color: #cfcfcf;
        height: 15px;
        padding: 0;
      }
    }
    .artoperate {
      .read {
        width: 100px;
        font-size: 13px;
        margin-right: auto;
      }
    }
    .comment-area {
      padding: 0 30px;
      box-shadow: 1px 1px 3px rgb(207, 206, 206);
      .post-comment {
        display: flex;
        align-items: center;
        .comment-input {
          flex: 1;
        }
        .post-comment-button {
          width: 56px;
          background-color: #fdda5a;
          color: #fff;
          margin-left: 20px;
          padding: 5px 8px;
          text-align: center;
        }
      }
      .comment-list {
        clear: both;
        list-style-type: none;
        display: flex;
        margin-top: 6px;
        border-bottom: 1px solid #f0f2f7;
        padding: 7px 0px;
        &:nth-last-child(1) {
          border-bottom: none;
        }
      }
      .reply-user {
        list-style-type: none;
        display: flex;
        margin-top: 6px;
      }
      .sort-order {
        width: 100%;
        margin-left: auto;
        margin: 8px 0;
        border-bottom: 1px solid #ebeef5;
        .sort {
          display: flex;
          justify-content: flex-end;
          .sort-icon {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
          .sort-text {
            margin-left: 10px;
            font-size: 12px;
            color: #9f9fa0;
          }
        }
      }
    }
  }
}
// 评论公共样式
.user-avatar {
  height: 30px;
  width: 30px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
}
.second-avatar {
  height: 22px;
  width: 22px;
}
.userinfo-comment {
  font-size: 12px;
  width: 100%;
  margin-left: 5px;
  .user-nickname-like {
    // height: 20px;
    line-height: 20px;
    display: flex;
    .user-nickname {
      font-weight: 600;
      cursor: pointer;
    }
    .like {
      cursor: pointer;
      height: 15px;
      margin-left: auto;
    }
    .agree-count {
      margin-left: 8px;
      color: #9f9fa0;
    }
  }
  p {
    word-break: break-all;
    line-height: 12px;
  }
  .comment-time {
    height: 10px;
    line-height: 10px;
    margin-top: 5px;
    color: rgb(159, 159, 160);
    .reply {
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
</style>