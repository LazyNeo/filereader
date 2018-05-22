<template lang="html">
  <div ref="printer_wrapper" :style="printContainer">
    <div :style="[printTitle, fullStyle]">
        <label>{{invoice.number}}#拣货单</label><br/>
        <label>M6生鲜,我土哦到家</label>
    </div>
    <div :style="[storeInfo, fullStyle]">
        <label>{{invoice.store_name}}:【{{invoice.store_code}}】</label>
    </div>
    <div :style="barcodeStyle">
      <barcode v-if="invoice.order_id" :value="invoice.order_id" tag="img" :options="{ displayValue: true , width: 1.5,height:70, fontSize: '12px',}"></barcode>
    </div>
    <div>
        <label :style="fs12px">预计送达:{{invoice.delivery_time}}</label><br/>
        <label :style="fs12px">成交时间:{{invoice.create_time}}</label><br/>
        <label :style="fs12px">打印时间:{{print_time}} 第1次打印</label><br/>
    </div>
    <div style="border: 1px #333 dashed;">
      <p style="font-weight:bold;font-size:14px;">客户备注:</p>
      <p :style="userMsgWrapper" v-for="(item, index) of invoice.user_msg_list" :key="index">{{item}}</p>
    </div>
    <div style="font-size: 10px;color: black;">
      <table style="width:100%;color: black">
        <thead>
          <tr>
            <td :style="tdStyle" width="6%">ID</td>
            <td :style="tdStyle" width="45%">商品号&nbsp&nbsp商品描述</td>
            <td :style="tdStyle" width="14%">价格</td>
            <td :style="tdStyle" width="10%">数量</td>
            <td :style="tdStyle" width="14%">金额</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) of invoice.gList" :key="index" style="height: 24px;color: black;">
            <td :style="tdStyle" >{{index + 1}}</td>
            <td v-if="item.item_storage > 0":style="tdStyle" >{{item.name}}</td>
            <td v-else :style="tdStyle" >{{item.name}}<br>PLU{{item.plu}}</td>
            <td :style="tdStyle" >{{item.price | money}}</td>
            <td :style="tdStyle" >{{item.qty}}</td>
            <td :style="tdStyle" >{{item.qty * item.price | money}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="font-size: 12px!important;color: black;font-weight:bold;">
      <table style="width:100%;">
        <thead>
          <tr>
            <td v-if="invoice.gList" width="50%" :style="tdStyle" >商品件数: {{invoice.gList.length}}</td>
            <td width="50%" :style="tdStyle" >包装费用:{{invoice.package_fee|money}}</td><br/>
          </tr>
          <tr style="margin-top:0;">
              <td width="50%" :style="tdStyle" >商品金额: {{totalPrice|money}}</td>
              <td width="50%" :style="tdStyle" >运费金额:{{invoice.freight|money}}</td>
            </tr>
        </thead>
      </table>
    </div>
    <div :style="orderPickerStyle">
      <label>M6拣货员:</label>
    </div>
  </div>
</template>

<script>
import nw from 'nw.gui'
import {m6Get, m6Post} from 'api/ajax'
import barcode from '@xkeshi/vue-barcode'
export default {
  data () {
    return {
      print_time: new Date().Format('yyyy-MM-dd hh:mm:ss'),
      invoice: {
      }
    }
  },
  props: {
    oid: {
      type: String,
      default: ''
    }
  },
  methods: {
    print () {
      if (localConfig.env === 'center') {
        M6.alert('中心运行环境中不执行打印操作')
        return
      }
      let win = nw.Window.get()
      win.getPrinters((res) => {
        if (!res || res.length === 0) {
          M6.alert('没有合适的打印机')
          this.$emit('doprint', {code: -1, msg: '没有合适的打印机'})
          return
        }
        for (let p of res) {
          if (p.printerName !== localConfig.printer) {
            continue
          }
          let html = this.$refs.printer_wrapper.innerHTML
          m6Post('m6print', {printer: p.printerName, content: html, order_id: this.oid}).then(res => {
            this.$emit('doprint', res)
            if (res.code !== 0) {
              M6.alert(res.msg)
              return
            }
          })
          return
        }
        this.$emit('doprint', {code: -1, msg: '没有合适的打印机'})
        M6.alert('没有合适的打印机')
      })
    },
    refreshInfo () {
      m6Get('getPickingList', {order_id: this.oid}).then(res => {
        if (res.code !== 0) {
          M6.alert(res.msg)
          return
        }
        if (!res.data || res.data.length === 0) {
          M6.alert('订单信息缺失')
          return
        }
        let gItem = res.data[0]
        gItem.user_msg = gItem.client_remark
        gItem.user_msg_list = []
        while (true) {
          if (gItem.user_msg && gItem.user_msg.length > 28) {
            gItem.user_msg_list.push(gItem.user_msg.substr(0, 28))
            gItem.user_msg = gItem.user_msg.substr(28)
          } else {
            gItem.user_msg_list.push(gItem.user_msg)
            break
          }
        }
        this.invoice = {
          store_code: gItem.store,
          store_name: gItem.store_des,
          order_id: gItem.order_id,
          number: gItem.number,
          user_msg: gItem.client_remark,
          user_msg_list: gItem.user_msg_list,
          delivery_time: gItem.dtime.replace('T', ' '),
          create_time: gItem.input_date.replace('T', ' '),
          package_fee: gItem.packaging,
          freight: gItem.freight
        }
        let glist = []
        for (let g of res.data) {
          glist.push({
            id: g.id,
            name: g.jddes,
            plu: g.plu,
            item_storage: g.item_storage,
            price: g.jdprice,
            unit: g.jdunit,
            qty: g.jdqty
          })
        }
        this.invoice.gList = glist
        this.print_time = new Date().Format('yyyy-MM-dd hh:mm:ss')
        this.$nextTick(() => {
          setTimeout(() => {
            this.print()
          }, 2000)
        })
      })
    }
  },
  computed: {
    totalPrice () {
      if (!this.invoice || !this.invoice.gList || this.invoice.gList.length === 0) {
        return 0
      }
      let sum = 0
      for (let g of this.invoice.gList) {
        sum += CK.mul(g.price, g.qty)
      }
      return sum
    },
    printContainer () {
      return {
        margin: '10px 30px 10px 0',
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif'
      }
    },
    fullStyle () {
      return {
        width: '100%'
      }
    },
    tdStyle () {
      return {
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif',
        fontSize: '14px',
        borderBottom: '1px dashed #333'
      }
    },
    printTitle () {
      return {
        'fontSize': '18px',
        'color': 'black',
        'textAlign': 'center',
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif',
        'height': '55px',
        'fontWeight': 'bold'
      }
    },
    storeInfo () {
      return {
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif',
        fontSize: '14px',
        color: 'black',
        textAlign: 'center',
        height: '12px',
        lineHeight: '100%',
        fontWeight: 'bold'
      }
    },
    barcodeStyle () {
      return {
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif',
        textAlign: 'center',
        fontSize: '8px'
      }
    },
    orderTimeStyle () {
      return {
      }
    },
    orderPickerStyle () {
      return {
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif',
        textAlign: 'left',
        fontSize: '15px',
        color: 'black',
        bottom: 0,
        left: 0
      }
    },
    fs8px () {
      return {
        fontSize: '8px'
      }
    },
    fs12px () {
      return {
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif',
        fontSize: '12px'
      }
    },
    userMsgWrapper () {
      return {
        fontFamily: '"微软雅黑","Microsoft YaHei","宋体",Arial,sans-serif',
        height: '80px',
        fontSize: '14px',
        color: 'black'
      }
    }
  },
  destroyed () {
  },
  components: {
    barcode
  }
}
</script>
