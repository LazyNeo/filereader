<template>
  <div class="init-style">
    <el-container class="pos-container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-container>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return {
      count: 0,
      outTime: 0.2,
      timer: null
    }
  },
  methods: {
    ...mapActions([
      'updateGlobalJob'
    ])
  },
  created () {
    let ratio = 60
    setInterval(() => {
      if (this.$route.name === 'umsposWelcome' || this.$route.name === 'umsposLog') {
        return
      }
      if (Date.now() - window.lastOprateTime > 15 * 1000 * ratio) {
        // 15分钟没有操作记录，导向欢迎页
        console.info('您因长时间未进行操作返回首页')
        this.updateGlobalJob({
          from: 'umsposWelcome',
          data: {
            user: true,
            good: true
          }
        })
        this.$router.replace({name: 'umsposWelcome'})
      }
    }, 1000 * ratio)
    document.body.onclick = () => {
      // 标记最后一次操作时间
      // 变量挂载在window下面便于跨页面记录
      window.lastOprateTime = Date.now()
    }
  }
}
</script>

<style lang="less" scoped>
.init-style {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
}
.pos-container{
  padding-top: 47px;
  background-color: #E9EEF3;
  height:100%;
}
</style>

