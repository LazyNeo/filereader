<template lang="html">
  <el-container>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="left-time">{{orderLeftTime}}</span>
          <span class="title">支付结果</span>
          <el-button class="go-home" type="text" @click="goHome">返回首页</el-button>
        </div>
        <div class="pay-item">
          <h3 class="item item-balance">卡余额：￥{{beforeLeft}}</h3>
          <h3 class="item item-pay">支付扣除：￥{{needPay}}</h3>
          <div class="balance">
            卡内余额：￥{{left}}
          </div>
        </div>
      </el-card>
    </el-main>
    <span class="open-door-button"  @click="openDoor">开门</span>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import fs from 'fs'
import {m6Get} from 'api/ajax'
export default {
  data () {
    return {
      orderLeftTime: '',
      startTime: '',
      timer: null,
      needPay: 0,
      beforeLeft: 0,
      left: 0
    }
  },
  methods: {
    ...mapActions([
      'updateGlobalJob'
    ]),
    setGlobaJob (data) {
      this.updateGlobalJob({
        from: this.$route.name,
        data
      })
    },
    goHome (flag) {
      clearTimeout(this.timer)
      this.timer = null
      flag && this.setGlobaJob({
        user: false,
        good: true
      })
      this.$router.push({name: 'umsposHome'})
    },
    openDoor () {
      m6Get('openDoorByCard', {
        card_id: this.getUserInfo.card_id,
        is_outer: 1
      }).then(res => {
        if (res.code !== 0) {
          M6.alert(res.msg)
          return
        }
        M6.alert('开门成功,请尽快离店以防止自动挂锁。', {type: 'success'})
        this.setGlobaJob({
          user: true,
          good: true
        })
        this.goHome()
      })
    },
    getConfig () {
      try {
        let data = fs.readFileSync(M6Config.filePath + 'm6conf.json', 'utf-8')
        return JSON.parse(data)
      } catch (e) {
        if (e) {
          console.error(e)
        }
        return {}
      }
    },
    checkStaus () {
      m6Get('getLastEntryInfo', {client_id: this.getUserInfo.client_id || '53ACADEB-55A8-458B-8FC4-2223CCED1925'}).then(res => {
        if (res.code !== 0) {
          M6.alert(res.msg)
          return
        }
        let local = this.getConfig()
        console.info('weight', res.data.in_weight - local.sys.weightTotal - res.data.buy_weight, localConfig.sys.weightBound, res.data.in_weight, local.sys.weightTotal, res.data.buy_weight)
        if (Math.abs(res.data.in_weight - local.sys.weightTotal - res.data.buy_weight) > localConfig.sys.weightBound) {
          M6.confirm({
            msg: '您似乎还有未结账的商品，是否继续结账',
            okCallback: () => {
              this.getLeftTime()
            },
            okText: '确认没有，开门走人',
            cancelCallback: () => {
              this.goHome(true)
            },
            cancelText: '继续结账'
          })
        } else {
          this.getLeftTime()
        }
      })
    },
    addNumber (num) {
      let n = (num > 9) ? num : ('0' + num)
      return n
    },
    getLeftTime () {
      let endTime = this.startTime.getTime() + 10 * 1000 // 10秒后关闭
      let leftTime = endTime - (new Date().getTime())
      // let leftMinutes = this.addNumber(Math.floor(leftTime / 1000 / 60 % 60))
      let leftSeconds = this.addNumber(Math.floor(leftTime / 1000 % 60))
      this.orderLeftTime = leftSeconds + ' 秒后自动开门'
      if (leftTime > 0) {
        this.timer = setTimeout(() => {
          this.getLeftTime()
        }, 1000)
      } else {
        this.orderLeftTime = ''
        this.openDoor()
      }
    }
  },
  destroyed () {
    clearTimeout(this.timer)
    this.timer = null
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.startTime = new Date()
      vm.checkStaus()
      vm.needPay = Number(to.params.needPay)
      vm.beforeLeft = Number(to.params.beforePay)
      vm.left = Number(to.params.left)
    })
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  }
}
</script>

<style lang="less" scoped>
  .el-main {
    color: #333;
    text-align: center;
    padding: 40px 20%;
    .box-card{
      min-height: 300px;
      position: relative;
      .el-card__header{
        position: relative;
        .left-time{
          padding: 3px 0;
          position: absolute;
          left:20px;
          color: #F44336;
        }
        .go-home{
          position: absolute;
          right: 20px;
          padding: 3px 0;
          font-size: 16px;
        }
        .title{
          vertical-align: middle;
        }
      }
      .el-card__body {
        padding: 0px 0px;
      }
      .pay-item{
        .item{
          // line-height: 100px;
          padding: 10px;
          font-weight: normal;
        }
        .item-balance{
          padding-top: 40px;
        }
        .item-pay{
          margin-bottom: 40px;
        }
        .balance{
          background: #ADC7E8;
          padding: 10px 20px;
          text-align: right;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
  .open-door-button{
    color: #fff;
    text-align: center;
    height: 60px;
    width: 60px;
    line-height: 60px;
    font-size: 20px;
    position: fixed;
    bottom: 20px;
    left:20px;
    background-color: #00BCD4;
    border-radius: 50%;
  }
</style>
