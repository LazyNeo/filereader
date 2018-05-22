<template lang="html">
  <div class="img-wrapper" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" >
    <img :style="imgStyle" :src="url + '?x-oss-process=image/resize,h_1000'" alt="" @click="hide">
    <p v-show="showLink" class="link-text" @click="doCallback">点击此处查看详情或购买</p>
    <upload v-if="showChange" path="img/" @uploaded="uploaded" class="upload-item"></upload>
  </div>
</template>

<script>
import upload from 'plugin/imgUploader'

export default {
  data () {
    return {
      width: 80,
      left: 0,
      top: 0,
      initLength: 0,
      initPosition: {
        pageX: 0,
        pageY: 0
      }
    }
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    showChange: {
      type: Boolean,
      default: false
    },
    showLink: {
      type: Boolean,
      default: false
    },
    resize: {
      type: Boolean,
      default: false
    },
    callback: {
      type: Function,
      default () {
      }
    }
  },
  methods: {
    uploaded (filename) {
      this.$emit('change', filename)
    },
    hide () {
      this.$emit('hide')
    },
    doCallback () {
      if (this.callback) {
        this.callback.call(window)
      }
    },
    touchstart (e) {
      if (!this.resize) return
      if (e.targetTouches.length === 1) {
        this.initPosition = {
          pageX: e.targetTouches[0].pageX,
          pageY: e.targetTouches[0].pageY
        }
      } else {
        let diffx = e.targetTouches[0].pageX - e.targetTouches[1].pageX
        let diffy = e.targetTouches[0].pageY - e.targetTouches[1].pageY
        this.initLength = diffx * diffx + diffy * diffy
      }
    },
    touchmove (e) {
      e.preventDefault();
      e.stopPropagation()
      if (!this.resize) return
      if (e.targetTouches.length === 1) {
        let diffx = e.targetTouches[0].pageX - this.initPosition.pageX
        let diffy = e.targetTouches[0].pageY - this.initPosition.pageY
        this.left += diffx / 3
        this.top += diffy / 6
        this.initPosition = {
          pageX: e.targetTouches[0].pageX,
          pageY: e.targetTouches[0].pageY
        }
      } else {
        let diffx = e.targetTouches[0].pageX - e.targetTouches[1].pageX
        let diffy = e.targetTouches[0].pageY - e.targetTouches[1].pageY
        let change = diffx * diffx + diffy * diffy
        let width = this.width
        width += (change - this.initLength) / 500
        if (width > 30 && width <= 200) {
          this.width = width
        }
        this.initLength = change
      }
    },
    touchend (e) {
    }
  },
  computed: {
    imgStyle () {
      return {
        width: this.width + '%',
        top: this.top + '%',
        left: this.left + '%'
      }
    }
  },
  components: {
    upload
  }
}
</script>

<style lang="less" scoped>
  .img-wrapper{
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000000;
    img {
      position: absolute;
      margin: auto;
      bottom: 0;
      right: 0;
    }
    .link-text{
      position: absolute;
      bottom: 15%;
      right: 10%;
      background-color: rgba(255, 255, 255, 0.6);
    }
    .upload-item{
      position: absolute;
      width: 20%;
      bottom: 0;
      left: 40%;
    }
  }
</style>
