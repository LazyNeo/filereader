<template>
  <div class="init-style">
    <el-container style="height:100%;">
      <el-container>
        <!-- 左侧 -->
        <el-container>
          <!-- 主体：表格区域 -->
          <el-main>
            <el-table :data="computedTableData" border style="width: 100%;height:100%;">
              <el-table-column fixed prop="date" label="序号" type="index" width="100"> </el-table-column>
              <el-table-column prop="plu" label="条码/编号" width="120"> </el-table-column>
              <el-table-column prop="des" label="商品描述" min-width="200"> </el-table-column>
              <el-table-column prop="count" label="数量" width="100"> </el-table-column>
              <el-table-column prop="price" label="单价" width="100"></el-table-column>
              <el-table-column label="折扣" width="100">
                <template slot-scope="scope">{{ scope.row.discount | money}}</template>
              </el-table-column>
              <el-table-column label="金额" width="100">
                <template slot-scope="scope">{{ scope.row.act_price | money}}</template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="medium"
                  @click.native.prevent="deleteRow(scope.$index, tableData)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <!-- 底部：操作栏 -->
          <el-footer>
            <el-input placeholder="请录入" v-model="inputData" @keyup.13.native="submitTest" ref="pos_cmd_input">
            </el-input>
            <el-button v-if="tableData.length<=0" disabled class="gopay" type="primary" @click="pay">去支付</el-button>
            <el-button v-else class="gopay" type="primary" @click="pay">去支付</el-button>
          </el-footer>
        </el-container>
        <!-- 右侧 -->
        <el-aside width="300px">
          <el-card class="box-card exe-name">
            <div slot="header" class="clearfix">
              <span class="name"> <b>M6</b></span>
            </div>
            <div v-if="userInfo.user_name" class="customer">
              <img class="headImg" src="../../assets/img/headImg.jpg?x-oss-process=image/resize,m_mfit,h_180,w_180" alt="">
              {{userInfo.user_name}}({{userInfo.card_no}})
              <i v-if="userInfo.class === 'V'" class="iconfont vip">&#xe688;</i>
            </div>
            <div v-else class="customer">
              亲爱的M6用户
            </div>
            <div v-if="userInfo.user_name" class="balance">
              <span>卡余额：￥{{userInfo.balance}}</span>
            </div>
          </el-card>
          <!-- statistic统计 -->
          <el-card class="box-card statistic">
            <div slot="header" class="clearfix">
              <span>Statistic</span>
            </div>
            <div class="statistic-main">
              <h3 class="item">商品种类：<b>{{statistic.kind}}</b> 种</h3>
              <h3 class="item">商品件数：<b>{{statistic.num}}</b> 件</h3>
              <hr>
              <h3 class="item">小计金额：<b>{{statistic.totalPrice|money}}</b> 元</h3>
              <h3 v-if="userInfo.class === 'V'" class="item discount">vip折让：<b>{{statistic.discount|money}}</b> 元</h3>
              <h3 v-else class="item discount">用卡折让：<b>{{statistic.discount|money}}</b> 元</h3>
              <hr>
              <h3 class="item need-pay">结算金额：<b>{{statistic.needPay |money}}</b> 元</h3>
            </div>
          </el-card>
          <!-- 当前挂单列表 -->
          <el-card hidden class="box-card resting-order">
            <div slot="header" class="clearfix">
              <span>当前挂单列表</span>
            </div>
            <div class="resting-order-main">
              <el-table
                :data="tableData2"
                stripe
                style="width: 100%">
                <el-table-column prop="date" label="库号" width=""></el-table-column>
                <el-table-column prop="name" label="客户" width=""></el-table-column>
                <el-table-column prop="address" label="记数"></el-table-column>
                <el-table-column prop="address" label="操作"></el-table-column>
                <el-table-column prop="address" label="时间"></el-table-column>
              </el-table>
            </div>
          </el-card>
          <!-- 当前使用抵用券列表 -->
          <el-card hidden class="box-card resting-order vouchers">
            <div slot="header" class="clearfix">
              <span>当前使用抵用券列表</span>
            </div>
            <div  class="resting-order-main">
              <el-table :data="tableData3" stripe style="width: 100%">
                <el-table-column prop="date" label="序号" width=""></el-table-column>
                <el-table-column prop="name" label="商品描述" width=""></el-table-column>
                <el-table-column prop="address" label="券值"></el-table-column>
                <el-table-column prop="address" label="券号"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { m6Get } from 'api/ajax'
