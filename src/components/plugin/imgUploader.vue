<template lang="html">
  <div class="upload-input" v-bind:style="initSize">
    <i>+</i>
    <input type="file" id="upload-input-file" @change="upload" v-bind:style="initMarginTop"/>
  </div>
</template>

<script>
  import {m6Get} from 'api/ajax'
  import md5 from 'blueimp-md5'
  export default {
    data () {
      return {
        client: {},
        timer: null
      }
    },
    props: {
      path: {
        type: String,
        default: 'm6shake/'
      },
      nameMode: {
        type: String,
        default: '1'
      },
      ifPrefex: {
        type: Boolean,
        default: false
      },
      profex: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      size: {
        type: Number,
        default: 70
      }
    },
    mounted () {
      this.client = new OSS.Wrapper({
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAI10BhRo3Me3Y3',
        accessKeySecret: 'rMdTzbCmJCXOSMUexGsHG24v6rGljJ',
        bucket: 'm6fresh'
      })
    },
    methods: {
      clearTimer () {
        clearInterval(this.timer)
        this.timer = null
        window.M6.updateUploading(false)
      },
      upload (e) {
        let file = e.target.files[0];
        let storeAs = ''
        if (this.nameMode == 2) {
          storeAs = this.path + file.name
        } else if (this.nameMode == 3 && this.name.trim()) {
          storeAs = this.path + this.name + this.get_suffix(file.name)
        } else {
          let token = file.name + file.lastModifiedDate + file.size + file.type
	        storeAs = this.path + md5(token) + this.get_suffix(file.name)
        }
        console.info(file.name + ' => ' + storeAs)
        window.M6.updateUploading(true)
        this.timer = setTimeout(() => {
          window.M6.alert('上传超时,请检查网络连接是否正常!')
          this.clearTimer()
        }, 30000)
        this.client.multipartUpload(storeAs, file).then((result) => {
          this.submitToM6(storeAs)
          this.clearTimer()
        }).catch((err) => {
          window.M6.alert('上传时发生错误,请检查网络连接是否正常!')
          this.clearTimer()
        });
      },
      submitToM6 (filename) {
        let data = {
          u_id: Vue.CK.getCookie('u_id') || 1,
          token: filename
        }
        m6Get('insertImgInfo', data).then((res) => {
          if (res.code != 0) {
            window.alert(res.msg)
            return
          }
          this.$emit('uploaded', filename, res.data)
        })
      },
      random_string (len) {
        len = len || 32
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        var maxPos = chars.length
        var pwd = ''
        for (var i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
      },
      get_suffix (filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos != -1) {
          suffix = filename.substring(pos)
        }
        return suffix;
      }
    },
    computed: {
      initSize () {
        let style = {
          width: this.size + 'px',
          height: this.size + 'px',
          lineHeight: this.size - 4 + 'px'
        }
        return style
      },
      initMarginTop () {
        let style = {
          marginTop: -(this.size - 4) + 'px'
        }
        return style
      }
    }
  }
</script>

<style lang="less" scoped>
  .upload-input {
    text-align: center;
    width: 70px;
    height: 70px;
    border-radius: 5px;
    border: 2px dashed #aaaaaa;
    line-height: 66px;
    i{
      font-style: normal;
      font-size: 36px;
      color: #aaaaaa;
      display: block;
    }
    input {
      width: 100%;
      height: 100%;
      margin-top: -66px;
      opacity: 0;
    }
  }
</style>
