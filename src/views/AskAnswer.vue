<template>
  <div class="askanswer">
    <div class="cover cover-one"></div>
    <div class="left-content">
      <div class="top-header">
        <div class="nav">
          <span
            v-for="(nav,navindex) in navlist"
            :key="navindex"
            :class="{ActiveNav: ActiveNav == nav.params}"
            @click="getcontent(nav.params)"
          >{{nav.name}}</span>
        </div>
        <el-button class="post-button" icon="el-icon-edit">发布问题</el-button>
      </div>
      <div class="cover cover-two"></div>
      <div class="content-list">
        <div class="hotlist" v-if="$route.params.type == 'hot'">
          <li class="list-item" v-for="(hotitem,hotindex) in hotlist" :key="hotindex">
            <div class="question-title">
              <span class="title">{{hotitem.question_title}}</span>
              <span class="follow-question" v-if="!hotitem.isfollowed">关注问题</span>
              <span class="follow-question" v-else>已关注</span>
            </div>
            <div class="answer-area">
              <img
                class="user-avatar"
                :src="hotitem.answser_author.user_avatar"
                alt="用户头像"
                v-if="hotitem.isanonymous"
              />
              <img class="user-avatar" src="../assets/icon/anonymous.png" alt="匿名" v-else />
              <div class="content">
                <div class="time-info">
                  <div class="user-name">{{hotitem.answser_author.user_nickname}}</div>
                  <div class="post-time" v-html="gettime(hotitem.post_time)"></div>
                </div>
                <div class="rich-content" :class="{iscollapsed:hotitem.iscollapsed}" @click="readall(hotitem)" >
                  <div class="RichContent-inner">
                    <span
                      class="RichText ztext CopyrightRichText-richText"
                      itemprop="articleBody"
                    >{{hotitem.answer_content}}</span>
                    <button type="button" class="Button ContentItem-more Button--plain" v-if="hotitem.iscollapsed">
                      ...阅读全文
                      <span>
                        <i class="el-icon-arrow-down"></i>
                      </span>
                    </button>
                  </div>
                </div>
                <div class="operate">
                  <div class="agree">
                    <el-button class="el-b" type="primary" icon="el-icon-caret-top" v-if="hotitem.isagree">赞同 {{calculate(hotitem.agreecount)}}</el-button>
                    <el-button class="el-b" type="primary" icon="el-icon-caret-top" v-else plain>赞同 {{calculate(hotitem.agreecount)}}</el-button>
                  </div>
                  <div class="answer">
                    <i class="el-icon-chat-line-round" style="font-size:15px"></i>
                    <span>{{calculate(hotitem.commentcount)}}条评论</span>
                  </div>
                  <div class="uncollapsed" v-if="!hotitem.iscollapsed" @click="shouqi(hotitem)">
                    收起<i class="el-icon-arrow-up"></i>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </div>
        <div class="newlist" v-if="$route.params.type == 'new'">fff</div>
        <div class="follows" v-if="$route.params.type == 'follows'">ddd</div>
      </div>
    </div>
    <!-- 用户卡片和登录 -->
    <div class="right-area">
      <LoginUserinfo />
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { showformattime } from "../utils/index.js";
import LoginUserinfo from "@/components/LoginUserinfo.vue";

