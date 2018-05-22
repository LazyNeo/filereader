<template lang="html">
  <div>
    <div class="uploading-div">
      <div class="layer"></div>
      <p>{{msg}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '上传中'
    }
  },
  created () {
    let index = 0
    setInterval(() => {
      if (index % 6 === 0) {
        this.msg = '上传中.'
      } else if (index % 6 === 1) {
        this.msg = '上传中..'
      } else if (index % 6 === 2) {
        this.msg = '上传中...'
      } else if (index % 6 === 3) {
        this.msg = '上传中....'
      } else if (index % 6 === 4) {
        this.msg = '上传中.....'
      } else if (index % 6 === 5) {
        this.msg = '上传中......'
      }
      index++
    }, 200)
  }
}
</script>

<style lang="less" scoped>
  .uploading-div{
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    z-index: 1000;
    .layer{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0,0,0,0.8);
    }
    p{
      position: absolute;
      color: white;
      font-size: 2rem;
      width: 100%;
      text-align: center;
      top: 50%;
    }
  }
</style>
