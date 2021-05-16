<template>
<div>
  <div class="background-Mask"></div>
  <div class="login-box">
    <img class="esc-icon" src="../assets/icon/esc.png" alt="" @click="closePopup">
    <ul class="login-nav">
      <li class="loginway" :class="{activeTab: isactibveTab == 1}" @click="isactibveTab = 1">账号登录</li>
      <li class="loginway" :class="{activeTab: isactibveTab == 2}"  @click="isactibveTab = 2">免密登录</li>
    </ul>
    <div class="login-form">
      <div v-show="isactibveTab == 1">
        <div class="info-list username">
          <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 1}">
            <input ref="phone_name" type="text" class="C_input" maxlength="12" autocomplete="off" placeholder="手机号/用户昵称" v-model="loginform.loginNameOrPhone" @keyup="loginform.loginNameOrPhone = loginform.loginNameOrPhone.replace(/\s+/g,'')" @focus="input_wrap_focus = 1" @blur="input_wrap_focus = 0">
          </div>
        </div>
        <div class="info-list password">
          <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 2}">
            <input ref="password" type="password" class="C_input" maxlength="15" autocomplete="off" placeholder="请输入密码" v-model="loginform.user_password" @keyup="loginform.user_name_password = loginform.user_password.replace(/\s+/g,'')" @focus="input_wrap_focus = 2" @blur="input_wrap_focus = 0">
          </div>
        </div>
      </div>
      <div v-show="isactibveTab == 2">
        <div class="info-list userphone">
          <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 3}">
            <input ref="phone" type="text" class="C_input" maxlength="11" autocomplete="off" placeholder="手机号,仅支持大陆手机号" v-model="loginform.user_phone" @keyup="loginform.user_phone = loginform.user_phone.replace(/\s+/g,'')" @focus="input_wrap_focus = 3" @blur="input_wrap_focus = 0">
          </div>
        </div>
        <div class="info-list Verification-Code">
          <div class="get-code" @click="getCode">获取短信验证码<span class="time" v-if="showtime" @click.stop="">倒计时 {{restTime}} s</span></div>
          <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 4}">
            <input ref="code" type="text" class="C_input" maxlength="6" autocomplete="off" placeholder="短信验证码" v-model="loginform.user_code" @keyup="loginform.user_code = loginform.user_code.replace(/\s+/g,'')" @focus="input_wrap_focus = 4" @blur="input_wrap_focus = 0">
          </div>
        </div>
      </div>
      <div class="info-list login-button" @click="toSignin">登录</div>
      <div class="info-list login-help">
        <span class="no-account">还没有账号？<router-link to="/register">立即注册</router-link></span>
        <span class="forget-password">忘记密码？</span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { newcode } from '@/utils/index.js'
