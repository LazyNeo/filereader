<template lang="html">
  <div>
    <div class="set-config">
      <!-- <el-form :model="configData" status-icon ref="form" :rules="checkRule" label-width="80px">
        <el-form-item label="刷新间隔(分钟)">
          <el-input v-model="configData.sync.period"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认更改</el-button>
        </el-form-item>
      </el-form> -->
    </div>
  </div>
</template>

<script>
// import fs from 'fs'
export default {
  data () {
    return {
      configData: {
      }
    }
  },
  methods: {
    // onSubmit () {
    //   fs.writeFile('m6conf.json', JSON.stringify(this.configData, null, '  '), function (err) {
    //     if (err) throw err
    //     window.M6.alert('修改完成', {type: 'success'})
    //   })
    // }
  },
  created () {
    // this.configData = JSON.parse(fs.readFileSync('m6conf.json', 'utf-8'))
  }
}
</script>

<style lang="less" scoped>
  .set-config{
    padding: 20px 0;
    .el-input{
      width: 300px;
    }
  }
</style>
