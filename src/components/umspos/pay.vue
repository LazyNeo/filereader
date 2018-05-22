<template lang="html">
  <el-container>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button class="back-button" type="text" @click="back">
            <i class="iconfont">&#xe614;</i>
            <span>返回</span>
          </el-button>
          <span>账单详情</span>
        </div>
        <div class="pay-item">
          <h3 class="item">商品种类：<b>{{getCartInfo.kind}}</b> 种</h3>
          <h3 class="item">商品件数：<b>{{getCartInfo.num}}</b> 件</h3>
          <h3 class="item">合计金额：<b>{{getCartInfo.totalPrice|money}}</b> 元</h3>
          <h3 class="item discount">用卡折让：<b>{{getCartInfo.discount|money}}</b> 元</h3>
          <h3 class="item need-pay">结算金额：<b>{{getCartInfo.needPay |money}}</b> 元</h3>
          <div class="pay-button">
            <el-button type="primary" @click="payConfirm">确认支付</el-button>
          </div>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {m6Get, globalGet} from 'api/ajax'
export default {
  data () {
    return {
      statistic: {}
    }
  },
  methods: {
    ...mapActions([
      'updateUserInfo'
    ]),
    back () {
      this.$router.go(-1)
    },
    sendDataToO2o (data) {
      if (!this.getUserInfo.openid) {
        console.warn('缺失opendi，不传递订单信息')
        // return
      }
      let url = ''
      if (localConfig.is_debug) {
        url = 'http://192.168.1.58:8088/o2o/php/index.php/Home/Ums/submitUmsOrder'
      } else {
        url = 'https://shake.m6fresh.com/v2/php/index.php/Home/Ums/submitUmsOrder'
      }
      globalGet(url, {
        pluData: data.goods_data,
        store_code: localConfig.store_code,
        money: data.money,
        openid: this.getUserInfo.openid || 'gyq'
      }, {loadingNotShow: true})
    },
    payConfirm () {
      let list = []
      for (let plu in this.getCartInfo.list) {
        if (!this.getCartInfo.list.hasOwnProperty(plu)) {
          continue
        }
        let g = this.getCartInfo.list[plu]
        list.push({plu: g.plu, qty: g.count, price: g.act_price, unit: g.unit.toUpperCase(), des: g.des})
      }
      let data = {
        goods_data: JSON.stringify(list),
        card_id: '0014087510',
        need_pay: 1,
        money: this.getCartInfo.needPay.toFixed(2)
      }
      m6Get('submitOrder', data).then(res => {
        if (res.code !== 0) {
          M6.alert(res.msg)
          return
        }
        let beforePay = this.getUserInfo.balance
        let needPay = this.getCartInfo.needPay.toFixed(2)
        let user = this.getUserInfo
        user.balance = (user.balance - this.getCartInfo.needPay.toFixed(2)).toFixed(2)
        this.sendDataToO2o(data)
        this.updateUserInfo(user)
        this.$router.push({name: 'umsposPayResult', params: {beforePay, needPay, left: user.balance}})
      })
    }
  },
  computed: {
    ...mapGetters([
      'getCartInfo',
      'getUserInfo'
    ])
  }
}
</script>

<style lang="less" scoped>
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    padding: 40px 20%;
    .box-card{
      position: relative;
      .pay-item{
        .item{
          padding: 10px;
          font-weight: normal;
        }
        .pay-button{
          border-top: 1px solid #f1f1f1;
          margin: 0 10%;
          padding: 10px;
          text-align: right;
        }
      }
      .back-button{
        position: absolute;
        left: 20px;
        top: 7px;
        font-size: 20px;
        margin-left: 20px;
      }
    }
  }
</style>
