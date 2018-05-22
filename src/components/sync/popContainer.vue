<template lang="html">
  <div>
    <div v-if="!netWorking || syncFunc" class="sync-pop" @click="popClick" :style="posStyle">
      <div class="back-container" :class="{'not-work': !syncWork}">
        <span class="part" :style="leftPart"></span>
      </div>
      <i v-if="!netWorking" class="iconfont m6-error net-work">&#xe611;</i>
      <i v-else-if="syncWork" class="iconfont spin">&#xe6dd;</i>
      <i v-else class="iconfont m6-error">&#xeae5;</i>
      <popSync v-if="syncFunc" @change="changeSyncWork" ref="sync_comps"></popSync>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import popSync from '@/components/sync/popSync'
export default {
  data () {
    return {
      syncFunc: false, // 是否具有同步功能
      netWorking: false,
      syncWork: false,
      period: 1,
      pos: {
        b: 10,
        r: 10
      }
    }
  },
  methods: {
    goto (name) {
      this.$router.push({name})
    },
    changeSyncWork (flag) {
      this.syncWork = Boolean(flag)
    },
    popClick () {
      if (!this.netWorking) {
        M6.alert(`设置的pos后台为${localConfig.host},但是并没有开启，请稍等片刻，如十分钟后还未开启，请联系IT部门。`, {type: 'error', period: -1})
      } else if (this.syncWork) {
        this.goto('syncHome')
      } else {
        M6.alert(`同步功能开启时间为${localConfig.sync.startHours}:00至${localConfig.sync.endHours}:00,当前时间不工作`, {type: 'error'})
      }
    },
    init () {
      this.netWorking = localConfig.net_working
      this.syncFunc = localConfig.comps.sync
      // this.timer = setInterval(() => {
      //   this.getLeftTime()
      // }, 1000)
    }
  },
  created () {
    this.period = Number(localConfig.sync.period)
    if (localConfig.net_working) {
      this.timer = setInterval(this.init, 1000)
    } else {
      CK.setCallBack('net_working', this.init)
    }
  },
  computed: {
    ...mapGetters([
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
    popSync
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
