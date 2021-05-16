<template>
  <div class="question">
    <div class="back">
      <el-button @click="back" class="back-buton" icon="el-icon-arrow-left" circle></el-button>
    </div>
    <div class="question-area">
      <div class="top-question">
        <div class="question-box">
          <div class="title">{{question.question_title}}</div>
          <div class="rich-content" :class="{iscollapsed:question.iscollapsed}" @click="readall()">
            <div class="RichContent-inner">
              <span
                class="RichText ztext CopyrightRichText-richText"
                itemprop="articleBody"
              >{{question.question_description}}</span>
              <img style="display:block;" v-if="!question.iscollapsed && question.question_cover" height="200px" :src="question.question_cover" alt="">
              <button
                type="button"
                class="Button ContentItem-more Button--plain"
                v-if="question.iscollapsed"
              >
                ...阅读全文
                <span>
                  <i class="el-icon-arrow-down"></i>
                </span>
              </button>
            </div>
          </div>
          <div class="operate">
            <div class="follow">
              <el-button
                class="el-follow"
                icon="el-icon-caret-top"
                v-if="question.isfollow"
                @click="unfollowquestion(question)"
              >您已关注</el-button>
              <el-button
                class="el-unfollow"
                icon="el-icon-caret-top"
                v-else
                plain
                @click="followquestion(question)"
              >关注问题</el-button>
            </div>
            <el-button class="Button-answer" icon="el-icon-edit">我来回答</el-button>
            <!-- <div class="answer">
              <i class="el-icon-chat-line-round" style="font-size:15px"></i>
              <span>{{calculate(question.answer_count)}}条回答</span>
            </div> -->
            <div class="uncollapsed" v-if="!question.iscollapsed" @click.stop="shouqi()">
              收起
              <i class="el-icon-arrow-up"></i>
            </div>
          </div>
        </div>
        <div class="data-area">
          <div class="follow">关注：{{question.follow_count}}</div>
          <div class="hot">浏览：{{question.question_hot}}</div>
        </div>
      </div>
      <div class="answer-list">
        <div class="sort-order" v-if="(question.answer|| []).length">
          <span>共{{(question.answer|| []).length}}条回答</span>
          <div class="sort">
            <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
            <span class="sort-text">切换为{{question.answer_sort_by == 'hot'? '时间':'热度'}}排序</span>
          </div>
        </div>
        <div class="answer-item" v-if="(question.answer|| []).length">
          <li class="list-item" v-for="(item,itemindex) in question.answer" :key="itemindex">
            <div class="answer-area">
              <img
                class="user-avatar"
                :src="item.user_avatar"
                alt="用户头像"
                v-if="!item.is_anonymous"
              />
              <img class="user-avatar" src="../assets/icon/anonymous.png" alt="匿名" v-else />
              <div class="content">
                <div class="time-info">
                  <div class="user-name">{{item.user_nickname}}</div>
                  <div class="post-time" v-html="gettime(item.post_time)"></div>
                </div>
                <div class="answer-count">{{item.answer_content}}</div>
              </div>
            </div>
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <div class="answer-operate">
                    <div class="agree">
                      <el-button
                        class="el-agree"
                        icon="el-icon-caret-top"
                        v-if="item.isagree"
                        @click.stop="disagreeanswer(item)"
                      >赞同 {{calculate(item.agree_count)}}</el-button>
                      <el-button
                        class="el-disagree"
                        icon="el-icon-caret-top"
                        v-else
                        @click.stop="agreeanswer(item)"
                        plain
                      >赞同 {{calculate(item.agree_count)}}</el-button>
                    </div>
                    <div class="answer">
                      <i class="el-icon-chat-line-round" style="font-size:15px"></i>
                      <span>{{calculate(item.comment_count)}}条评论</span>
                    </div>
                    <div class="uncollapsed" v-if="!item.iscollapsed" @click.stop="shouqi(item)">
                      收起
                      <i class="el-icon-arrow-up"></i>
                    </div>
                  </div>
                </template>
                <div class="comments">
                  <div class="post-comment">
                    <el-input
                      class="comment-input"
                      type="textarea"
                      :rows="1"
                      placeholder="和大家分享你的看法吧！"
                      v-model="commenttextarea"
                    ></el-input>
                    <el-button class="post-comment-button">发表</el-button>
                  </div>
                  <div class="sort-order">
                    <div class="sort">
                      <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
                      <span class="sort-text">切换为{{item.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                    </div>
                  </div>
                  <li class="comment-list" v-for="(comment,cindex) in item.comments" :key="cindex">
                    <!-- 一级评论 -->
                    <!-- <div class="user"> -->
                    <img class="user-avatar" :src="comment.user_avatar" alt="用户头像" />
                    <div class="userinfo-comment">
                      <div class="user-nickname-like">
                        <span class="user-nickname">{{comment.user_nickname}}：</span>
                        <!-- <img
                          class="like"
                          v-if="comment.isagreeed"
                          src="../assets/icon/like.png"
                          alt
                        />
                        <img class="like" v-else src="../assets/icon/like-active.png" alt /> -->
                        <!-- 为0不显示 -->
                        <!-- <span
                          class="agree-count"
                          v-if="comment.reply_agree_count"
                        >{{comment.reply_agree_count}}</span> -->
                      </div>
                      <p>{{comment.reply_content}}</p>
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
                            <span class="user-nickname">
                              {{rcomment.author.user_nickname}}
                              <span
                                v-if="rcomment.reply_to_author.user_id"
                              >回复{{rcomment.reply_to_author.user_nickname}}</span>
                              :
                            </span>
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
                          <p>{{rcomment.reply_content}}</p>
                          <div class="comment-time">
                            <span>{{gettime(comment.reply_time)}}</span>
                            <span class="reply">回复</span>
                          </div>
                        </div>
                      </li> -->
                    </div>
                  </li>
                </div>
              </el-collapse-item>
            </el-collapse>
          </li>
        </div>
        <NoData v-else text="暂无回答"/>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { showformattime,getTime } from "../utils/index.js";
import { getdetails,browsequestion,followquestion,unfollowquestion } from "../utils/api/question.js";
import NoData from "../components/NoData"
export default {
  name: "Question",
  components: {
    NoData
  },
  data() {
    return {
      commenttextarea: "",
      question: {
        // question_id: "1111",
        // question_title: "如何给猫洗澡?",
        // question_description:
        //   "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或",
        // question_hot: 222, // 热度，浏览次数
        // answer_count: 2,
        // follow_count: 0,
        // post_time: "1619346234369",
        // isfollow: false,
        // is_anonymous: true,
        // question_cover: "", //问题配图一张
        // iscollapsed: true, //手动添加，折叠
        // answer_sort_by: "hot",
        // answer: [
        //   {
        //     answer_id: "0",
        //     user_nickname: "匿名用户",
        //     user_avatar: require("../assets/img/reg6.jpg"),
        //     is_anonymous: false, //是否匿名回答
        //     post_time: "1618654274090",
        //     answer_content: "我不知道",
        //     agree_count: 111,
        //     isagree: false,
        //     comment_count: 22,
        //     iscollapsed: true, //获取数据后手动添加默认折叠
        //     comments: [
        //       //评论数组
        //       {
        //         //一级评论
        //         answer_reply_id: "comments111",
        //         reply_content: "真可爱",
        //         user_id: "", //评论者
        //         user_nickname: "半途",
        //         user_avatar: require("../assets/img/reg3.jpg"),
        //         reply_time: "1618654274090",
        //         reply_agree_count: 0,
        //         isagreeed: Boolean,
        //         //二级评论
        //         related_reply: [
        //           {
        //             answer_reply_id: "111",
        //             author: {
        //               user_id: "",
        //               user_nickname: "乖乖李",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_to_author: {
        //               user_id: "111",
        //               user_nickname: "半途",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_content: "真可爱",
        //             reply_time: "",
        //             reply_agree_count: 111,
        //             isagree: Boolean
        //           }
        //         ]
        //       },
        //       {
        //         //一级评论
        //         answer_reply_id: "comments111",
        //         reply_content: "真可爱",
        //         user_id: "",
        //         user_nickname: "半途",
        //         user_avatar: require("../assets/img/reg3.jpg"),
        //         reply_time: "1618654274090",
        //         reply_agree_count: 0,
        //         isagreeed: Boolean,
        //         //二级评论
        //         related_reply: [
        //           {
        //             answer_reply_id: "111",
        //             author: {
        //               user_id: "",
        //               user_nickname: "乖乖李",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_to_author: {
        //               user_id: "",
        //               user_nickname: "半途",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_content: "真可爱",
        //             reply_time: "",
        //             reply_agree_count: 111,
        //             isagreeed: Boolean
        //           }
        //         ]
        //       }
        //     ]
        //   }
        // ]
      }
    };
  },
  methods: {
    back() {
      this.$router.back(1);
    },
    getdata() {
      //
    },
    //格式化时间
    gettime(i) {
      return showformattime(i);
    },
    //数据格式化
    calculate(i) {
      if (parseInt(i) >= 10000) {
        i = (parseInt(i) / 10000).toFixed(1);
        return `${i}万`;
      } else {
        return i;
      }
    },
    //阅读全文
    readall() {
      if (this.question.iscollapsed) {
        this.$set(this.question, "iscollapsed", false);
      }
    },
    //收起全文
    shouqi() {
      if (!this.question.iscollapsed) {
        this.$set(this.question, "iscollapsed", true);
      }
    },
    async followquestion(item){
      let data= {
        question_id:item.question_id,
        user_id:this.$store.state.userInfo.user_id,
        follow_time:getTime()
      }
      console.log(data)
      let res= await followquestion(data)
      if(res.data.code == 0) {
        this.$set(item, "isfollow", 1);
        if(item.follow_count!==undefined){
          let count = item.follow_count + 1;
          this.$set(item, "follow_count", count);
        }
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    async unfollowquestion(item){
      let data= {
        question_id:item.question_id,
        user_id:this.$store.state.userInfo.user_id,
        follow_time:getTime()
      }
      let res= await unfollowquestion(data)
      if(res.data.code == 0) {
        this.$set(item, "isfollow", 0);
        if(item.follow_count!==undefined){
          let count = item.follow_count - 1;
          this.$set(item, "follow_count", count);
        }
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //赞同
    agreeanswer(item) {
      console.log(item.isagree);
      if (!item.isagree) {
        this.$set(item, "isagree", true);
      }
      console.log(item.isagree);
    },
    //取消赞同
    disagreeanswer(item) {
      console.log(item.isagree);
      if (item.isagree) {
        this.$set(item, "isagree", false);
      }
      console.log(item.isagree);
    },
  },
  async mounted() {
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      this.$store.dispatch("getUserInfo", userInfo);
    }
    let params = {
      user_id:this.$store.state.userInfo.user_id,
      question_id:this.$route.query.question_id
    }
    console.log(params)
    let res = await getdetails(params)
    if(res.data.code == 0) {
      this.question = res.data.data
      this.$set(this.question, "iscollapsed", true);
    }else {
      this.$message({
        message: "抱歉，系统异常！",
        duration: 2000,
        type: "error"
      });
    }
    //浏览，游客不计数
    if(this.$store.state.userInfo.user_id){
      let data = {
        question_id:this.$route.query.question_id
      }
      browsequestion(data)
    }
  }
};
</script>
<style lang="scss" scoped>
.question {
  min-height: 600px;
  width: 1000px;
  margin: 0 auto;
  margin-top: 65px;
  // background-color: #fff;
  position: relative;
  border-radius: 5px;
  .back {
    position: fixed;
    z-index: 1;
    top: 65px;
    transform: translateX(-60px);
    // left: -60px;
    .back-buton {
      height: 45px;
      width: 45px;
      // background-color: #ffe589;
    }
  }
  .question-area {
    .top-question {
      padding: 10px 20px;
      background-color: #fff;
      display: flex;
      box-shadow: 1px 2px 3px rgb(207, 206, 206),
        -1px 0px 3px rgb(207, 206, 206);
      .question-box {
        width: 720px;
        .title {
          font-weight: 600;
          letter-spacing: 1px;
          font-size: 28px;
        }
        .rich-content {
          line-height: 1.67;
          margin-top: 5px;
          .RichContent-inner {
            // max-height: 80px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-Box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin: 5px 0 10px 0;
            .ztext {
              word-break: break-word;
              line-height: 1.6;
              white-space: normal;
            }
            .Button {
              display: inline-block;
              font-size: 14px;
              text-align: center;
              cursor: pointer;
              background: none;
            }
            .Button--plain {
              height: auto;
              padding: 0;
              line-height: inherit;
              background-color: transparent;
              border: none;
              outline: none;
              border-radius: 0;
            }
            .ContentItem-more {
              padding: 0;
              margin-left: 4px;
              color: #175199;
            }
          }
        }
        .operate {
          display: flex;
          width: 100%;
          .follow {
            .el-follow {
              color: #fff;
              background-color: #ffda5a !important;
            }
            .el-unfollow {
              color: #a5a5a5;
              background-color: #fff6d4 !important;
            }
          }
          .answer {
            margin-left: 20px;
            align-self: center;
            color: #8590a6;
            span {
              margin-left: 5px;
              font-size: 12px;
            }
          }
          .Button-answer {
            // color: #fff;
            color: #ffda5a;
            background-color: #fff !important;
            margin-left: 20px;
            border: 1px solid #dcdfe6;
          }
          .uncollapsed {
            color: #8590a6;
            margin-left: auto;
            cursor: pointer;
            margin-right: 50px;
            &:hover {
              color: #76839b;
            }
          }
        }
        .iscollapsed {
          margin: 3px 0;
          padding-bottom: 3px;
          cursor: pointer;
          transition: color 0.14s ease-out;
          &:hover {
            color: #646464;
          }
        }
      }
      .data-area {
        flex: 1;
        height: 114px;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 14px;
        box-shadow: 1px 1px 3px gray;
        .follow,
        .hot {
          flex: 1;
          display: flex;
          align-items: center;
          align-self: center;
        }
        .hot {
          border-top: 2px solid rgb(199, 199, 199);
        }
      }
    }
    .answer-list {
      width: 740px;
      // margin: 0 auto;
      margin-top: 15px;
      padding: 10px 20px;
      background-color: #fff;
      box-shadow: 1px 1px 3px rgb(207, 206, 206);
      .sort-order {
        width: 100%;
        display: flex;
        padding: 8px 0;
        border-bottom: 1px solid #ebeef5;
        .sort {
          display: flex;
          margin-left: auto;
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
      .answer-item {
        .list-item {
          list-style-type: none;
          border-bottom: 1px solid #f0f2f7;
          padding: 8px 0px;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          &:first-child {
            padding-top: 0;
          }
          .answer-area {
            margin: 5px 0px;
            display: flex;
            .user-avatar {
              height: 30px;
              width: 30px;
              border-radius: 5px;
              border: 1px solid #f0f2f7;
            }
            .content {
              width: 100%;
              margin-left: 5px;
              .time-info {
                display: flex;
                width: 100%;
                height: 30px;
                .user-name {
                  font-size: 14px;
                  align-self: center;
                }
                .post-time {
                  align-self: center;
                  margin-left: auto;
                  font-size: 12px;
                  color: #808080;
                }
              }
            }
          }
          .answer-operate {
            display: flex;
            width: 100%;
            .agree {
              .el-agree {
                // padding: 7px 8px !important;
                color: #fff;
                background-color: #ffda5a !important;
              }
              .el-disagree {
                // padding: 7px 8px !important;
                // color: #409eff;
                // background-color: #ecf5ff !important;
                color: #a5a5a5;
                background-color: #fff6d4 !important;
              }
            }
            .answer {
              margin-left: 20px;
              align-self: center;
              color: #8590a6;
              span {
                margin-left: 5px;
                font-size: 12px;
              }
            }
            .uncollapsed {
              color: #8590a6;
              margin-left: auto;
              cursor: pointer;
              margin-right: 50px;
              &:hover {
                color: #76839b;
              }
            }
          }
          .comments {
            padding: 10px 25px;
            border: 1px solid #ebebeb;
            border-radius: 4px;
            box-shadow: 0 1px 3px #1212121a;
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
              padding: 5px 0px;
              border-bottom: 1px solid #ebebeb;
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
          .noanswer {
            color: #8590a6;
            font-size: 14px;
            .Button-answer {
              color: #fff;
              background-color: #fce07b !important;
              margin: 10px 0;
            }
            span {
              display: inline-block;
              margin-left: 20px;
            }
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