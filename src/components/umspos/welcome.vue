<template>
  <div class="welcome-page pt-page-moveFromBottom">
    <div class="welcome">
      <h3 class="title">欢迎使用</h3>
      <h3 class="name">
        <span class="m6font-e">M6</span>
        <b> 扫码购</b>
      </h3>
    </div>
    <div class="next">
      <el-button round @click="next">去结算</el-button>
      <i class="iconfont">&#xe613;</i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    next () {
      this.$router.push({name: 'umsposGuide'})
    }
  }
}
</script>

<style lang="less" scoped>
  .welcome-page{
    width: 100%;
    .welcome{
      width: 100%;
      text-align: center;
      margin-top: 10%;
      .title{
        font-size: 30px;
        font-weight: normal;
        color: #607D8B;
      }
      .name{
        margin-top: 40px;
        span{
          font-weight: bold;
          color: red;
          font-size: 100px;
        }
        b{
          font-size: 40px;
          font-weight: bold;
          vertical-align: super;
        }
      }
    }
    .next{
      position: absolute;
      width: 100%;
      bottom: 20%;
      text-align: center;
      .el-button.is-round {
        border-radius: 15px;
        padding: 20px 50px;
        border: 1px solid #03A9F4;
        color: #03A9F4;
        font-size: 20px;
        // background: transparent;
      }
      .iconfont{
        display: block;
        margin-top: 20px;
        font-size: 35px;
        color: #03A9F4;
      }
    }
  }
</style>
