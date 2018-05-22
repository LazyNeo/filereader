<template lang="html">
  <div v-show="show" class="share" @click="show = false">
    <div class="share-layer">
    </div>
    <div class="share-intro">
      <img class="right-arrow" src="http://m6fresh.img-cn-shanghai.aliyuncs.com/img/bind-arrow-57add6a98d84c8c30525765cbbc97606.png" alt="">
      <div class="content">
        <p>点击右上角分享至朋友圈或发送给好友</p>
      </div>
    </div>
  </div>
</template>

<script>
const wx = require('weixin-js-sdk')
import {m6Get} from 'api/ajax'
export default {
  name: 'shareItem',
  data () {
    return {
      show: false
    }
  },
  props: {
    vInfo: {
      type: Object
    },
    notShow: {
      type: Boolean,
      default: false
    },
    uInfo: {
      type: Object
    }
  },
  methods: {
    initshareMenu (vInfo) {
      window.console.info('share', vInfo)
      if (!this.notShow) {
        this.show = true
      }
      wx.ready(() => {
        let link = ''
        let imgUrl = ''
        let title = ''
        let desc = ''
        if (vInfo.v_id) {
          link = 'http://wx.m6fresh.com/oauthpub_redirect.jsp?r_url=' + encodeURIComponent(encodeURIComponent('http://' + window.location.host + '/#/admin/autoLogin?otherType=72^extra=' + vInfo.v_id + '^_v=' + window.M6Config.appVersion))
          imgUrl = vInfo.head_url
          title = vInfo.u_name + '来求大拇指'
          desc = '竖起你的大姆指，给我鼓励或“赏”一下'
        } else {
          link = 'http://wx.m6fresh.com/oauthpub_redirect.jsp?r_url=' + encodeURIComponent(encodeURIComponent('http://' + window.location.host + '/#/admin/autoLogin?otherType=73^extra=' + vInfo.u_id + '^_v=' + window.M6Config.appVersion))
          imgUrl = vInfo.head_url
          title = vInfo.u_name + '来求助'
          desc = '一个玉米，三个帮！快来为他助力吧~'
        }
        // 发送给朋友
        wx.onMenuShareAppMessage({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          // title: news.title, // 分享标题
          // desc: news.Description, // 分享描述
          // link: news.Url, // 分享链接
          // imgUrl: news.PicUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            // window.M6.alert('用户点击发送给朋友dfds')
          },
          success: function () {
            // 用户确认分享后执行的回调函数
            // window.M6.alert('分享成功')
            // m6Get('shareVoice', {v_id: vInfo.v_id})
            if (vInfo.v_id) {
              m6Get('shareVoice', {v_id: vInfo.v_id})
            } else {
              window.MtaH5.clickStat('User_click', {'sharefood': 'true'})
            }
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            // window.M6.alert('分享失败')
          }
        })
        // 朋友圈
        wx.onMenuShareTimeline({
          title, // 分享标题
          link, // 分享链接
          imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            // m6Get('shareVoice', {v_id: vInfo.v_id})
            if (vInfo.v_id) {
              m6Get('shareVoice', {v_id: vInfo.v_id})
            } else {
              window.MtaH5.clickStat('User_click', {'sharefood': 'true'})
            }
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // 分享到QQ
        wx.onMenuShareQQ({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            // m6Get('shareVoice', {v_id: vInfo.v_id})
            if (vInfo.v_id) {
              m6Get('shareVoice', {v_id: vInfo.v_id})
            } else {
              window.MtaH5.clickStat('User_click', {'sharefood': 'true'})
            }
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // 分享到腾讯微博
        wx.onMenuShareWeibo({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            // m6Get('shareVoice', {v_id: vInfo.v_id})
            if (vInfo.v_id) {
              m6Get('shareVoice', {v_id: vInfo.v_id})
            } else {
              window.MtaH5.clickStat('User_click', {'sharefood': 'true'})
            }
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // 分享到QQ空间
        wx.onMenuShareQZone({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            // m6Get('shareVoice', {v_id: vInfo.v_id})
            if (vInfo.v_id) {
              m6Get('shareVoice', {v_id: vInfo.v_id})
            } else {
              window.MtaH5.clickStat('User_click', {'sharefood': 'true'})
            }
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        wx.showAllNonBaseMenuItem()
      })
    }
  },
  watch: {
    vInfo (newVal) {
      if (!newVal.v_id) {
        return
      }
      this.initshareMenu(newVal)
    },
    uInfo (newVal) {
      if (!newVal.u_id) {
        return
      }
      this.initshareMenu(newVal)
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.share
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 10000;
  .share-intro
    position: relative
    height: 400px
    z-index: 2
    img
      height: 80px
      width: 80px
      position: absolute
      top: 40px
      right: 40px
      z-index: 2
    .content
      width: 60%
      position: absolute
      top: 80px
      right: 30%
      border: dashed 2px #fff
      border-radius: 8px
      z-index: 2
      p
        font-size: 1rem
        color: #fff
        z-index: 2
  .share-layer
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: rgba(0, 0, 0, 0.7)
    z-index: 1
</style>
