<template lang="html">
  <div>
    <print hidden ref="pop_sync_printer" :oid="printOid" @doprint="doPrint"></print>
    <audio hidden ref="order_voice" preload="auto">
      <source src="../static/music/order.mp3"/>
    </audio>
  </div>
</template>

<script>
import {m6Get} from 'api/ajax'
import {mapGetters, mapActions} from 'vuex'
import print from './printList'
export default {
  data () {
    return {
      timer: null,
      env: 'center',
      syncFunc: false, // 是否具有同步功能
      netWorking: false,
      period: 3, // 时间间隔
      today: (new Date()).Format('yyyy/MM/dd'),
      syncWork: false,
      logs: [],
      printList: [],
      printOid: '',
      pos: {
        b: 10,
        r: 10
      }
    }
  },
  methods: {
    ...mapActions([
      'updateSyncMsgList',
      'updateSyncNums'
    ]),
    goto (name) {
      this.$router.push({name})
    },
    popClick () {
      if (this.syncWork) {
        this.goto('syncHome')
      } else {
        M6.alert(`同步功能开启时间为${localConfig.sync.startHours}:00至${localConfig.sync.endHours}:00,当前时间不工作`, {type: 'error'})
      }
    },
    playOrderVoice () {
      this.$refs.order_voice.play()
    },
    updateOrderInfo () {
      let config = {
        loadingNotShow: true,
        errorShow: (this.$route.name === 'syncHome'),
        timeout: 120000
      }
      m6Get('getOrders', {store_code: localConfig.store_code, mode: localConfig.env},
        config).then(res => {
          if (res.code !== 0) {
            window.M6.alert(res.msg)
            return
          }
          let item = this.getSyncNums
          item.updateNum += 1
          if ((res.data.net_order_insert_num + res.data.net_order_update_num) === 0) {
            // 未发生修改，只把次数加1
            this.updateSyncNums(item)
            return
          }
          item.updateOrderNum = res.data.net_order_insert_num + res.data.net_order_update_num
          let msgs = this.getSyncMsgList
          msgs.unshift({
            time: new Date().Format('yyyy/MM/dd hh:mm:ss'),
            num: `订单信息同步，新增${res.data.net_order_insert_num}条,更新${res.data.net_order_update_num}条`
          })
          if (msgs.length > localConfig.sync.maxLogNum) {
            msgs.pop()
          }
          this.updateSyncMsgList(msgs)
          if (item.updateOrderNum === 0) {
            return
          }
          this.updateSyncNums(item)
          CK.setCookie('pos_today_order_num', JSON.stringify({
            data: item.todayOrderNum + item.updateOrderNum,
            date: this.today
          }))
        })
    },
    gotoNextUpdate (type = 'orderClick') {
      if (this.getSyncNums[type]) {
        return
      }
      let item = this.getSyncNums
      item.leftTime = '00:00'
      item[type] = true
      item.lastUpdateTime = Date.now()
      item.nextUpdateTime = item.lastUpdateTime + this.period * 1000
      this.updateSyncNums(item)
      setTimeout(() => {
        item[type] = false
        this.updateSyncNums(item)
      }, 1000)
      if (type === 'orderClick') {
        this.updateOrderInfo()
      } else {
        this.getPrintList()
      }
    },
    doPrint (res) {
      if (this.printList.length === 0) {
        // 已经没有了
        return
      }
      this.printOid = this.printList.pop()
      this.$nextTick(() => {
        this.$refs.pop_sync_printer.refreshInfo()
        this.playOrderVoice()
      })
    },
    addNumber (num) {
      let n = (num > 9) ? num : ('0' + num)
      return n
    },
    getLeftTime () {
      let hour = (new Date()).getHours()
      if (hour < localConfig.sync.startHours || hour > localConfig.sync.endHours) {
        this.$emit('change', false)
        this.syncWork = false
        return
      } else {
        this.$emit('change', true)
        this.syncWork = true
      }
      let leftTime = this.getSyncNums.nextUpdateTime - Date.now()
      if (leftTime > 0) {
        // 更新时间还未到
        let leftMinutes = this.addNumber(Math.floor(leftTime / 1000 / 60 % 60))
        let leftSeconds = this.addNumber(Math.floor(leftTime / 1000 % 60))
        let item = this.getSyncNums
        item.leftTimeNum = leftTime
        item.leftTime = leftMinutes + ':' + leftSeconds
        this.updateSyncNums(item)
        return
      }
      // 开始刷新
      // 倒计时结束，刷新数据，重新计时
      this.gotoNextUpdate(localConfig.env === 'center' ? 'orderClick' : 'printClick')
    },
    getPrintList () {
      m6Get('getNonPrintList', {mode: this.env}, {loadingNotShow: true}).then(res => {
        if (res.code !== 0) {
          console.error('获取打印列表错误', res.msg)
          return
        }
        if (res.data.length === 0) {
          return
        }
        let msgs = this.getSyncMsgList
        msgs.unshift({
          time: new Date().Format('yyyy/MM/dd hh:mm:ss'),
          num: `打印订单${res.data.length}个`
        })
        if (msgs.length > localConfig.sync.maxLogNum) {
          msgs.pop()
        }
        this.updateSyncMsgList(msgs)
        if (res.data.length === 0) {
          return
        }
        this.printList.push(...res.data)
        this.doPrint()
        if (this.logs.length > localConfig.sync.maxLogNum) {
          this.logs.pop()
        }
      })
    },
    init () {
      this.netWorking = localConfig.net_working
      this.syncFunc = localConfig.comps.sync
      this.timer = setInterval(() => {
        this.getLeftTime()
      }, 1000)
    }
  },
  created () {
    this.period = Number(localConfig.sync.period)
    this.env = localConfig.env
    let todayOrderNum = CK.getCookie('pos_today_order_num')
    if (todayOrderNum) {
      todayOrderNum = JSON.parse(todayOrderNum)
      if (todayOrderNum.date === this.today && todayOrderNum.data) {
        // 存在今日的数据
        todayOrderNum = todayOrderNum.data
      } else {
        todayOrderNum = 0
      }
    } else {
      todayOrderNum = 0
    }
    this.updateSyncNums({
      firstUpdateTime: new Date().Format('yyyy/MM/dd hh:mm:ss'),
      updateOrderNum: 0,
      todayOrderNum,
      lastUpdateTime: 0,
      nextUpdateTime: 0,
      orderClick: false,
      printClick: false,
      updateNum: 0,
      leftTime: '00:00',
      leftTimeNum: 0,
      gotoNextUpdate: this.gotoNextUpdate
    })
    if (localConfig.net_working) {
      this.timer = setInterval(this.init, 1000)
    } else {
      CK.setCallBack('net_working', this.init)
    }
  },
  computed: {
    ...mapGetters([
      'getSyncNums',
      'getSyncNums'
    ]),
    posStyle () {
      return {
        right: this.pos.r + 'px',
        bottom: this.pos.b + 'px'
      }
    },
    leftPart () {
      if (!this.syncWork) {
        return {}
      }
      let l = Number.parseInt(this.getSyncNums.leftTimeNum / this.period / 1000 * 40)
      return {
        width: (40 - l) + 'px'
      }
    }
  },
  components: {
    print
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="less" scoped>
  .sync-pop{
    position: fixed;
    background-color: rgba(103, 194, 58, 0.274);
    line-height: 40px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    z-index: 10;
    .iconfont{
      text-align: center;
      font-size: 30px;
      color: #26A2FF;
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      &.net-work{
        font-size: 20px;
      }
    }
    .back-container{
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .part{
        top: 0;
        float: left;
        height: 100%;
        background-color: #67C23A;
      }
    }
  }
</style>
