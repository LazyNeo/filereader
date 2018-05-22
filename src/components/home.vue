<template>
  <div class="home-login-list">
    <div v-if="true" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="claerUid">清除缓存</button>
    </div>
    <div v-if="config.question" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="goToQuestion">登陆答题系统</button>
    </div>
    <div v-if="config.questionAdmin" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="goToQuestionAdmin">登陆答题管理系统</button>
    </div>
    <div v-if="config.feed" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="goToFeed">登陆鸡六六</button>
    </div>
    <div v-if="config.purchase" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="goToPur">登陆采购系统</button>
    </div>
    <div v-if="config.store" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="goToStorage">登陆仓储系统</button>
    </div>
    <div v-if="config.map" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="goToMap">登陆店铺巡航系统</button>
    </div>
    <div v-if="config.auth" class="login-box">
        <button type="button" class="btn-success btn btn-lg" name="button" @click="goToAuth">登陆权限管理系统</button>
    </div>
  </div>

</template>

<script>
import {m6Get} from '../../api/ajax'
export default {
  name: 'app',
  data () {
    return {
      uId: '-1',
      config: {
        question: false,
        questionAdmin: false,
        auth: false,
        purchase: false,
        store: false,
        map: false
      }
    }
  },
  components: {
  },
  methods: {
    claerUid () {
      window.CK.setCookie('u_id', null)
    },
    goToQuestion () {
      this.otherTypeLogin('2', this.uId)
    },
    goToQuestionAdmin () {
      this.otherTypeLogin('3', this.uId)
    },
    goToPur () {
      this.otherTypeLogin('10', this.uId)
    },
    goToFeed () {
      this.otherTypeLogin('70', this.uId)
    },
    goToStorage () {
      this.otherTypeLogin('20', this.uId)
    },
    goToAuth () {
      this.otherTypeLogin('0', this.uId)
    },
    goToMap () {
      this.$router.push({name: 'myMap'})
    },
    otherTypeLogin (otherType, uId) {
      m6Get('generalLogin', {type: otherType, u_id: uId}).then(res => {
        if (res.code === 0) {
          window.CK.setCookie('u_id', res.data.u_id)
          window.CK.setCookie('pm_name', res.data.pm_name)
          window.CK.setCookie('M6_TOKEN', res.data.M6_TOKEN)
          if (otherType === '0') {
            this.$router.push({name: 'adminAuthHome'})
          } else if (otherType === '2') {
            this.$router.push({name: 'applicationShake'})
          } else if (otherType === '3') {
            this.$router.push({name: 'adminQuestionIndex'})
          } else if (otherType === '20' || otherType === '21') {
            this.$router.push({name: 'adminStorageHome'})
          } else if (otherType === '10' || otherType === '11') {
            this.$router.push({name: 'purchaseHome'})
          } else if (otherType === '70') {
            this.$router.push({name: 'feedHome'})
          }
        } else if (res.code > 309 && res.code < 315) {
          window.M6.alert(res.msg + ',即将跳转权限申请页面')
          setTimeout(() => {
            // this.$router.push({name: 'adminHome'})
            // 跳转申请答题权限页面
            window.location.href = 'http://shake.m6fresh.com/#/submit?_type=' + otherType + '&_user=' + uId
          }, 2000)
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
    let uId = window.CK.getUrlVar('_user') || window.CK.getCookie('u_id')// 用户id
    if (!window.CK.is_weixin() && !uId) {
      // pc端默认u_id为1
      uId = 1
    }
    if (uId) {
      window.CK.setCookie('u_id', uId)
      this.uId = uId
    }
    m6Get('getUserAuthConfig', {u_id: uId}).then((res) => {
      if (res.code !== 0) {
        window.M6.alert(res.msg)
        return
      }
      this.config = res.data
    })
    window.CK.dataCollect('102', '统一主页展示')
  }
}
</script>

<style lang="less" scoped>
  .home-login-list{
    position: absolute;
    min-height: 100%;
    top: 0;
    left: 0;
    right: 0;
    // background: url('http://m6fresh.oss-cn-shanghai.aliyuncs.com/m6shake/XzRTnirEEHbWx2JafNrDYh3y.jpg') repeat;
    .login-box{
      width: 375px;
      padding: 40px 30%;
      button{
        width: 180px;
      }
    }
  }
</style>
