<template lang="html">
  <div>
    <div class="set-config">
      <el-form :model="configData" status-icon ref="form" :rules="checkRule" label-width="80px">
        <!-- <el-form-item label="服务器ip">
          <el-input v-model="configData.host" ></el-input>
        </el-form-item> -->
        <el-form-item disabled label="当前版本">
          <p>{{currentVersion}}</p>
        </el-form-item>
        <el-form-item disabled label="运行环境">
          <el-radio v-model="configData.env" :disabled="ifNotDev" label="center">中心</el-radio>
          <el-radio v-model="configData.env" :disabled="ifNotDev" label="store">门店</el-radio>
        </el-form-item>
        <el-form-item label="首页">
          <el-radio v-model="configData.root" :disabled="ifNotDev" label="syncHome">同步程序</el-radio>
          <!-- <el-radio v-model="configData.root" :disabled="ifNotDev" label="posHome">收银程序</el-radio> -->
          <el-radio v-model="configData.root" :disabled="ifNotDev" label="umsposWelcome">无人收银程序</el-radio>
          <el-radio v-model="configData.root" :disabled="ifNotDev" label="umsposLog">无人收银日志墙</el-radio>
        </el-form-item>
        <el-form-item label="服务器ip" prop="host">
          <el-input v-model="configData.host":disabled="ifNotDev" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="同步功能">
          <el-switch v-model="configData.comps.sync":disabled="ifNotDev" ></el-switch>
        </el-form-item>
        <el-form-item label="pos收银">
          <el-switch v-model="configData.comps.pos":disabled="ifNotDev" ></el-switch>
        </el-form-item>
        <el-form-item label="pos收银">
          <el-switch v-model="configData.comps.umspos":disabled="ifNotDev" ></el-switch>
        </el-form-item>
        <el-form-item label="小票打印机">
          <el-select v-model="configData.printer" :disabled="ifNotDev" placeholder="请选择活动区域">
            <el-option v-for="(p, index) of printerList" :key="index" :label="p.printerName" :value="p.printerName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店编码">
          <el-input v-model="configData.store_code":disabled="ifNotDev" ></el-input>
        </el-form-item>
        <el-form-item v-if="!ifNotDev">
          <el-button type="primary" @click="onSubmit">确认更改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import {globalGet} from 'api/ajax'
import nw from 'nw.gui'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入ip'))
      } else {
        globalGet('http://' + this.configData.host + ':8097/test', {}, {timeout: 1500})
          .then(res => {
            if (res.code !== 0) {
              window.M6.alert(res.msg)
              callback(new Error('该服务器ip不可用'))
              return
            }
            callback()
            this.ipOk = true
          })
          .catch(error => {
            console.error(error)
            this.ipOk = false
            callback(new Error('该服务器ip不可用'))
          })
      }
    }
    return {
      ifNotDev: false,
      currentVersion: '',
      configData: {
        host: '192.168.31.131', // 默认服务器连接地址
        env: '',
        comps: { // 功能列表
          sync: true, // 开启同步功能
          pos: true // pos收银功能
        },
        sync: {
          period: 3 // 数据刷新时间间隔（分钟）
        },
        printer: '' // 打印机名称
      },
      checkRule: {
        host: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      printerList: [],
      ipOk: true
    }
  },
  methods: {
    onSubmit () {
      if (!this.ipOk) {
        window.M6.alert('ip未通过！')
        return
      }
      fs.writeFile(M6Config.filePath + 'm6conf.json', JSON.stringify(this.configData, null, '  '), function (err) {
        if (err) {
          console.info(err)
          throw err
        }
        window.M6.alert('修改完成', {type: 'success'})
        window.localConfig = this.configData
      })
    }
  },
  created () {
    this.configData = window.localConfig
    this.ifNotDev = !M6Config.ifDev && Number(localConfig.is_debug) === 0
    this.currentVersion = nw.App.manifest.version
    let win = nw.Window.get()
    win.getPrinters((res) => {
      this.printerList = res
    })
  }
}
</script>

<style lang="less" scoped>
  .set-config{
    padding: 20px 0;
    // padding-top: 67px;
    .el-input{
      width: 300px;
    }
  }
</style>
