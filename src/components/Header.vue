<template>
  <div>
    <header class="AppHeader">
      <div class="AppHeader-inner">
        <a href="/home" aria-label="宠坞" class="logo-link">
          <img class="logo" src="../assets/logo.png" alt />
        </a>
        <span class="chongwu" aria-label="宠坞">宠坞</span>
        <ul role="navigation" class="AppHeader-Tabs">
          <li class="AppHeader-Tab" v-for="(item, index) in navlist" :key="index">
            <div
              class="BeforeActive"
              :class="{ActivePath: item.path == ($route.matched[0]||{}).path}"
              @click="gotoNav(item)"
            >{{item.navname}}</div>
            <!-- <router-link :to="{ path: item.path}" class="BeforeActive"  active-class="ActivePath">
            {{item.navname}}
            </router-link>-->
          </li>
        </ul>
        <div class="SearchArea">
          <div class="SearchBar">
            <form class="SearchBar-tool" @submit.prevent>
              <div>
                <div class="Popover">
                  <label for class="SearchBar-input" :class="{inputfocus:inputfocus}">
                    <input
                      type="text"
                      placeholder="大家都在搜"
                      class="Input"
                      v-model="searchtext"
                      @focus="inputfocus = true;issearching = true"
                      @blur="search"
                      @keyup.enter="search"
                      @keyup="searchtext = searchtext.replace(/\s+/g,'')"
                    />
                    <button class="SearchBar-searchButton" :class="{issearching:issearching}">
                      <span>
                        <img src="../assets/icon/sousuo.png" alt @click="search" />
                      </span>
                    </button>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="NewMessage">消息</div>
        <div class="AppHeader-userInfo">
          <div class="sign" style="display: flex;align-items: center;">
            <span v-show="!showavatar" @click="$store.commit('changestatus', false)">登录/</span>
            <span v-show="!showavatar">
              <router-link class="reg" to="/reg">注册</router-link>
            </span>
            <span v-show="showavatar" @click="exit">退出登录</span>
            <img v-show="showavatar" class="User-avatar" :src="showavatar" alt />
          </div>
        </div>
      </div>
    </header>
    <LoginPopup v-if="!iscloseloginPopup" />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginPopup from "@/components/LoginPopup.vue";
