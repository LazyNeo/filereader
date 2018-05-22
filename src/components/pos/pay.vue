<template lang="html">
  <div class="init-style">
    <el-container>
      <el-main>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>账单详情</span>
          </div>
          <div class="pay-item">
            <h3 class="item">商品种类：<b>{{statistic.kind}}</b> 种</h3>
            <h3 class="item">商品件数：<b>{{statistic.num}}</b> 件</h3>
            <h3 class="item">合计金额：<b>{{statistic.totalPrice|money}}</b> 元</h3>
            <h3 class="item discount">用卡折让：<b>{{statistic.discount|money}}</b> 元</h3>
            <h3 class="item need-pay">结算金额：<b>{{statistic.needPay |money}}</b> 元</h3>
            <div class="pay-button">
              <el-button type="primary" @click="payConfirm">确认支付</el-button>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      statistic: {}
    }
  },
  methods: {
    payConfirm () {
      this.$router.push({name: 'posPayResult'})
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.statistic = JSON.parse(vm.$route.params.statistic)
    })
  }
  // created () {
  //   this.statistic = JSON.parse(this.$route.params.statistic)
  // }
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
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    padding: 40px 20%;
    .box-card{
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
    }
  }
</style>
