<template lang="html">
  <div class="">
    <i v-for="i in num"class="iconfont">&#xe733;</i>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 3
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .iconfont
    font-size: 18px
    color: #d81e06
</style>
