<template lang="html">
  <div class="init-style">
    <el-container>
      <el-main>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="left-time">{{orderLeftTime}}</span>
            <span class="title">支付结果</span>
            <el-button class="go-home" type="text" @click="goHome">返回首页</el-button>
          </div>
          <div class="pay-item">
            <h3 class="item item-balance">卡余额：1.00</h3>
            <h3 class="item item-pay">支付扣除：1.00</h3>
            <div class="balance">
              卡内余额：￥68.65
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
    <el-button class="open-door-button" type="success">开门</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderLeftTime: '',
      startTime: '',
      timer: null
    }
  },
  methods: {
    goHome () {
      this.$router.push({name: 'posHome'})
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
      this.orderLeftTime = leftSeconds + ' 秒后返回首页'
      if (leftTime > 0) {
        this.timer = setTimeout(() => {
          this.getLeftTime()
        }, 1000)
      } else {
        this.orderLeftTime = ''
        this.goHome()
      }
    }
  },
  destroyed () {
    clearTimeout(this.timer)
    this.timer = null
  },
  created () {
    this.startTime = new Date()
    this.getLeftTime()
  }
}
</script>

<style lang="less" scoped>
  .init-style {
    position: absolute;
    right: 0;
    left: 0;
    top: 47px;
    bottom: 0;
    background-color: #E9EEF3;
  }
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
</style>