import {signin } from '@/utils/api/user.js'
export default {
  data() {
    return {
      isactibveTab: 1, //控制登录方式Tab
      input_wrap_focus: 0, //控制账号和密码聚焦样式
      loginform: {
        loginNameOrPhone: '',//用户名或者手机号
        user_password: '',
        user_phone: '',
        user_code: ''
      },
      showtime: false,//控制倒计时
      restTime: '',
      timer:null
    };
  },
  methods:{
    stopMove() {
      let m = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", m, { passive: false }); //禁止页面滑动
    },
    Move() {
      let m = function(e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", m, { passive: true });
    },
    closePopup() {
      this.Move()
      this.$store.commit('changestatus', true);
    },
    getCode() {
      let self = this;
      if (!self.loginform.user_phone || !(/^1[34578]\d{9}$/.test(self.loginform.user_phone))){
        // self.input_wrap_focus = 3;
        //提示 手机号格式错误或为空
        self.$message({
          message: "手机号为空或格式错误",
          duration: 2000,
          type: "warning"
        });
        self.$nextTick(() => {
          this.$refs.phone.focus();
        });
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
        //获取验证码
        let code = newcode()
        let params ={
          phone: this.loginform.user_phone,
          templateId: '540',
          variables: code
        }
        console.log(params)
        // self.axios.post('http://aliapi.market.alicloudapi.com/smsApi/verifyCode/send', 
        // self.$qs.stringify(
        //   params
        // ),
        // {
        //   headers: {
        //     'Authorization': 'APPCODE' +" "+'fd36e8a662b2495b93b1455020370263',
        //   }
        // })
        // .then(function (response) {
        //   console.log(response);
        // })
        // .catch(function (error) {
        //   console.log(error);
        // });
      }
    },
    toSignin() {
      let self = this;
      //账号密码登录
      if(self.isactibveTab == 1) {
        if(!self.loginform.loginNameOrPhone){
          self.$message({
            message: "请填写手机号或用户昵称",
            duration: 2000,
            type: "warning"
          });
          self.$nextTick(() => {
            this.$refs.phone_name.focus();
          });
          return
        } else if(!self.loginform.user_password){
          self.$message({
            message: "请输入密码",
            duration: 2000,
            type: "warning"
          });
          self.$nextTick(() => {
            this.$refs.password.focus();
          });
          return
        }
        let params = {
          loginNameOrPhone:this.loginform.loginNameOrPhone,
          user_password:this.loginform.user_password,
          type: 'password'
        }
        //登录
        signin(params).then(res=>{
          if(res.data.code == 1 && res.data.msg == '用户名/手机号或密码错误') {
            self.$message({
              message: "用户名/手机号或密码错误",
              duration: 2000,
              type: "warning"
            });
          } else if(res.data.code == 1) {
            self.$message({
              message: "系统异常",
              duration: 2000,
              type: "warning"
            });
          } else {
            self.$message({
              message: "登录成功！",
              duration: 2000,
              type: "success"
            });
            //存数据
            //存数据
            localStorage.setItem('userInfo', JSON.stringify(res.data.data))
            //用户信息存入vuex
            this.$store.dispatch('getUserInfo', res.data.data)
            self.closePopup()
          }
        })
      } else {
        //手机号验证码登录
        if(!self.loginform.user_phone || !(/^1[34578]\d{9}$/.test(self.loginform.user_phone))){
          // self.input_wrap_focus = 3;
          // console.log("");
          self.$message({
            message: "请正确填写手机号",
            duration: 2000,
            type: "warning"
          });
          self.$nextTick(() => {
            this.$refs.phone.focus();
          });
          return
        } else if(!self.loginform.user_code){
          // self.input_wrap_focus = 4;
          self.$message({
            message: "请输入验证码",
            duration: 2000,
            type: "warning"
          });
          self.$nextTick(() => {
            this.$refs.code.focus();
          });
          return
        } else if(self.loginform.user_code.length != 6){
          // self.input_wrap_focus = 4;
          self.$message({
            message: "验证码错误",
            duration: 2000,
            type: "warning"
          });
          self.$nextTick(() => {
            this.$refs.code.focus();
          });
          return
        } 
        //验证码登录
        let params = {
          user_phone:this.loginform.user_phone,
          type:'code'
        }
        signin(params).then(res=>{
          if(res.data.code == 1 && res.data.msg == '用户名/手机号或密码错误') {
            self.$message({
              message: "手机号未注册",
              duration: 2000,
              type: "warning"
            });
          } else if(res.data.code == 1) {
            self.$message({
              message: "系统异常",
              duration: 2000,
              type: "warning"
            });
          } else {
            self.$message({
              message: "登录成功！",
              duration: 2000,
              type: "success"
            });
            //存数据
            localStorage.setItem('userInfo', JSON.stringify(res.data.data))
            //用户信息存入vuex
            this.$store.dispatch('getUserInfo', res.data.data)
            self.closePopup()
          }
        })
      }
    }
  },
  mounted(){
    this.stopMove()
  }
}
</script>
<style lang="scss" scoped>
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
.login-box {
  opacity: 1;
  position: fixed;
  top: 45%;
  left: 50%;
  width: 450px;
  padding: 50px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #00000026;
  z-index: 1000;
  .esc-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 18px;
    &:hover {
      right: 8px;
      top: 8px;
      width: 20px;
    }
  }
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
      margin-top: 20px;
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
        position: relative;
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
</style>
