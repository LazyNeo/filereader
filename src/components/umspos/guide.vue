<template>
  <div class="welcome-page pt-page-moveFromBottom">
    <div class="welcome">
      <h3 class="title">用户登录方式</h3>
      <div class="item">
        <div class="way">
          <h4>方式一.M6实体卡登录</h4>    
          <img src="" alt="">
        </div>
        <div class="way">
          <h4>方式二.M6支付码登录</h4>
          <div class="step">
            <h5>步骤1：关注公众号；</h5>
            <h5>步骤2：点击菜单栏 m6卡 -> 卡支付；</h5>
            <h5>步骤3：将二维码放置到扫描口</h5>
          </div>   
        </div>
      </div>
      <div class="item">
        
      </div>
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
      this.$router.push({name: 'umsposHome'})
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
        margin-bottom: 30px;
      }
      .item{
        display: inline-block;
        // display: flex;
        // align-items: center;
        // flex-direction:column;
      }
      .way{
        padding: 10px;
        // display: inline-block;
        text-align: left;
        h4{
          padding: 10px 0;
          color: #009688;
          font-size: 25px;
        }
        .step{
          h5{
            font-size: 20px;
            padding: 10px;
            font-weight: normal;
          }
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
