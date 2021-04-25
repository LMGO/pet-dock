<template>
  <div class="register">
    <header class="AppHeader" v-if="true">
      <div class="AppHeader-inner ">
        <router-link to="/home" class="chongwu">宠坞</router-link>
        <div role="navigation" class="AppHeader-Tabs">
          <router-link to="/home" class="BeforeActive">返回首页</router-link>
        </div>
      </div>
    </header>
    <div class="reg">
      <div class="chongwu-logo-name">
        <div class="chongwu-items">
          <div class="chongwu">
            <img class="logo" src="../assets/logo.png" alt="">
            <div class="name">宠 坞</div>
          </div>
          <div class="declaration">
            <span>上宠坞</span>
            <span style="margin-left:15px">知宠物</span>
          </div>
        </div>
      </div>
      <div class="reg-area">
        <div class="reg-box">
          <ul class="reg-nav">
            <li class="regway">个人用户注册</li>
          </ul>
          <div class="reg-form">
            <div>
              <div class="info-list password">
                <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 1}">
                  <input type="password" class="C_input" maxlength="15" autocomplete="off" placeholder="请设置密码 5-15 位" name="password" v-model="regform.password"  @focus="input_wrap_focus = 1" @blur="input_wrap_focus = 0" @keyup="regform.password = regform.password.replace(/\s+/g,'')">
                </div>
              </div>
              <div class="info-list password">
                <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 2}">
                  <input type="password" class="C_input" maxlength="15" autocomplete="off" placeholder="再次确认密码" name="password" v-model="regform.passwordagain" tabindex="2"  @focus="input_wrap_focus = 2" @blur="input_wrap_focus = 0"  @keyup="regform.passwordagain = regform.passwordagain.replace(/\s+/g,'')">
                </div>
              </div>
              <div class="info-list userphone">
                <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 3}">
                  <input type="text" class="C_input" maxlength="11" autocomplete="off" placeholder="手机号,仅支持大陆手机号" name="user_phone" v-model="regform.user_phone" tabindex="3" @focus="input_wrap_focus = 3" @blur="input_wrap_focus = 0"  @keyup="regform.user_phone = regform.user_phone.replace(/\s+/g,'')">
                </div>
              </div>
              <div class="info-list Verification-Code">
                <div class="get-code" @click="getCode">获取短信验证码<span class="time" v-if="showtime" @click.stop="">倒计时 {{restTime}} s</span></div>
                <div class="input_wrap" :class="{input_wrap_focus: input_wrap_focus == 4}">
                  <input type="text" class="C_input" maxlength="6" autocomplete="off" placeholder="短信验证码" name="code" v-model="regform.code" tabindex="4"  @focus="input_wrap_focus = 4" @blur="input_wrap_focus = 0"  @keyup="regform.code = regform.code.replace(/\s+/g,'')">
                </div>
              </div>
              <div class="info-list Verification-Code">
                <div class="">请选择您的性别 :</div>
                <div class="gender-select">
                  <label><input type="radio" name="sex" value="男" v-model="regform.user_gender">男士</label>
                  <label><input type="radio" name="sex" value="女" v-model="regform.user_gender">女士</label>
                </div>
              </div>
            </div>
            <div class="info-list reg-button" @click="signUp">注册</div>
            <div class="info-list reg-help">
              <span class="no-account">已注册账号？<router-link to="/home">去登录</router-link></span>
              <span>注册即代表同意平台</span>
              <span class="forget-password">《用户协议》</span>
            </div>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      input_wrap_focus: 0, //控制账号和密码聚焦样式
      regform:{
        password: '',
        passwordagain: '',
        user_gender: '男',
        user_phone:'',
        code: ''
      },
      showtime: false,//控制倒计时
      restTime: '',
      timer:null
    };
  },
  methods:{
    getCode() {
      let self = this;
      if (!self.regform.user_phone || !(/^1[34578]\d{9}$/.test(self.regform.user_phone))){
        self.input_wrap_focus = 3
        //提示 手机号格式错误或为空
        console.log("手机号为空或格式错误");
      } else {
        self.input_wrap_focus = 0
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
    signUp() {
      let self = this;
      if (!self.regform.user_phone){
        self.input_wrap_focus = 3
        //提示 请填写手机号
        console.log("请填写手机号");
        
      } else if (!self.regform.code){
        self.input_wrap_focus = 4
        //提示 请填写验证码
        console.log("请填写验证码");

      }
      else if (self.regform.password !== self.regform.passwordagain) {
        //提示 密码不一致
        self.input_wrap_focus = 2
        console.log("两次输入的密码不一致");
        self.regform.passwordagain = ''

      } else if ((self.regform.password == self.regform.passwordagain)&&(self.regform.password.length < 5)) {
        //提示 密码长度小于5
        self.input_wrap_focus = 1
        console.log("密码长度小于5，请修改密码");
        self.regform.passwordagain = ''
      } else if (self.regform.code.length!==6) {
        //提示 密码长度小于5
        self.input_wrap_focus = 4
        console.log("验证码错误");
        self.regform.code = ''
      }
    }
  }
  
}
</script>
<style lang='scss' scoped>
.register {
  min-width: 1000px;
  width: 100%;
  height: 100vh;
  background: url("../assets/img/reg5.jpg") no-repeat;
  background-size: cover;
    .AppHeader {
      position: relative;
      z-index: 100;
      min-width: 1000px;
      overflow: hidden;
      background-clip: content-box;
      box-shadow: 0 1px 3px rgba(19, 18, 18, 0.267);
      .AppHeader-inner {
        position: relative;
        display: flex;
        height: 50px;
        width: 1000px;
        padding: 0 50px;
        margin: 0 auto;
        align-items: center;
        .chongwu {
          font-size: 25px;
          margin-left: 10px;
          color: rgb(253,218,90);
          letter-spacing: 2px;
          cursor: pointer;
          text-decoration: none;
        }
        .AppHeader-Tabs {
          border-bottom: none;
          display: flex;
          flex-shrink: 0;
          height: 50px;
          margin: 0 15px 0 15px;
          list-style-type: none;
          .BeforeActive {
            position: relative;
            text-decoration: none;
            height: 100%;
            color: #fff;
            display: flex;
            align-items: center;
            &:hover {
              color: #121212;
            }
          }
        }
      }

  }
  .reg {
    display: flex;
    min-width: 1000px;
    width: 1000px;
    padding: 50px 50px;
    margin: 50px auto;
    box-shadow: 0 1px 3px rgba(19, 18, 18, 0.267);
    border-radius: 2px;
    .chongwu-logo-name {
      padding: 100px 0;
      display: flex;
      .chongwu-items {
        color: #fff;
        .chongwu {
          display: flex;
          .logo {
            border-radius: 50%;
            height: 60px;
          }
          .name {
            height: 60px;
            margin-left: 10px;
            font-size: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .declaration {
          margin-top: 5px;
          font-size: 14px;
          color: #fff;
          letter-spacing: 12px;
        }
      }
    }
    .reg-area {
      margin-left: 250px;
      background: #fff;
      width: 380px;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(19, 18, 18, 0.267);
      .reg-box {
        padding: 15px 40px 20px;
        .reg-nav {
          display: flex;
          margin-bottom: 16px;
          padding-top: 11px;
          border-bottom: 1px solid #ccc;
          border-bottom-color: #cccccc80;
          .regway {
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
        .reg-form {
          position: relative;
          top: 0;
          left: 0;
          .info-list {
            margin-top: 18px;
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
            .gender-select {
              display: flex;
              align-items: center;
              label {
                margin-left: 20px;
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
          .reg-button {
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
          .reg-help {
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
    }
  }
}
</style>
