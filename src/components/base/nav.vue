<template>
  <div class="app-control noprint">
    <el-tooltip content="后退" placement="bottom">
      <i class="iconfont left" @click="back">&#xe614;</i>
    </el-tooltip>
    <el-tooltip content="刷新" placement="bottom">
      <i class="iconfont left" @click="refresh">&#xe604;</i>
    </el-tooltip>
    <el-tooltip content="配置" placement="bottom">
      <i class="iconfont right" @click="setConfig">&#xe63e;</i>
    </el-tooltip>
    <check-update v-if="updateShow" @hide="hideCheck"></check-update>
  </div>
</template>

<script>
import checkUpdate from '@/components/base/checkUpdate'
export default {
  data () {
    return {
      canBack: false, // 是否有上一页可返回
      updateShow: true
    }
  },
  methods: {
    back () {
      if (this.$route.name !== 'umsposWelcome') {
        console.info('首页不再返回！')
        this.$router.go(-1)
      }
    },
    hideCheck () {
      this.updateShow = false
    },
    setConfig () {
      this.$router.push({name: 'setHome'})
    },
    refresh () {
      chrome.runtime.reload()
    }
  },
  created () {
    this.updateShow = !localConfig.autoUpdate
  },
  components: {
    checkUpdate
  }
}
</script>

<style lang="less" scoped>
  .app-control {
    height: 47px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    background: #f1f1f1;
    padding: 8px 15px;
    position: relative;
    .m6icon {
      padding: .2em;
      margin: 0 .2em;
      width: 1.4em;
      height: 1.4em;
    }
    .m6icon:hover{
      background: #fafafa;
    }
    .iconfont{
      padding: 5px;
      font-size: 18px;
      margin: 0 5px;
      cursor: pointer;
      border-radius: 5px;
    }
    .iconfont:hover{
      background: #fafafa;
    }
    .cannot-back{
      color: #bbb;
      cursor: default;
      &:hover{
        background: none;
      }
    }
  }
</style>
