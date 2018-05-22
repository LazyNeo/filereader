<template lang="html">
  <div>
    <div class="sync">
      <div class="update">
        <span >
          {{env=='center' ? '自动刷新倒计时' : '自动打印倒计时'}}：<em class="error-text">{{getSyncNums.leftTime}}</em>
        </span><br>
        <span v-if="env=='store'" class="left-time">门店模式下不需要刷新订单，如有需要，请点击手动刷新</span><br>
        <el-button type="primary" size="small" @click="gotoNextUpdate" :disabled="getSyncNums.orderClick">{{getSyncNums.orderClick ? '刷新中' : '手动刷新'}}</el-button>
        <el-button v-if="env=='store'" type="primary" size="small" @click="getPrintList" :disabled="getSyncNums.printClick">{{getSyncNums.printClick ? '打印中' : '手动打印'}}</el-button>
      </div>
      <div class="info">
        <h3><b>第一次更新时间：</b>{{getSyncNums.firstUpdateTime}}</h3>
        <h3><b>更新次数：</b>{{getSyncNums.updateNum}}</h3>
        <h3><b>上次更新订单数量：</b>{{getSyncNums.updateOrderNum}}</h3>
        <h3><b>今日更新订单数量：</b>{{getSyncNums.todayOrderNum}}</h3>
      </div>
      <div class="log">
        <el-table
          :data="getSyncMsgList"
          style="width: 100%">
          <el-table-column
            prop="time"
            label="时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="num"
            label="日志内容">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      env: 'center',
      today: (new Date()).Format('yyyy/MM/dd')
    }
  },
  methods: {
    gotoNextUpdate () {
      this.getSyncNums.gotoNextUpdate('orderClick')
    },
    getPrintList () {
      this.getSyncNums.gotoNextUpdate('printClick')
    }
  },
  created () {
    this.env = localConfig.env
  },
  computed: {
    ...mapGetters([
      'getSyncMsgList',
      'getSyncNums'
    ])
  },
  watch: {
    getSyncMsgList (val) {
    },
    getSyncNums (val) {
    }
  }
}
</script>

<style lang="less" scoped>
  .sync{
    padding: 20px;
    .update{
      margin-bottom: 30px;
      .left-time{
        margin-right: 30px;
      }
    }
    .info{
      h3{
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 10px;
      }
    }
  }
</style>
