<template>
  <audio ref="text_to_voice" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=22222" controls="controls">
    <!-- <source :src="'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=' + text" type="audio/mpeg"> -->
  </audio>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  methods: {
    playVoice () {
      if (!this.text) return
      console.info('播放语音', this.text)
      // ios 平台会播放失败
      this.$refs.text_to_voice.src = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=4&text=' + encodeURI(this.text)
      this.$refs.text_to_voice.load()
      this.$refs.text_to_voice.play()
    }
  },
  watch: {
    text (val) {
      if (val) {
        this.playVoice()
      }
    }
  },
  mounted () {
    this.playVoice()
  }
}
</script>

