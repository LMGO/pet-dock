<template>
<div class="login-userinfo">
  <div v-if="!islogin" class="login-box">
        <ul class="login-nav">
          <li class="loginway" :class="{activeTab: isactibveTab == 1}" @click="isactibveTab = 1">账号登录</li>
          <li class="loginway" :class="{activeTab: isactibveTab == 2}"  @click="isactibveTab = 2">免密登录</li>
        </ul>
        <div class="login-form">
          <div v-show="isactibveTab == 1">
            <div class="info-list username">
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 1}">
                <input type="text" class="C_input" maxlength="12" autocomplete="off" placeholder="手机号/用户昵称" v-model="loginform.user_name_phone" @focus="input_wrap_focus = 1" @blur="input_wrap_focus = 0">
              </div>
            </div>
            <div class="info-list password">
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 2}">
                <input type="password" class="C_input" maxlength="15" autocomplete="off" placeholder="请输入密码" v-model="loginform.user_password" @focus="input_wrap_focus = 2" @blur="input_wrap_focus = 0">
              </div>
            </div>
          </div>
          <div v-show="isactibveTab == 2">
            <div class="info-list userphone">
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 3}">
                <input type="text" class="C_input" maxlength="11" autocomplete="off" placeholder="手机号,仅支持大陆手机号" v-model="loginform.user_phone" @focus="input_wrap_focus = 3" @blur="input_wrap_focus = 0">
              </div>
            </div>
            <div class="info-list Verification-Code">
              <div class="get-code" @click="getCode">获取短信验证码<span class="time" v-if="showtime" @click.stop="">倒计时 {{restTime}} s</span></div>
              <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 4}">
                <input type="text" class="C_input" maxlength="6" autocomplete="off" placeholder="短信验证码" v-model="loginform.user_code" @focus="input_wrap_focus = 4" @blur="input_wrap_focus = 0">
              </div>
            </div>
          </div>
          <div class="info-list login-button" @click="toSignin">登录</div>
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
</template>
<script>
export default {
  name: "login-Userinfo",
  data() {
    return {
      islogin: false,
      isactibveTab: 1, //控制登录方式Tab
      input_wrap_focus: 0, //控制账号和密码聚焦样式 
      loginform: {
        user_name_phone: '',//用户名或者手机号
        user_password: '',
        user_phone: '',
        user_code: ''
      },
      showtime: false,//控制倒计时
      restTime: '',
      timer:null
    };
  },
  methods: {
    getCode() {
      let self = this;
      if (!self.loginform.user_phone || !(/^1[34578]\d{9}$/.test(self.loginform.user_phone))){
        self.input_wrap_focus = 3;
        //提示 手机号格式错误或为空
        console.log("手机号为空或格式错误");
      } else {
        self.input_wrap_focus = 0;
        //获取验证码
        const TIME_COUNT = 60;
        if (!self.timer) {
          self.restTime = TIME_COUNT;
          self.showtime = true
          self.timer = setInterval(() => {
            if (self.restTime > 0 && self.restTime <= TIME_COUNT) {
              self.restTime--;
            } else {
              self.showtime = false
              clearInterval(self.timer);
              self.timer = null;
            }
          }, 1000)
        }
      }
    },
    toSignin() {
      let self = this;
      //账号密码登录
      if(self.isactibveTab == 1) {
        if(!self.loginform.user_name_phone){
          self.input_wrap_focus = 1;
          console.log("请填写手机号或用户昵称");
        } else if(!self.loginform.user_password){
          self.input_wrap_focus = 2;
          console.log("请输入密码");
        }
      } else {
        if(!self.loginform.user_phone || !(/^1[34578]\d{9}$/.test(self.loginform.user_phone))){
          self.input_wrap_focus = 3;
          console.log("请正确填写手机号");
        } else if(!self.loginform.user_code){
          self.input_wrap_focus = 4;
          console.log("请输入验证码");
        } else if(self.loginform.user_code.length != 6){
          self.input_wrap_focus = 4;
          console.log("验证码错误");
        }
      }
    },
  },
  components: {},
  beforeMount() {}
};
</script>
<style lang="scss" scoped>
.login-userinfo {
  width: 240px;
  background-color: #f6f6f6;
  .login-box {
      background-color: #fff;
      padding: 0 15px 10px 15px;
      border-radius: 2px;
      box-shadow: 1px 1px 3px rgb(207, 206, 206);
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
            position: relative;
            &:hover {
              background-color: #cccccc;
            }
            .time {
              position: absolute;
              z-index: 1;
              top: 0;
              left: 0;
              background: #FFF;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f2f2f5;
              cursor: not-allowed;
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
    box-shadow: 1px 1px 3px rgb(207, 206, 206);
    font-size: 12px;
    span {
      display: block;
      padding: 10px;
    }
  }
}
</style>