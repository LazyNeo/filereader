<template>
  <div>
    <div class="alert-pop">
      <div class="pop-box">
        <div class="pop-title">提示</div>
        <div class="pop-content">{{getAlertShow.msg}}</div>
        <div class="pop-btn">
          <button class="ok" type="button" name="button" @click="close">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      timer: null
    }
  },
  computed: mapGetters([
    'getAlertShow'
  ]),
  methods: {
    ...mapActions([
      'updateAlertShow' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    close () {
      clearInterval(this.timer)
      let alertConfig = this.getAlertShow
      if(alertConfig.callback)alertConfig.callback()
      alertConfig.show = false
      this.updateAlertShow(alertConfig)
    }
  },
  watch: {
    // 监听alert的配置变化,
    getAlertShow (newValue, oldValue) {
      if (newValue.show != oldValue.show) {
        if (!(newValue.period < 0)) {
          this.timer = setTimeout(() => {
            this.close()
          },newValue.period || 2000)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .alert-pop{
    width: 85%;
    position: fixed;
    border: 1px solid #E4E4E8;
    border-radius: 6px;
    top: 40%;
    margin: 0 auto;
    text-align: center;
    left: 7.5%;
    background-color: #FAFAFC;
    z-index: 10000;
    .pop-box{
      .pop-title{
        padding: .6rem 0;
        font-size: .8rem;
        color: #333;
      }
      .pop-content{
        padding: 0 20px;
        font-size: .8rem;
        color: #888;
        word-wrap: break-word;
        word-break: break-all;
        text-align: left;
      }
      .pop-btn{
        width: 100%;
        margin-top: 15px;
        position: relative;
        &:after {
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 1px;
          border-top: 1px solid #D5D5D6;
          color: #D5D5D6;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
        button{
          background-color: #FAFAFC;
          width: 100%;
          height: 42px;
          line-height: 42px;
          color: #0BB20C;
          font-size: .8rem;
          border: 0;
          padding: 0;
        }
      }
    }

  }
</style>
