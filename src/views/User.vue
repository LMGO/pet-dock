<template>
  <div class="user-page" id="user-page">
    <div class="back">
      <el-button @click="back" class="back-buton" icon="el-icon-arrow-left" circle></el-button>
    </div>
    <div class="user-info">
      <div class="user-background">
        <img :src="user.userinfo.user_avatar" alt class="user-avatar" />
        <img :src="user.userinfo.user_avatar" alt class="background" />
      </div>
      <div class="info-detail">
        <div class="info-box">
          <div class="detail">
            <div class="name-box">
              <span class="name">{{user.userinfo.user_nickname}}</span>
              <i v-if="user.userinfo.user_gender == 1" class="el-icon-male gender male"></i>
              <i v-else class="el-icon-female gender female"></i>
            </div>
            <span
              v-show="user.userinfo.user_authentication"
              class="authentication"
            >{{user.userinfo.user_authentication}}</span>
          </div>
          <div
            class="signature"
            v-show="user.userinfo.user_signature"
          >{{user.userinfo.user_signature}}</div>
          <div class="fans-follow">
            <div class="item">
              <span class="text">关注</span>
              <span class="value">{{user.follow_count}}</span>
            </div>
            <div class="item">
              <span class="text">粉丝</span>
              <span class="value">{{user.fans_count}}</span>
            </div>
            <!-- 个人主页显示编辑 -->
            <div class="follow-edit" v-if="user.isfollowed == undefined">
              <el-button class="edit">编辑个人资料</el-button>
            </div>
            <!-- 他人主页显示是否关注 -->
            <div class="follow-edit" v-else>
              <el-button class="unfollow" icon="el-icon-plus" v-if="!user.isfollowed">关注TA</el-button>
              <el-button class="follow" v-else>已关注</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="post-content">
      <div class="nav">
        <li class="nav-item" @click="getcontent(nav)" v-for="(nav,navindex) in navlist" :key="navindex" :class="{activenav:activenav == navindex}">{{nav.name}}</li>
      </div>
      <div class="content">
        <!-- <div class="dynamic">动态</div>
        <div class="video">视频</div>
        <div class="article">文章</div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  components: {
    // LoginUserinfo,
    // PostPopup
  },
  data() {
    return {
      activenav: 0,
      navlist: [
        {
          name: "动态",
          params: ""
        },
        {
          name: "视频",
          params: "video"
        },
        {
          name: "文章",
          params: "article"
        },
        {
          name: "问答",
          params: "answer"
        },
        {
          name: "提问",
          params: "question"
        },
        {
          name: "关注",
          params: "follow"
        }
      ],
      user: {
        userinfo: {
          user_id: "111",
          user_nickname: "半途",
          user_avatar: require("../assets/img/reg4.jpg"),
          user_gender: "1",
          user_authentication: "",
          user_grade: "20",
          user_signature: "记得一定要快乐！"
        },
        fans_count: 11,
        follow_count: 15,
        isfollowed: false //是本人时不返回此字段
      }
    };
  },
  methods: {
    back() {
      this.$router.back(1);
    },
    getcontent(nav) {
      if((!nav.params && !this.$route.params.type)||this.$route.params.type == nav.params){
        return
      }
      if(nav.params) {
        this.$router.replace({
        name: this.$route.name,
        params:{
          user_id:'111',
          type: nav.params
        }
        //更新对应的列表
      });
      } else {
        this.$router.replace({
        name: this.$route.name,
        params:{
          user_id:'111'
        }
        //更新动态
      });
      }
    }
  },
  mounted() {
    console.log(this.$route)
  }
};
</script>
<style lang="scss">
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
.user-page {
  min-height: 800px;
  width: 1000px;
  // background-color: #fff;
  margin: 65px auto 0;
  .user-info {
    box-shadow: 1px 1px 3px rgb(207, 206, 206), -1px -1px 5px rgb(207, 206, 206);
    .user-background {
      position: relative;
      width: 100%;
      height: 150px;
      .user-avatar {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
        height: 80px;
        width: 80px;
        object-fit: cover;
        border-radius: 50%;
        z-index: 1;
      }
      .background {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.6;
      }
    }
    .info-detail {
      background-color: #fff;
      position: relative;
      .info-box {
        display: flex;
        padding: 40px 20px 15px;
        flex-direction: column;
        align-items: center;
        .detail {
          font-size: 25px;
          padding: 3px 10px;
          display: flex;
          .name-box {
            position: relative;
            .name {
              color: #8590a6;
              font-weight: 600;
              letter-spacing: 2px;
            }
            .gender {
              position: absolute;
              right: -10px;
              top: 3px;
              font-size: 16px;
            }
            .male {
              color: #409eff;
            }
            .female {
              color: pink;
            }
          }
          .authentication {
            font-size: 14px;
            margin-left: 10px;
            color: #121212;
          }
        }
        .signature {
          font-size: 14px;
          margin: 5px 0;
        }
        .fans-follow {
          position: relative;
          display: flex;
          width: 500px;
          color: #8590a6;
          .item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .text {
              letter-spacing: 3px;
            }
            .value {
              margin-top: 3px;
              font-size: 12px;
            }
          }
          .follow-edit {
            position: absolute;
            right: -150px;
            .follow {
              line-height: 14px;
              color: #fff;
              cursor: pointer;
              border: 1px solid rgb(238, 236, 236);
              background-color: #fdda5a !important;
              border-radius: 3px;
            }
            .unfollow {
              line-height: 14px;
              color: #a5a5a5;
              cursor: pointer;
              border: 1px solid rgb(238, 236, 236);
              // padding: 5px 8px;
              background-color: #fff6d4 !important;
              border-radius: 3px;
            }
            .edit {
              line-height: 14px;
              color: #8590a6;
              cursor: pointer;
              border: 1px solid rgb(238, 236, 236);
              // padding: 5px 8px;
              background-color: #ffffff !important;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
  .post-content {
    margin-top: 10px;
    background-color: #fff;
    width: 800px;
    height: 2000px;
    box-shadow: 1px 1px 3px rgb(207, 206, 206);
    // margin: 10px auto 0 auto;
    .nav {
      display: flex;
      justify-content: space-between;
      padding: 0px 55px;
      position: sticky;
      top: 65px;
      border-bottom: 1px solid #f6f6f6;
      .nav-item {
        list-style-type: none;
        align-self: center;
        text-align: center;
        padding: 10px 5px;
        letter-spacing: 2px;
        font-weight: 400;
        cursor: pointer;
        &:hover {
          font-weight: 600;
        }
      }
      .activenav {
        font-weight: 600;
        border-bottom: 3px solid #409eff;
      }
    }
  }
}
</style>