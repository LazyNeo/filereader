<template>
  <div>
    <div class="prompt-pop">
      <div class="pop-box" :class="{'has-error': error.show}">
        <div class="pop-title">{{getPromptShow.msg}}</div>
        <div v-show="error.show" class="pop-content error">{{error.msg}}</div>
        <div v-if="getPromptShow.type == 'email'" class="input-group" >
          <input class="form-control" v-model='userInput'>
          <span class="input-group-addon">@m6fresh.com</span>
        </div>
        <input v-else class="form-control" v-model='userInput'>
        <div class="pop-btn">
          <button class="cancel" type="button" name="button" @click="cancel">取消</button>
          <button class="ok" type="button" name="button" @click="confirmOk">确定</button>
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
      userInput: '',
      error: {
        show: false,
        msg: '输入内容不能为空'
      }
    }
  },
  computed: mapGetters([
    'getPromptShow'
  ]),
  methods: {
    ...mapActions([
      'updatePromptShow' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    confirmOk () {
      if (!this.userInput) {
        this.error.show = true
        return
      }
      let promptConfig = this.getPromptShow
      if(promptConfig.okCallback)promptConfig.okCallback(this.userInput)
      promptConfig.show = false
      this.updatePromptShow(promptConfig)
    },
    cancel () {
      let promptConfig = this.getPromptShow
      if(promptConfig.cancelCallback)promptConfig.cancelCallback()
      promptConfig.show = false
      this.updatePromptShow(promptConfig)
    }
  },
  watch: {
    userInput () {
      this.error.show = false
    },
    // // 监听confirm的配置变化,
    getPromptShow (newValue, oldValue) {
      if (newValue.show != oldValue.show) {
        // setTimeout(() => {
        //   this.cancel()
        // },newValue.period || 2000)
        this.userInput = newValue.defaultInput
      }
    }
  }
}
</script>

<style lang="less" scoped>
.prompt-pop{
  width: 85%;
  position: fixed;
  border: 1px solid #E4E4E8;
  border-radius: 6px;
  top: 40%;
  margin: 0 auto;
  left: 7.5%;
  background-color: #FAFAFC;
  z-index: 10000;
  .pop-box{
    .pop-title{
      padding: .6rem 0;
      font-size: .8rem;
      color: #333;
      text-align: center;
    }
    .pop-content{
      padding: 0 20px;
      font-size: .8rem;
      color: #888;
      word-wrap: break-word;
      word-break: break-all;
      text-align: left;
      &.error {
        color: #a94442;
      }
    }
    .pop-btn{
      width: 100%;
      margin-top: 15px;
      position: relative;
      // border-top: 1px solid ##E4E4E8;
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
        width: 49%;
        height: 42px;
        line-height: 42px;
        color: #444;
        font-size: .8rem;
        border: 0;
        padding: 0;
      }
      button.ok{
	      color: #0BB20C;
      }
      button.cancel{
	      position: relative;
        &:after {
          content: " ";
          position: absolute;
          right: -1px;
          top: 0;
          width: 1px;
          height: 100%;
          border-left: 1px solid #D5D5D6;
          color: #D5D5D6;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
      }

    }
  }

}
</style>
