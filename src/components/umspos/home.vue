<template>
  <el-container class="pt-page-moveFromBottom">
    <!-- 左侧 -->
    <el-container>
      <!-- 主体：表格区域 -->
      <el-main>
        <el-table class="pos-table" :data="computedTableData" border>
          <el-table-column fixed label="序号" type="index" width="100"> </el-table-column>
          <el-table-column prop="plu" label="条码/编号" width="120"> </el-table-column>
          <el-table-column prop="des" label="商品描述" min-width="200"> </el-table-column>
          <el-table-column prop="count" label="数量" width="100">
            <template slot-scope="scope">{{ scope.row.count | weight}}</template>
          </el-table-column>
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
              @click.native.prevent="deleteRow(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 底部：操作栏 -->
      <el-footer>
        <m6cmd :inputCallback="inputCallback" @cardhandler="cardInputHandler" @goodhandler="goodInputHandler" @weixincardhandler="weixincardhandler" @addProduct="addProduct"></m6cmd>
        <el-button v-if="tableData.length<=0" disabled class="gopay" type="primary" @click="pay">去支付</el-button>
        <el-button v-else class="gopay" type="primary" @click="pay">去支付</el-button>
      </el-footer>
    </el-container>
    <!-- 右侧 -->
    <el-aside width="300px">
      <el-card class="box-card exe-name">
        <div slot="header" class="clearfix">
          <span class="name"> <b>M6</b> 无人店</span>
        </div>
        <div v-if="getUserInfo.user_name" class="customer">
          <img class="headImg" v-if="getUserInfo.headimgurl" :src="getUserInfo.headimgurl" alt="用户头像">
          <img class="headImg" v-else-if="getUserInfo.file_path" :src="'http://' + host + ':8097/' + getUserInfo.file_path" alt="用户头像">
          <img class="headImg" v-else src="../../assets/img/headImg.jpg" alt="用户头像">
          {{getUserInfo.user_name}}({{getUserInfo.card_no}})
          <i v-if="getUserInfo.class === 'V'" class="iconfont vip">&#xe688;</i>
        </div>
        <div v-else class="customer">
          亲爱的M6用户
        </div>
        <div v-if="getUserInfo.user_name" class="balance">
          <span>卡余额：￥{{getUserInfo.balance}}</span>
          <el-button type="danger" class="quit-user" @click="quitUser">退出登录</el-button>          
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
          <h3 v-if="getUserInfo.class === 'V'" class="item discount">vip折让：<b>{{statistic.discount|money}}</b> 元</h3>
          <h3 v-else class="item discount">用卡折让：<b>{{statistic.discount|money}}</b> 元</h3>
          <hr>
          <h3 class="item need-pay">结算金额：<b>{{statistic.needPay |money}}</b> 元</h3>
        </div>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
