<template>
  <div id="app" class="app-style">
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <!-- <keep-alive> -->
    <m6nav></m6nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- </keep-alive> -->
    <loading></loading>
  </div>
</template>

<script>
import loading from './components/plugin/loading'
import m6nav from './components/base/nav'
export default {
  name: 'index',
  data () {
    return {
      umsposFunc: true, // 是否具有无人门店功能
      initY: 0,
      timmer: null
    }
  },
  methods: {
  },
  components: {
    m6nav,
    loading
  },
  mounted () {
    this.umsposFunc = localConfig.comps.umspos
    this.$router.replace({name: localConfig.root})
  }
}
</script>
<style lang="less" scoped>
  .app-style{
    height: 100vh;
  }
</style>
<style lang="less">
  @import "./assets/css/wbindexbak.css";
  @import "./assets/css/common.less";
  @import "./assets/css/animation.less";
  body{
    position: initial !important;
  }
  .modal{
    display: block;
    overflow-y: scroll;
  }
  /*隐藏未编译的 Mustache 标签直到实例准备完毕*/
  [v-cloak] {
    display: none;
  }
  .error-text{
    color: red;
  }
  .chevron-left:after, .chevron-left:before {
    border: 10px solid transparent;
    border-right: 10px solid #537FFE;
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: -20px;
    content: ' '
  }

  .chevron-left {
    position: relative;
    float: left;
    /*padding: 10px 10px;*/
    left: 30px;
    top: 15px;
  }

  .chevron-left:before {
    border-right-color: #fff;
    left: -24px;
  }
</style>