export default {
  name: "AskAnswer",
  components: {
    LoginUserinfo
  },
  data() {
    return {
      navlist: [
        {
          name: "热门问答",
          params: "hot"
        },
        {
          name: "等你来答",
          params: "new"
        },
        {
          name: "我关注的",
          params: "follows"
        }
      ],
      hotlist: [
        {
          question_id: "1111",
          question_title: "如何给猫洗澡?",
          isfollowed: true,
          answer_id: "",
          answser_author: {
            user_nickname: "匿名用户",
            user_avatar: require("../assets/img/reg6.jpg")
          },
          isanonymous: false,
          post_time: "1618654274090",
          answer_content: "我不知道",
          agreecount: 111,
          isagree:false,
          commentcount: 22,
          comments: [],
          iscollapsed: true //获取数据后手动添加默认折叠
        },
        {
          question_id: "1111",
          question_title: "如何给猫洗澡?",
          isfollowed: false,
          answer_id: "",
          answser_author: {
            user_nickname: "半途",
            user_avatar: require("../assets/img/reg6.jpg")
          },
          isanonymous: true,
          post_time: "1618654274090",
          answer_content:
            "哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或发发发发发发发发发发发付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付",
          agreecount: 1111111,
          isagree: true,
          commentcount: 22234,
          comments: [],
          iscollapsed: false //获取数据后手动添加默认折叠
        }
      ]
    };
  },
  methods: {
    //导航栏切换
    getcontent(i) {
      let self = this;
      self.$router.replace({
        name: "AskAnswer",
        params: {
          type: i
        }
      });
      console.log(self.$route.params.type);
      if (i == "hot") {
        //获取热门
      } else if (i == "follows") {
        //获取关注
      } else if (i == "new") {
        // 获取新问题
      }
    },
    //格式化时间
    gettime(i) {
      return showformattime(i);
    },
    //数据格式化
    calculate(i) {
      if(parseInt(i)>=10000){
        i = (parseInt(i)/10000).toFixed(1)
        return `${i}万`;
      } else {
        return i;
      }
    },
    readall(hotitem){
      if(hotitem.iscollapsed){
        this.$set(hotitem, 'iscollapsed', false)
      }
    },
    shouqi(hotitem){
      if(!hotitem.iscollapsed){
        this.$set(hotitem, 'iscollapsed', true)
      }
    }
  },
  computed: {
    ActiveNav() {
      return this.$route.params.type;
    }
  },
  watch: {},
  mounted() {
    console.log(this.$route.params.type);
  }
};
</script>
<style lang="scss" scoped>
.askanswer {
  min-height: 800px;
  min-width: 1000px;
  width: 1000px;
  margin: 0 auto;
  margin-top: 65px;
  display: flex;
  .left-content {
    width: 740px;
    .top-header {
      height: 35px;
      display: flex;
      position: fixed;
      top: 65px;
      width: 740px;
      background-color: #f6f6f6;
      .nav {
        background: #fff;
        flex: 1;
        margin-right: 100px;
        border-radius: 2px;
        display: flex;
        justify-content: space-around;
        box-shadow: 1px 1px 5px rgb(207, 206, 206),
          0px -1px 5px rgb(207, 206, 206);
        span {
          flex: 1;
          align-self: center;
          text-align: center;
          letter-spacing: 2px;
          font-weight: 500;
          cursor: pointer;
          border-right: 2px solid rgb(216, 215, 215);
          &:nth-last-child(1) {
            border-right: none;
          }
        }
        .ActiveNav {
          font-weight: 600;
        }
      }
      .post-button {
        width: 100px;
        margin-left: auto;
        background-color: rgb(255, 231, 145);
        color: #fff;
        font-weight: 600;
        box-shadow: 1px 1px 5px rgb(207, 206, 206),
          0px -1px 5px rgb(207, 206, 206);
        &:hover {
          background-color: #fdda5a;
        }
        &:active {
          border: none;
        }
      }
    }
    .content-list {
      margin-top: 45px;
      min-height: 500px;
      background: #fff;
      box-shadow: 1px 1px 3px rgb(207, 206, 206);
      padding: 10px 20px;
      .hotlist,
      .newlist {
        .list-item {
          list-style-type: none;
          border-bottom: 1px solid #f0f2f7;
          padding: 10px 0px;
          &:first-child {
            padding-top: 0;
          }
          .question-title {
            width: 100%;
            display: flex;
            height: 30px;
            justify-content: center;
            .title {
              font-size: 16px;
              align-self: center;
              font-weight: 600;
            }
            .follow-question {
              margin-left: auto;
              align-self: center;
              text-align: center;
              font-size: 12px;
              color: #fff;
              cursor: pointer;
              width: 70px;
              padding: 5px 8px;
              background-color: #fdda5a;
              border-radius: 2px;
              &:hover {
                color: rgb(255, 200, 0);
              }
            }
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
              .rich-content {
                line-height: 1.67;
                margin-top: 3px;
                .RichContent-inner {
                  max-height: 80px;
                  word-break: break-all;
                  text-overflow: ellipsis;
                  display: -webkit-Box;
                  -webkit-line-clamp: 3;
                  -webkit-Box-orient: vertical;
                  overflow: hidden;
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
              .iscollapsed {
                margin: 3px 0;
                padding-bottom: 3px;
                cursor: pointer;
                transition: color 0.14s ease-out;
                border-bottom: 1px solid rgb(240, 238, 238);
                &:hover {
                  color: #646464;
                }
              }
              .operate {
                display: flex;
                margin-top: 8px;
                .agree {
                  background-color: #0066ff1a;
                  color: #0066FF;
                  .el-b {
                    padding: 7px 8px;
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
                }
              }
            }
          }
        }
      }
    }
  }
  .right-area {
    position: fixed;
    margin-left: 750px;
  }
}
.cover {
  background-color: #f6f6f6;
  height: 15px;
  position: fixed;
  z-index: 2;
}
.cover-one {
  top: 50px;
  width: 1005px;
  left: 50%;
  transform: translateX(-50%);
}
.cover-two {
  width: 750px;
  top: 100px;
  height: 10px;
  transform: translateX(-5px);
}
</style>
