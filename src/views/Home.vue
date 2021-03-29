<template>
  <div class="home">
    <nav class="Left-nav">左边导航栏</nav>
    <section class="center-content">中部内容</section>
    <div class="right-area">
      <div v-if="!islogin" class="login-box">
        <ul class="login-nav">
          <li class="loginway" :class="{activeTab: isactibveTab == 1}" @click="isactibveTab = 1">账号登录</li>
          <li class="loginway" :class="{activeTab: isactibveTab == 2}"  @click="isactibveTab = 2">免密登录</li>
        </ul>
        <div class="login-form">
          <div v-show="isactibveTab == 1">
            <div class="info-list username">
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 1}">
                <input type="text" class="C_input" maxlength="12" autocomplete="off" placeholder="手机号/用户昵称" name="username" node-type="username" tabindex="1" @focus="input_wrap_focus = 1" @blur="input_wrap_focus = 0">
              </div>
            </div>
            <div class="info-list password">
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 2}">
                <input type="password" class="C_input" maxlength="15" autocomplete="off" placeholder="请输入密码" name="password" node-type="password" tabindex="2"  @focus="input_wrap_focus = 2" @blur="input_wrap_focus = 0">
              </div>
            </div>
          </div>
          <div v-show="isactibveTab == 2">
            <div class="info-list userphone">
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 1}">
                <input type="text" class="C_input" maxlength="11" autocomplete="off" placeholder="手机号,仅支持大陆手机号" name="userphone" @focus="input_wrap_focus = 1" @blur="input_wrap_focus = 0">
              </div>
            </div>
            <div class="info-list Verification-Code">
              <div class="get-code">获取短信验证码</div>
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 2}">
                <input type="text" class="C_input" maxlength="6" autocomplete="off" placeholder="短信验证码" name="password" node-type="password" tabindex="2"  @focus="input_wrap_focus = 2" @blur="input_wrap_focus = 0">
              </div>
            </div>
          </div>
          <div class="info-list login-button">登录</div>
          <div class="info-list login-help">
            <span class="no-account">还没有账号？<router-link to="/reg">立即注册</router-link></span>
            <span class="forget-password">忘记密码？</span>
          </div>
        </div>
      </div>
      <div v-else class="person-info">个人信息区域</div>
      <div class="ServiceIntroduce">
        <span>帮助中心</span>
        <span>关于我们</span>
      </div>
    </div>
    <!-- <LoginPopup v-if="!iscloseloginPopup"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import LoginPopup from '@/components/LoginPopup.vue'

export default {
  name: 'Home',
  components: {
    // LoginPopup
  },
  data(){
    return {
      islogin: false,
      isactibveTab: 1, //控制登录方式Tab
      input_wrap_focus: 0, //控制账号和密码聚焦样式 
    }
  },
  methods:{
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.home {
  margin: 15px auto;
  width: 1000px;
  display: flex;
  .Left-nav {
    width: 135px;
    background-color: #fff;
    padding: 20px 10px;
    box-sizing: border-box;
  }
  .center-content {
    width: 595px;
    margin-left: 15px;
    background-color: #fff;
  }
  .right-area {
    width: 240px;
    margin-left: 15px;
    background-color: #f6f6f6;
    .login-box {
      background-color: #fff;
      padding: 0 15px 10px 15px;
      border-radius: 2px;
      box-shadow: 0 0 2px #00000026;
      .login-nav {
        display: flex;
        margin-bottom: 16px;
        padding-top: 11px;
        border-bottom: 1px solid #ccc;
        border-bottom-color: #cccccc80;
        .loginway {
          flex: 1;
          text-align: center;
          margin-bottom: -1px;
          border-bottom: 3px solid transparent;
          color: #808080;
          font-size: 14px;
          line-height: 30px;
          -webkit-transition: border .2s cubic-bezier(0.43, 0.37, 1, 1);
          transition: border .2s cubic-bezier(0.43, 0.37, 1, 1);
          cursor: pointer;
          font-weight: 600;
          letter-spacing: normal;
        }
        .activeTab {
          border-bottom: 3px solid rgb(253,218,90);
          color: #000;
          font-weight: 700;
        }
      }
      .login-form {
        position: relative;
        top: 0;
        left: 0;
        .info-list {
          margin-top: 14px;
          .input_wrap_focus {
            border-color: #eb7350 !important;
          }
          .input_wrap {
            height: 30px;
            padding: 2px 0;
            border: 1px solid #ccc;
            border-radius: 2px;
            background-color: #FFF;
            background-repeat: no-repeat;
            background-size: 20px 20px;
            background-position: 3px 3px;
            .C_input {
              margin-left: 28px;
              width: 85%;
              height: 100%;
              border: none;
              outline: none;
              box-shadow: none;
              font-size: 12px;
              color: #808080;
            }
          }
        }
        .username{
          .input_wrap {
            background-image: url("../assets/icon/useraccount.png");
          }
        }
        .password{
          .input_wrap {
            background-image: url("../assets/icon/userpassword.png");
          }
        }
        .userphone {
          .input_wrap {
            background-image: url("../assets/icon/userphone.png");
          }
        }
        .Verification-Code {
          display: flex;
          .get-code {
            height: 30px;
            font-size: 12px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f2f2f5;
            &:hover {
              background-color: #cccccc;
            }
          }
          .input_wrap {
            margin-left: 10px;
            flex: 1;
            .C_input {
              margin-left: 10px;
            }
          }
        }
        .login-button {
          padding: 3px;
          font-size: 14px;
          letter-spacing: 5px;
          color: #fff;
          text-align: center;
          background: rgb(253,218,90);
          border: 1px solid rgb(253,218,90);
          border-radius: 2px;
          cursor: default;
          &:hover {
            background: rgb(250, 201, 26);
            border-color:rgb(250, 201, 26);
          }
        }
        .login-help {
          font-size: 12px;
          display: flex;
          .no-account {
            flex: 1;
            a {
              color: #eb7350;
              text-decoration: none;
            }
          }
          .forget-password {
            display: block;
            margin: 0 auto;
            &:hover {
            color: #eb7350;
            cursor: pointer;
          }
          }
        }
      }
    }
    .ServiceIntroduce {
      margin-top: 10px;
      background-color: #fff;
      span {
        display: block;
        padding: 10px;
      }
    }
  }
}

</style>
