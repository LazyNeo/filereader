<template>
  <div class="log-container" >
    <ul>
      <li v-for="(item, index) of list" :key="index">
        <span>{{item.time}}</span>
        <span :class="{'m6-error': item.error}">{{item.content}}</span>
      </li>
    </ul>
    <div>
      <m6cmd :hidden="true" @cardhandler="cardhandler" @weixincardhandler="weixincardhandler" @m6keyup="keyup"></m6cmd>
    </div>
    <audio hidden ref="ums_welcome_voice" preload="auto">
      <!-- 欢迎光临M6无人商店，祝您购物愉快 -->
      <source src="../static/music/ums_welcome.mp3"/>
    </audio>
    <audio hidden ref="ums_welcome_face_voice" preload="auto">
      <!-- 人脸认证成功！欢迎光临M6无人商店，祝您购物愉快 -->
      <source src="../static/music/ums_welcome_face.mp3"/>
    </audio>
    <audio hidden ref="ums_is_not_empty_voice" preload="auto">
      <!-- 店内已经有人了，请稍等进入 -->
      <source src="../static/music/ums_is_not_empty.mp3"/>
    </audio>
  </div>
</template>

<script>
import m6cmd from 'plugin/m6cmd'
import {m6Get} from 'api/ajax'
export default {
  data () {
    return {
      list: [],
      lastWaitTime: 1,
      maxWaitTime: 10,
      minWaitTime: 1,
      maxLength: 400,
      lastRequestTime: Date.now(),
      id: '',
      timmer: null
    }
  },
  methods: {
    pushitem () {
      this.list.push({
        time: new Date() + 'fsfs',
        content: 'ssssss'
      })
    },
    getLog () {
      this.lastRequestTime = Date.now()
      m6Get('getLocalLogs', {id: this.id}).then(res => {
        if (res.code !== 0) {
          M6.alert(res.msg)
          return
        }
        this.rederLog(res.data)
        if (res.data && res.data.lenth > 0) {
          this.lastWaitTime = this.minWaitTime
        } else if (this.lastWaitTime < this.maxWaitTime) {
          this.lastWaitTime ++
        }
        let div = document.getElementsByClassName('log-container')[0]
        // console.log(div.scrollHeight)
        // console.log(div.scrollTop)
        div.scrollTop = div.scrollHeight
        this.timmer = setTimeout(this.getLog, this.lastWaitTime * 1000)
      })
    },
    rederLog (list) {
      if (!list || list.length === 0) {
        return
      }
      let l = list.length + this.list.length
      for (let li of list) {
        if (!li.content) {
          console.error('list content信息缺失', list)
          continue
        }
        if (li.content.indexOf('open door with face') !== -1) {
          this.$refs.ums_welcome_face_voice.play()
        }
        if (li.content.indexOf('access denied') !== -1) {
          li.error = true
        }
      }
      if (l > this.maxLength) {
        this.list.splice(0, l - this.maxLength)
      }
      for (let i = list.length - 1; i >= 0; i--) {
        this.list.push(list[i])
      }
      let last = list[0]
      if (last.id > this.id) this.id = last.id
    },
    cardhandler (card) {
      m6Get('openDoorByCard', {card_id: card}).then(res => {
        if (res.code === 0) {
          // 成功开门 语音提示
          this.$refs.ums_welcome_voice.play()
        } else if (res.code === 12000) {
          this.$refs.ums_is_not_empty_voice.play()
        }
        this.lastWaitTime = this.minWaitTime
        clearTimeout(this.timmer)
        this.timmer = null
        this.getLog()
      })
    },
    weixincardhandler (code) {
      m6Get('getUserInfoByWeixinCode', {code: code}).then(res => {
        if (res.code !== 0) {
          return
        }
        this.cardhandler(res.data.card_id)
      })
    },
    keyup (e) {
      if (e.which === 68) {
        m6Get('resetStoreStatus')
        this.list.push({
          time: (new Date()).Format('yyyy/MM/dd hh:mm:ss'),
          error: true,
          content: '【管理员操作】重置系统信息'
        })
      }
    }
  },
  mounted () {
    this.time = Date.now() - 1000 * 60 * 60 * 5
    this.getLog()
    setInterval(() => {
      let change = Date.now - this.lastRequestTime
      if (change > 10 * 60000) {
        // 超过10分钟，没有请求
        // 断线重连
        this.lastWaitTime = this.minWaitTime
        clearTimeout(this.timmer)
        this.timmer = null
        this.getLog()
      }
    })
  },
  components: {
    m6cmd
  },
  destroyed () {
    clearInterval(this.timmer)
    this.timmer = null
  }
}
</script>

<style lang="less" scoped>
  .log-container{
    background-color: black;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    color: #fff;
    overflow: auto;
  }
</style>