import { m6Get } from 'api/ajax'
import m6cmd from 'plugin/m6cmd'
import nw from 'nw.gui'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      tableData: [],
      tableData2: [],
      tableData3: [],
      cardId: '0001143660',
      host: '',
      inputData: '',
      lastEditTime: Date.now(),
      handlerTimmer: null,
      timer: null
    }
  },
  methods: {
    ...mapActions([
      'updateCartInfo',
      'updateUserInfo'
    ]),
    quitUser () {
      this.updateUserInfo({})
    },
    inputCallback () {
      if (this.$route.name !== 'umsposHome') {
        this.$router.push({name: 'umsposHome'})
      }
    },
    getUserInfoFunc ({cardId, nickname, headimgurl}) {
      if (this.getUserInfo.card_id === cardId) {
        // 该卡号已读取
        console.info('该卡号已读取')
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
        if (this.getUserInfo.card_id) {
          m6Get('unlockCard', {card_id: this.getUserInfo.card_id, store: this.getUserInfo.store})
        }
        if (nickname) {
          res.data.user_name = nickname
        }
        if (headimgurl) {
          res.data.headimgurl = headimgurl
        } else {
          // 没有头像信息，去后台获取
          m6Get('getUserFaceInfo', {client_id: res.data.client_id}).then(r => {
            if (r.code === 0 && r.data.file_path) {
              res.data.file_path = r.data.file_path
              this.updateUserInfo(res.data)
            }
          })
        }
        this.updateUserInfo(res.data)
      })
    },
    deleteRow (index) {
      this.tableData.splice(index, 1)
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
        if (res.data.unit && res.data.unit.toUpperCase() === 'KG') {
          res.data.count = weight / 1000 // 称重数量
        } else {
          res.data.count = weight // 数量
        }
        this.tableData.push(res.data)
      })
    },
    pay () {
      if (JSON.stringify(this.getUserInfo) === '{}') {
        window.M6.alert('您还未刷卡登陆哦~', -1, () => {})
        return
      }
      if (this.statistic.needPay > this.getUserInfo.balance) {
        window.M6.alert('您的卡余额不足', {
          type: 'error',
          period: -1
        })
        return
      }
      let cartInfo = {list: {}}
      for (let g of this.computedTableData) {
        if (cartInfo.list[g.plu]) {
          // 已添加商品，加数量
          cartInfo.list[g.plu].count += g.count
          cartInfo.list[g.plu].act_price += g.act_price
        } else {
          cartInfo.list[g.plu] = g
        }
      }
      cartInfo = Object.assign(cartInfo, this.statistic)
      this.updateCartInfo(cartInfo)
      this.$router.push({
        name: 'umsposPay',
        params: { statistic: JSON.stringify(this.statistic) }
      })
    },
    goodInputHandler (val) {
      if (val.startsWith('20')) {
        let plu = Number(val.substr(3, 4))
        let weight = Number(val.substr(7, 5))
        this.addProduct({plu, weight})
        return
      }
      this.addProduct({code: val, weight: 1})
    },
    cardInputHandler (cardId) {
      this.getUserInfoFunc({cardId})
    },
    weixincardhandler (code) {
      m6Get('getUserInfoByWeixinCode', {code: code}).then(res => {
        if (res.code !== 0) {
          M6.alert(res.msg)
          return
        }
        this.getUserInfoFunc({cardId: res.data.card_id, nickname: res.data.nickname, headimgurl: res.data.headimgurl})
      })
    }
  },
  computed: {
    computedTableData () {
      let computedTableData = CK.deepCopy(this.tableData)
      // 判断用户类型，是否v卡、卡
      for (let item of computedTableData) {
        item.weight = item.item_weight * item.count
        if (!this.getUserInfo.card_id) {
          item.act_price = item.price * item.count
        } else if (this.getUserInfo.class === 'V') {
          item.act_price = item.p_price * item.count
        } else {
          item.act_price = item.card_price * item.count
        }
        item.discount = (item.price * item.count).toFixed(2) - item.act_price.toFixed(2)
      }
      return computedTableData
    },
    statistic () {
      let statistic = {
        totalPrice: 0,
        needPay: 0,
        discount: 0,
        totalWeight: 0,
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
        statistic.totalWeight += item.weight
        statistic.needPay += item.act_price
      }
      statistic.discount = statistic.totalPrice.toFixed(2) - statistic.needPay.toFixed(2)
      // statistic.discount = Number(
      //   statistic.totalPrice - statistic.needPay
      // ).toFixed(2)
      statistic.num = this.computedTableData.length
      statistic.kind = kind
      return statistic
    },
    ...mapGetters([
      'getUserInfo',
      'getGlobalJob'
    ])
  },
  components: {
    m6cmd
  },
  watch: {
    getGlobalJob (val) {
      if (!val) {
        return
      }
      if (val.from !== 'umsposPayResult' && val.from !== 'umsposWelcome') {
        return
      }
      if (val.data.user) {
        // 需要清空用户信息
        this.updateUserInfo({})
      }
      if (val.data.good) {
        // 需要清空商品信息
        this.tableData = []
      }
    }
  },
  created () {
    this.host = localConfig.host
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
    .balance{
      padding: 10px;
      color: #FF9800;
      font-size: 17px;
      border-top: 1px solid #f1f1f1;
      text-align: left;
      .quit-user{
        position: relative;
        right: -25px;
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
  }
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  // text-align: center;
  display: flex;
  .pos-table{
    width: 100%;
    height:100%;
  }
}
body > .el-container {
  margin-bottom: 40px;
}
</style>
