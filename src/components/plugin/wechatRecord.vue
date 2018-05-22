<template lang="html">
  <div>
  </div>
</template>

<script>
const wx = require('weixin-js-sdk')
import {m6Get} from 'api/ajax'
export default {
  data () {
    return {
      vlist: [],
      timestamp: +new Date(),
      noncestr: 'Wm3WZYTPz0wzccnWsss',
      jsApiList: ['chooseImage', 'startRecord', 'playVoice', 'stopRecord', 'downloadVoice', 'uploadVoice', 'stopVoice', 'onVoicePlayEnd'],
      localId: ''
    }
  },
  props: {
    token: {
      type: String,
      default: ''
    },
    sound: {
      type: Boolean,
      default: true
    },
    ifRepeate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    ifRepeate (val) {
      if (!this.sound) return
      if (!val) return
      let that = this
      wx.ready(() => {
        wx.downloadVoice({
          serverId: this.token, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            that.localId = res.localId
            wx.playVoice({
              localId: res.localId // 需要播放的音频的本地ID，由stopRecord接口获得
            })
          }
        })
        wx.onVoicePlayEnd({
          success: function (res) {
            // window.M6.alert('playEnd')
            // this.ifRepeate = !val
            // window.M6.alert(this.ifRepeate)
            that.$emit('end')
            // let localId = res.localId; // 返回音频的本地ID
          }
        })
      })
    },
    token (val) {
      if (!this.sound) return
      if (!val) return
      let that = this
      wx.ready(() => {
        wx.downloadVoice({
          serverId: val, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            that.localId = res.localId
            wx.playVoice({
              localId: res.localId // 需要播放的音频的本地ID，由stopRecord接口获得
            })
          }
        })
      })
    },
    sound (val) {
      if (val) return
      let that = this
      wx.ready(() => {
        wx.stopVoice({
          localId: that.localId
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
