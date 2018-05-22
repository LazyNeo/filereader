<template lang="html">
  <div class="">
    <div class="head-img">
      <img :src="himgSrc" alt="" />
    </div>
    <h3>该模块已迁移，请移步企业微信进行查看！</h3>
    <div class="foot-img">
      <img :src="fimgSrc" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      himgSrc: 'http://m6fresh.img-cn-shanghai.aliyuncs.com/img/hintImg-7e7af771b5ec4b52267440423214bb6b.png?x-oss-process=image/resize,w_600',
      fimgSrc: 'http://m6fresh.img-cn-shanghai.aliyuncs.com/img/driveAway-c2d4072d32982de5336cd75b7a656eb7.png?x-oss-process=image/resize,w_600'
    }
  }
}
</script>

<style lang="less" scoped>
  .head-img{
    width: 100%;
    text-align: center;
    margin-top: 80px;
    margin-bottom: 40px;
  }
  .foot-img{
    width: 100%;
    text-align: right;
  }
  h3{
    padding: 50px 30px;
    text-align: center;
    font-size: 20px;
  }
  img{
    width: 200px;
  }
</style>
