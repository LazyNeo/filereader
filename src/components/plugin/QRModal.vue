<template>
  <div>
    <div class="modal" @click="close">
      <div class="modal-dialog">
        <div class="modal-content">
          <div id="QRCode_canvas"></div>
          <button id='clipboard_btn' type="button" name="button" class="btn btn-success" :data-clipboard-text="this.text">复制网址</button>
        </div>
      </div>
    </div>
    <!-- <div class="alert-pop">
      <div class="pop-box">
        <div id="QRCode_canvas"></div>
      </div>
    </div> -->
  </div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  props: {
    text: {
      default: '',
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  created () {
    window.CK.LoadJS('js_qrcode','http://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js').then(() => {
      $('#QRCode_canvas').qrcode({
        text : this.text,
        type : 'cn',
        width : 300,
        height : 300
      })
      let clipboard = new Clipboard('#clipboard_btn')
      let that = this
      clipboard.on('success', (e) => {
          window.M6.alert('网址已成功复制,请自行去黏贴')
      });
      clipboard.on('error', (e) => {
        window.M6.alert('网址复制失败,请长按下方文字复制\n' + that.text, -1)
      });
    })
  },
  watch: {
    text (newVal) {
      if (!newVal) return
    }
  }
}
</script>

<style lang="less" scoped>
  .modal{
    background: rgba(0,0,0,0.7);
    .modal-dialog{
      width: 100%;
      height: 100%;
      margin: 0;
      // margin: auto;
      display: flex;
      .modal-content{
        background: none;
        border-radius: .6rem;
        margin:auto;
        button{
          margin-left: 35%;
          background-color: green;
        }
      }
    }
  }
</style>