export default {
  name: "p-header",
  components: {
    LoginPopup
  },
  data() {
    return {
      inputfocus: false, //输入框聚焦时样式
      // showavatar: false,
      issearching: false, //控制搜索时搜索icon样式
      searchtext: "",
      navlist: [
        {
          navname: "首页",
          path: "/home",
          name: "Home"
        },
        {
          navname: "你问我答",
          path: "/askanswer/:type",
          name: "AskAnswer"
        },
        {
          navname: "周边服务",
          path: "/service",
          name: "Service"
        },
        {
          navname: "宠坞百科",
          path: "/know",
          name: "Know"
        }
      ]
    };
  },
  computed: {
    //是否关闭登录弹窗
    iscloseloginPopup() {
      return this.$store.state.closeLoginPopup;
    },
    showavatar() {
      return this.$store.state.userInfo.user_avatar
    }
  },
  methods: {
    // 搜索
    search() {
      let self = this;
      self.inputfocus = false;
      self.issearching = false;
      //不为空才搜索
      if (self.searchtext) {
        //其它页面进入搜索页（非话题跳转）
        if (self.$route.name != "Search") {
          self.$router.push({
            path: "/search",
            query: { searchtext: self.searchtext }
          });
          //搜索页查看话题后继续搜索
        } else if ("topicid" in self.$route.query) {
          self.$router.replace({
            path: "/search",
            query: { searchtext: self.searchtext }
          });
          //搜索页普通搜索后继续搜索
        } else if ("searchtext" in self.$route.query) {
          self.$router.replace({
            path: "/search",
            query: { searchtext: self.searchtext }
          });
        }
      }
      self.searchtext = ""; //清空搜索文字
    },
    // 导航栏切换
    gotoNav(i) {
      if(i.path == (this.$route.matched[0]||{}).path) {
        return
      }
      //问答页带参数
      if (i.name == "AskAnswer") {
        this.$router.replace({ name: i.name, params: { type: "hot" } });
      } else {
        this.$router.replace(i.path);
      }
    },
    // 退出登录
    exit() {
      this.$confirm("确定退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.state.userInfo = {};
        localStorage.removeItem("userInfo");
        this.$message({
          type: "success",
          message: "退出登录!"
        });
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.AppHeader {
  position: relative;
  min-width: 1000px;
  overflow: hidden;
  background: #fff;
  background-clip: content-box;
  box-shadow: 0 2px 5px rgba(184, 180, 180, 0.267);
  .AppHeader-inner {
    position: relative;
    display: flex;
    width: 1000px;
    height: 50px;
    padding: 0 16px;
    margin: 0 auto;
    align-items: center;
    transition: transform 0.3s;
    .logo-link {
      display: flex;
      justify-content: center;
    }
    .logo {
      width: 40px;
      border-radius: 50%;
      border: solid 1px #f6f6f6;
    }
    .chongwu {
      font-size: 25px;
      margin-left: 10px;
      color: rgb(253, 218, 90);
      letter-spacing: 2px;
    }
    .AppHeader-Tabs {
      border-bottom: none;
      display: flex;
      flex-shrink: 0;
      height: 50px;
      margin: 0 15px 0 15px;
      list-style-type: none;
      .AppHeader-Tab {
        padding-left: 15px;
        padding-right: 15px;
        .BeforeActive {
          position: relative;
          text-decoration: none;
          height: 100%;
          color: #121212;
          display: flex;
          align-items: center;
          &:hover {
            font-weight: 600;
            width: 100%;
            cursor: pointer;
          }
        }
        .ActivePath {
          font-weight: 600;
          width: 100%;
          padding-bottom: 3px;
          &:after {
            height: 4px;
            position: absolute;
            right: 0;
            left: 0;
            bottom: -1px;
            // background: #06f;
            background-color: rgb(253, 218, 90);
            content: "";
            width: 100%;
          }
        }
      }
    }
    .SearchArea {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      justify-content: center;
      max-width: 300px;
      .SearchBar {
        height: 34px;
        flex: 1;
        position: relative;
        display: flex;
        max-width: 300px;
        .SearchBar-tool {
          flex: 1;
          height: 100%;
          position: relative;
          overflow: hidden;
          width: 100%;
          z-index: 104;
          .Popover {
            position: relative;
          }
        }
        .SearchBar-tool .Popover,
        .SearchBar-tool > div {
          display: block;
          height: 100%;
          width: 100%;
        }
        .inputfocus {
          border: 1px solid #fdda5a;
        }
        .SearchBar-input {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 34px;
          padding: 4px 0px 4px 16px;
          margin-right: 30px;
          font-size: 14px;
          border-radius: 999px;
          background: #f6f6f6;
          box-sizing: border-box;
          width: 100%;
          .Input {
            flex: 1 1;
            padding: 0;
            overflow: hidden;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            background: transparent;
            border: none;
            resize: none;
            color: #121212;
            height: 24px;
            line-height: 24px;
            text-rendering: auto;
            letter-spacing: normal;
            word-spacing: normal;
            text-transform: none;
            text-indent: 0px;
            text-shadow: none;
            display: inline-block;
            text-align: start;
            appearance: auto;
            cursor: text;
            margin: 0em;
            font: 400 13.3333px Arial;
            outline: none;
            // &:hover {
            //   box-shadow: 2px 2px 3px rgb(214, 212, 212);
            // }
          }
          .issearching {
            background-color: rgb(253, 218, 90) !important;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
            border-bottom-right-radius: 999px;
            border-top-right-radius: 999px;
          }
          .SearchBar-searchButton {
            padding: 0 5px;
            background: transparent;
            border-color: transparent;
            font-size: 14px;
            line-height: 34px;
            height: 34px;
            text-align: center;
            display: flex;
            align-items: center;
            outline: none;
            cursor: pointer;
            span {
              display: inline-flex;
              align-items: center;
              color: #fff;
              img {
                height: 20px;
              }
            }
          }
        }
        .Isfocus {
          background-color: #fff !important;
          border: solid 1px #8590a6 !important;
        }
      }
    }
    .NewMessage {
      margin-left: auto;
      min-width: 100px;
    }
    .AppHeader-userInfo {
      flex-shrink: 0;
      justify-content: flex-end;
      display: flex;
      align-items: center;
      cursor: default;
      .sign {
        span {
          cursor: pointer;
          &:hover {
            color: #f7671d;
          }
          .reg {
            text-decoration: none;
            color: #121212;
            &:hover {
              color: #f7671d;
            }
          }
        }
      }
      .User-avatar {
        margin-left: 10px;
        height: 30px;
        width: 30px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }
}
</style>
