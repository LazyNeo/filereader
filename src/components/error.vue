<template lang="html">
  <div class="error-page">
    <img :src="imgSrc" alt="错误了哦" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgSrc: ''
    }
  },
  created () {
    this.imgSrc = 'http://m6fresh.img-cn-shanghai.aliyuncs.com/img/errorerror_page' + Math.ceil(Math.random() * 5) + '.png'
  }
}
</script>

<style lang="less" scoped>
  .error-page{
    img{
      width: 100%;
    }
  }
</style>
