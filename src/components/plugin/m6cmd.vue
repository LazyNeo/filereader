<template>
  <el-input :class="{'hidden-cmd': hidden}" placeholder="请录入" v-model="inputData" @keyup.13.native="submitTest" @keyup.native="keyup" ref="pos_cmd_input">
  </el-input>
</template>


<script>
import {m6Get} from 'api/ajax'
export default {
  data () {
    return {
      timer: null,
      handlerTimmer: null,
      inputData: ''
    }
  },
  props: {
    hidden: {
      type: Boolean,
      default: false
    },
    inputCallback: {
      type: Function,
      dafault () {
      }
    }
  },
  methods: {
    submitTest () {
      this.parentHandler(this.inputData)
    },
    getFocus () {
      this.timer = setInterval(() => {
        if (this.$refs.pos_cmd_input) {
          this.$refs.pos_cmd_input.focus()
        } else {
          console.warn('m6cmd input丢失')
        }
      }, 1000)
    },
    parentHandler (newVal) {
      if (!newVal) return
      if (this.inputCallback) {
        this.inputCallback()
      }
      this.inputData = ''
      if (newVal.length === 10 && newVal.startsWith('00')) {
        // 识别到卡
        this.$emit('cardhandler', newVal)
        return
      }
      if (newVal.length === 11 && newVal.startsWith('E')) {
        // 识别到卡
        this.$emit('weixincardhandler', newVal)
        return
      }
      if (newVal.length === 13) {
        // 识别到商品
        this.$emit('goodhandler', newVal)
        return
      }
      if (!M6Config.ifDev) return
      this.$emit('addProduct', {plu: newVal, weight: Math.floor(1 + Math.random() * 5)})
    },
    keyup (e) {
      this.$emit('m6keyup', e)
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
  },
  watch: {
    inputData (newVal, old) {
      this.lastEditTime = Date.now()
      window.lastOprateTime = Date.now()
      if (this.handlerTimmer) {
        clearTimeout(this.handlerTimmer)
        this.handlerTimmer = null
      }
      this.handlerTimmer = setTimeout(() => {
        this.parentHandler(newVal)
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.hidden-cmd{
  position: fixed;
  left: -100000px;
}
</style>

