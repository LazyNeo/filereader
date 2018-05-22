<template lang="html">
  <div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed: mapGetters([
    'getLoading'
  ]),
  data () {
    return {
      loading: null
    }
  },
  watch: {
    getLoading (newVal, oldVal) {
      if (newVal) {
        this.loading = this.$loading({
          lock: true,
          text: '请求中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      } else {
        this.loading.close()
        this.loading = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
