<template lang="html">
  <div>
    <div class="set-config">
      <el-form status-icon ref="form" label-width="80px">
        <el-form-item label="开始同步时间">
          <el-select v-model="configData.sync.startHours" placeholder="请选择">
            <el-option
              v-for="item in timeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束同步时间">
          <el-select v-model="configData.sync.endHours" placeholder="请选择">
            <el-option
              v-for="item in timeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="刷新间隔(秒)">
          <el-input v-model="configData.sync.period"></el-input>
        </el-form-item>
        <el-form-item label="最大日志条数">
          <el-input v-model="configData.sync.maxLogNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认更改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
export default {
  data () {
    return {
      timeList: [
        {label: '6:00', value: 6},
        {label: '7:00', value: 7},
        {label: '8:00', value: 8},
        {label: '9:00', value: 9},
        {label: '10:00', value: 10},
        {label: '11:00', value: 11},
        {label: '12:00', value: 12},
        {label: '13:00', value: 13},
        {label: '14:00', value: 14},
        {label: '15:00', value: 15},
        {label: '16:00', value: 16},
        {label: '17:00', value: 17},
        {label: '18:00', value: 18},
        {label: '19:00', value: 19},
        {label: '20:00', value: 20}
      ],
      configData: {
        sync: {
          period: 3 // 数据刷新时间间隔（分钟）
        }
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.configData.sync.startHours >= this.configData.sync.endHours) {
        M6.alert('开始同步时间不能晚于结束同步时间', {type: 'error'})
        return
      }
      fs.writeFile(M6Config.filePath + 'm6conf.json', JSON.stringify(this.configData, null, '  '), function (err) {
        if (err) {
          window.M6.alert('修改失败', {type: 'error'})
          throw err
        }
        window.M6.alert('修改完成', {type: 'success'})
        window.localConfig = this.configData
      })
    }
  },
  created () {
    this.configData = window.localConfig
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
