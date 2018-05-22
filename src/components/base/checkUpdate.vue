<template>
  <div class="noprint alert-msg">
    <el-alert title="" :closable="false" type="warning">
      <div>
        <span>当前版本:{{currentVersion}}，有最新版本{{info.version}}可更新</span>
        <span v-if="!saveAsName">,但是暂无当前系统匹配的版本</span>
        <el-button size="mini" type="primary" round v-if="progress < 100" :disabled="progress >= 0" @click="showFileDialog">更新</el-button>
        <input type="file" class="hidden" ref="fileInput" :nwsaveas="saveAsName" @change="startDownload">
        <span v-if="progress === -2">下载失败</span>
        <span v-if="progress >= 0">下载中:</span>
        <el-progress v-if="progress >= 0" class="progress-bar" :percentage="progress"></el-progress>
      </div>
    </el-alert>
  </div>
</template>

<script>
  import { getUpdateJson, downloadHandle, unzip } from '@/utils/update'
  import { Shell, App } from 'nw.gui'

  export default {
    name: 'checkUpdate',
    data () {
      return {
        info: {},
        needUpdate: false,
        currentVersion: '',
        progress: -1 // init: -1, error: -2
      }
    },
    computed: {
      saveAsName () {
        return `m6pos-${this.info.version}.exe`
      }
    },
    methods: {
      showFileDialog (ev) {
        this.$refs.fileInput.click()
      },
      unzipFunc () {
        unzip(M6Config.filePath + 'win64.tgz')
      },
      startDownload (ev) {
        const targetPath = ev.target.value
        // reset
        ev.target.value = ''
        if (!targetPath.trim()) return

        this.progress = 0
        const file = downloadHandle(targetPath, this.info)

        file.on('data', num => { this.progress = Math.ceil(num * 100) })
        file.on('error', () => { this.progress = -2 })

        file.on('end', filePath => {
          this.progress = this.progress < 0 ? this.progress : 100
          m6Get('closePYService')
          // open install file
          setTimeout(() => Shell.openExternal(filePath), 100)
        })
      }
    },
    mounted () {
      this.currentVersion = App.manifest.version
      getUpdateJson().catch(err => { console.error(err) }).then(json => {
        this.info = json
        console.info('version', json.version, App.manifest.version)
        let newVersion = json.version.split('.')
        let currentVersion = App.manifest.version.split('.')
        for (let i = 0; i < 2; i++) {
          if (newVersion[i] > currentVersion[i]) {
            // 需更新
            this.needUpdate = true
            return
          }
        }
        this.$emit('hide')
        this.needUpdate = false
      })
    }
  }
</script>

<style>
.i.el-alert__closebtn.el-icon-close {
  font-size: inherit;
}
.el-alert__content {
  font-size: 15px;
}
</style>
<style lang="less" scoped>
  .alert-msg{
    position: absolute;
    top: 0;
    left: 15%;
    right: 15%;
    .progress-bar{
      display: inline-block;
    }
  }
  .hidden {
    display: none;
  }
  .update-btn {
    margin-bottom: 3em;
    padding: 8px 15px;
    outline: none;
    border: 1px solid #2196F3;
    background: transparent;
    cursor: pointer;
    opacity: .5;
    transition: opacity .5s;
  }

  .update-btn:hover {
    opacity: 1;
  }

  .download-progress {
    margin-bottom: 3em;
  }
</style>
