<template>
  <div class="login-box">
    <div class="login">
        <div class="message">{{msg}}</div>
    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import {m6Get} from 'api/ajax'
export default {
  name: 'app',
  data () {
    return {
      msg: '',
      otherType: -1
    }
  },
  components: {
  },
  methods: {
    otherTypeLogin (otherType, data, extra) {
      data.type = otherType
      data.extra = extra
      m6Get('generalCodeLogin', data).then(res => {
        // window.M6.alert(JSON.stringify(res))
        if (res.code === 0) {
          Vue.CK.setCookie('u_id', res.data.u_id)
          Vue.CK.setCookie('pm_name', res.data.pm_name)
          window.CK.setCookie('M6_TOKEN', res.data.M6_TOKEN)
          if (otherType === '1') {
            this.$router.push({name: 'applicationShake'})
          } else if (otherType === '2') {
            this.$router.push({name: 'adminQuestionIndex'})
          } else if (otherType === '3') {
            this.$router.push({name: 'applicationActivity', params: {aId: extra}})
          } else if (otherType === '4') {
            this.$router.push({name: 'applicationAssess', params: {eId: extra}})
          } else if (otherType === '5') {
            this.$router.push({name: 'applicationShakeType', params: {type: 1}})
          } else if (otherType === '20' || otherType === '21') {
            this.$router.push({name: 'adminStorageHome'})
          } else if (otherType === '10' || otherType === '11') {
            this.$router.push({name: 'purchaseHome'})
          } else if (otherType === '31' || otherType === '32' || otherType === '32') {
            this.$router.push({name: 'storeList'})
          } else if (otherType === '40' || otherType === '41') {
            this.$router.push({name: 'scanActivityList'})
          } else if (otherType === '70') {
            this.$router.push({name: 'feedHome'})
          } else if (otherType === '71') {
            this.$router.push({name: 'feedHome'})
          } else if (otherType === '72') {
            this.$router.push({name: 'feedShareHome', params: {vId: extra}})
          } else if (otherType === '73') {
            this.$router.push({name: 'feedShareFood', params: {uId: extra}})
          } else if (otherType === '81') {
            this.$router.push({name: 'doorList'})
          } else if (otherType === '82') {
            this.$router.push({name: 'doorSingle', query: {d_id: extra}})
          } else if (otherType === '83') {
            this.$router.push({name: 'doorOperateList'})
          } else if (otherType === '0') {
            this.$router.push({name: 'generalHome'})
          } else {
            window.M6.alert('参数错误!', -1)
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
    let index = 0
    setInterval(() => {
      if (index % 6 === 0) {
        this.msg = '自动登录中.'
      } else if (index % 6 === 1) {
        this.msg = '自动登录中..'
      } else if (index % 6 === 2) {
        this.msg = '自动登录中...'
      } else if (index % 6 === 3) {
        this.msg = '自动登录中....'
      } else if (index % 6 === 4) {
        this.msg = '自动登录中.....'
      } else if (index % 6 === 5) {
        this.msg = '自动登录中......'
      }
      index++
    }, 200)
    let data = {
      openid: Vue.CK.getUrlVar('openid'), // 用户openid
      nickname: decodeURIComponent(Vue.CK.getUrlVar('nickname')), // 用户nickname
      headimgurl: decodeURIComponent(Vue.CK.getUrlVar('headimgurl')), // 用户code
      md5: Vue.CK.getUrlVar('md5') // 用户md5
    }
    let type = Vue.CK.getUrlVar('otherType') || '70' // 类型
    let extra = Vue.CK.getUrlVar('extra') // 额外变量
    let version = Vue.CK.getUrlVar('_v') // 额外变量
    // window.alert(Vue.CK.getUrlVar('otherType'))
    if (!data.openid || !version) {
      // 没有code,跳转获取code
      let url = 'http://wx.m6fresh.com/oauthpub_redirect.jsp?r_url=' + encodeURIComponent(encodeURIComponent('http://' + window.location.host + '/#/admin/autoLogin?otherType=' + type + '^extra=' + extra + '^_v=' + window.M6Config.appVersion))
      window.location.href = url
      return
    }
    this.otherTypeLogin(type, data, extra)
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
    /*background: url('http://m6fresh.oss-cn-shanghai.aliyuncs.com/m6shake/XzRTnirEEHbWx2JafNrDYh3y.jpg');*/
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