import nw from 'nw.gui'
export default {
  data () {
    return {
      tableData: [],
      tableData2: [],
      tableData3: [],
      cardId: '0001143660',
      userInfo: {},
      inputData: '',
      lastEditTime: Date.now(),
      handlerTimmer: null,
      timer: null
    }
  },
  methods: {
    getUserInfo ({cardId}) {
      if (this.userInfo.card_id === cardId) {
        // 该卡号已读取
        return
      }
      let data = {
        // force_lock: 1, // 标记卡片信息需要锁定
        card_id: cardId
      }
      m6Get('getUserInfoByCardId', data).then(res => {
        if (res.code !== 0) {
          window.M6.alert(res.msg)
          return
        }
        if (this.userInfo.card_id) {
          m6Get('unlockCard', {card_id: this.userInfo.card_id, store: this.userInfo.store})
        }
        this.userInfo = res.data
      })
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    addProduct ({plu = '', code = '', weight = 1}) {
      if (!plu && !code) {
        M6.alert('商品条码不正确，请重新扫描或输入')
        return
      }
      let data = {
        plu,
        code
      }
      m6Get('getGoodsInfoByPlu', data).then(res => {
        if (res.code !== 0) {
          window.M6.alert(res.msg)
          return
        }
        res.data.count = weight // 数量
        this.tableData.push(res.data)
      })
    },
    pay () {
      if (JSON.stringify(this.userInfo) === '{}') {
        window.M6.alert('您还未刷卡登陆哦~', -1, () => {})
        return
      }
      this.$router.push({
        name: 'posPay',
        params: { statistic: JSON.stringify(this.statistic) }
      })
    },
    getFocus () {
      this.timer = setInterval(() => {
        this.$refs.pos_cmd_input.focus()
      }, 1000)
    },
    submitTest () {
      if (!M6Config.ifDev) return
      if (!this.inputData) return
      if (this.handlerTimmer) {
        clearTimeout(this.handlerTimmer)
        this.handlerTimmer = null
      }
      let newVal = this.inputData
      this.inputData = ''
      if (newVal.length === 13) {
        this.goodInputHandler(newVal)
        return
      } else if (newVal.length === 10) {
        this.cardInputHandler(newVal)
        return
      }
      this.addProduct({plu: newVal, weight: Math.floor(1 + Math.random() * 5)})
    },
    goodInputHandler (val) {
      if (val.startsWith('20')) {
        let plu = Number(val.substr(3, 4))
        let weight = Number(val.substr(7, 5)) / 1000
        this.addProduct({plu, weight})
        return
      }
      this.addProduct({code: val, weight: 1})
    },
    cardInputHandler (cardId) {
      this.getUserInfo({cardId})
    },
    parentHandler (newVal) {
      if (!newVal) return
      this.inputData = ''
      if (newVal.length === 10 && newVal.startsWith('00')) {
        // 识别到卡
        this.cardInputHandler(newVal)
        return
      }
      if (newVal.length === 13) {
        // 识别到商品
        this.goodInputHandler(newVal)
        return
      }
    }
  },
  computed: {
    computedTableData () {
      let computedTableData = CK.deepCopy(this.tableData)
      // 判断用户类型，是否v卡、卡
      if (!this.userInfo.card_id) {
        for (let item of computedTableData) {
          item.act_price = item.price * item.count
          item.discount = 0
        }
      } else if (this.userInfo.class === 'V') {
        for (let item of computedTableData) {
          item.act_price = item.p_price * item.count
          item.discount = item.price * item.count - item.act_price
        }
      } else {
        for (let item of computedTableData) {
          item.act_price = item.card_price * item.count
          item.discount = item.price * item.count - item.act_price
        }
      }
      return computedTableData
    },
    statistic () {
      let statistic = {
        totalPrice: 0,
        needPay: 0,
        discount: 0,
        num: 0,
        kind: 0
      }
      let kinds = {}
      let kind = 0 // 商品种类
      for (let item of this.computedTableData) {
        if (!kinds[item.plu]) {
          kinds[item.plu] = true
          kind++
        }
        statistic.totalPrice += item.price * item.count
        statistic.needPay += item.act_price
      }
      statistic.discount = Number(
        statistic.totalPrice - statistic.needPay
      ).toFixed(2)
      statistic.num = this.computedTableData.length
      statistic.kind = kind
      return statistic
    }
  },
  components: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'posPayResult') {
        vm.tableData = []
        // if (vm.userInfo.card_id) {
        //   m6Get('unlockCard', {card_id: vm.userInfo.card_id, store: vm.userInfo.store})
        // }
        vm.userInfo = {}
      }
    })
  },
  watch: {
    inputData (newVal, old) {
      this.lastEditTime = Date.now()
      if (this.handlerTimmer) {
        clearTimeout(this.handlerTimmer)
        this.handlerTimmer = null
      }
      this.handlerTimmer = setTimeout(() => {
        this.parentHandler(newVal)
      }, 1000)
    }
  },
  created () {
    this.getFocus()
    setInterval(() => {
      let now = Date.now()
      if (now - this.lastEditTime > 5000) {
        // 超过5s没输入 清除输入框
        this.inputData = ''
      }
    }, 1000)
    if (M6Config.ifDev) return
    let win = nw.Window.get()
    win.enterFullscreen()
  },
  destroyed () {
    clearTimeout(this.timer)
    this.timer = null
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
}
aside.el-aside {
  padding: 10px;
  .statistic {
    .statistic-main {
      padding: 10px 20px;
      min-height: 100px;
      .item {
        font-weight: normal;
        padding: 5px 0;
        font-size: 16px;
        &.discount {
          color: #4caf50;
        }
        &.need-pay {
          color: #ff9800;
        }
      }
    }
  }
  .resting-order {
    margin-top: 10px;
    .el-card__body {
      padding: 0px;
    }
  }
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  height: 200px !important;
  padding: 20px 20px;
  position: relative;
  .gopay {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  // text-align: center;
  .exe-name {
    margin-bottom: 10px;
    text-align: center;
    .name {
      font-weight: bold;
      b {
        color: red;
        font-size: 40px;
        vertical-align: sub;
      }
    }
    .customer {
      padding: 10px;
      color: #009688;
      position: relative;
      .headImg{
        display: block;
        margin: auto;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid #ddd;
        margin-bottom: 5px;
      }
      .vip{
        position: absolute;
        font-size: 25px;
        top: 47px;
        right: 95px;
        color: #8BC34A;
      }
    }
    .balance{
      padding: 10px;
      color: #FF9800;
      font-size: 17px;
      border-top: 1px solid #f1f1f1;
      text-align: right;
    }
  }
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  // text-align: center;
  display: flex;
}
body > .el-container {
  margin-bottom: 40px;
}
</style>
