<template>
  <div class="login-box">
    <div class="login">
        <div v-if="otherType < 0" class="message">M6-登录</div>
        <div v-else class="message">登录中</div>
        <div id="darkbannerwrap"></div>
        <form v-if="otherType < 0" method="post">
            <input name="username" placeholder="用户名" required type="text" v-model="userName">
            <hr class="hr15">
            <input name="password" placeholder="密码" required v-model="passWord" type="password" v-on:keydown.enter="submit">
            <hr class="hr15">
            <input value="登录"  id="submitBtn" style="width:100%;" type="button" @click="submit">
            <hr class="hr20">
        </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {m6Get} from '../../api/ajax'
export default {
  name: 'app',
  data () {
    return {
      userName: '',
      passWord: '',
      otherType: -1
    }
  },
  components: {
  },
  methods: {
    submit: function (e) {
      e.preventDefault()
      if (this.userName === 'm6Fresh' && this.passWord === '654321') {
        Vue.CK.setCookie('u_id', 1)
        this.$router.push({name: 'adminQuestionIndex'})
      } else {
        window.M6.alert('账号密码错误！如不知晓登陆账号，请联系信息部')
      }
    },
    otherTypeLogin (otherType, uId, extra) {
      m6Get('generalLogin', {type: otherType, u_id: uId, extra}).then(res => {
        if (res.code === 0) {
          Vue.CK.setCookie('u_id', res.data.u_id)
          Vue.CK.setCookie('pm_name', res.data.pm_name)
          window.CK.setCookie('M6_TOKEN', res.data.M6_TOKEN)
          if (otherType === '1') {
            this.$router.push({name: 'applicationShake', params: {type: extra}})
          } else if (otherType === '2') {
            this.$router.push({name: 'adminQuestionIndex'})
          } else if (otherType === '3') {
            this.$router.push({name: 'applicationActivity', params: {aId: extra}})
          } else if (otherType === '4') {
            this.$router.push({name: 'applicationAssess', params: {eId: extra}})
          } else if (otherType === '20' || otherType === '21') {
            this.$router.push({name: 'adminStorageHome'})
          } else if (otherType === '10' || otherType === '11') {
            this.$router.push({name: 'purchaseHome'})
          } else if (otherType === '70' || otherType === '71') {
            this.$router.push({name: 'feedHome'})
          } else if (otherType === '0') {
            this.$router.push({name: 'generalHome'})
          }
        } else {
          // 显示返回错误信息
          window.M6.alert(res.msg, -1, () => {
            this.$router.push({name: 'error'})
          })
        }
      })
    }
  },
  created () {
    let uId = Vue.CK.getUrlVar('_user') // 用户id
    let type = Vue.CK.getUrlVar('_t') // 类型
    let otherType = Vue.CK.getUrlVar('otherType') // 其他类型
    let extra = Vue.CK.getUrlVar('extra') // 其他类型
    if (uId) {
      Vue.CK.setCookie('u_id', uId)
      if (otherType >= 0) {
        this.otherType = Number(otherType)
        this.otherTypeLogin(otherType, uId, extra)
      } else if (type === '1') {
        // 跳转管理员用户
        this.otherTypeLogin('2', uId, extra)
      } else {
        // 普通答题用户
        this.otherTypeLogin('1', uId, extra)
      }
    }
    window.CK.dataCollect('101', '登陆页面展示')
  }
}
</script>

<style scoped>
  .login-box {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    /* background: url('http://m6fresh.oss-cn-shanghai.aliyuncs.com/m6shake/XzRTnirEEHbWx2JafNrDYh3y.jpg'); */
  }
  @media screen and (max-width: 767px){
      .login{
          width:90%;
      }
  }

  .login{
      margin: 150px auto 0 auto;
      min-height: 420px;
      max-width: 420px;
      padding: 40px;
      background-color: #ffffff;
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
      /* overflow-x: hidden; */
      box-sizing: border-box;
  }
  a.logo{
      display: block;
      height: 58px;
      width: 167px;
      margin: 0 auto 30px auto;
      background-size: 167px 42px;
  }
  .message {
      font-family: "Arial Black";
      font-weight: bolder;
      margin: 10px 0 0 -58px;
      padding: 4px 10px 4px 60px;
      background: #27A9E3;
      position: relative;
      color: #fff;
      font-size: 30px;
  }
  #darkbannerwrap {
      /* background: url('http://m6fresh.oss-cn-shanghai.aliyuncs.com/m6shake/RAePjWAwRP3bbpnHxd5yPA7D.png'); */
      width: 18px;
      height: 10px;
      margin: 0 0 20px -58px;
      position: relative;
  }

  input[type=text],
  input[type=file],
  input[type=password],
  input[type=email], select {
      border: 1px solid #DCDEE0;
      vertical-align: middle;
      border-radius: 3px;
      height: 50px;
      padding: 0 16px;
      font-size: 14px;
      color: #555555;
      outline:none;
      width:100%;
  }
  input[type=text]:focus,
  input[type=file]:focus,
  input[type=password]:focus,
  input[type=email]:focus, select:focus {
      border: 1px solid #27A9E3;
  }


  input[type=submit], input[type=button]{
      display: inline-block;
      vertical-align: middle;
      padding: 12px 24px;
      margin: 0;
      font-size: 18px;
      line-height: 24px;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      color: #ffffff;
      background-color: #27A9E3;
      border-radius: 3px;
      border: none;
      -webkit-appearance: none;
      outline:none;
      width:100%;
  }
  hr.hr15 {
      height: 15px;
      border: none;
      margin: 0;
      padding: 0;
      width: 100%;
  }
  hr.hr20 {
      height: 20px;
      border: none;
      margin: 0;
      padding: 0;
      width: 100%;
  }

  .copyright{
      font-size:14px;
      color:rgba(255,255,255,0.85);
      display:block;
      position:absolute;
      bottom:15px;
      right:15px;
  }
</style>
