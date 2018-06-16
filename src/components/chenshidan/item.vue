<template>
  <ul>
    <p>{{directory}}</p>
    <el-row>
      <el-col :span="4">合计长度:</el-col>
      <el-col :span="8"><em class="error-text">{{totalLength}}</em></el-col>
    </el-row>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="file"
        label="文件名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="other"
        width="100"
        label="额外长度">
        <template slot-scope="scope">
          <el-input v-model="scope.row.other" :step="100" type="number" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="sum"
        width="80"
        label="合计">
      </el-table-column>
      <el-table-column
        label="孔数目">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) of scope.row.list" :type="item | typeFilter" :key="index">{{item}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </ul>
</template>


<script>
import fs from 'fs'
import path from 'path'
export default {
  data () {
    return {
      directory: '',
      list: []
    }
  },
  filters: {
    typeFilter (item) {
      let i = Number(item)
      if (i < 2) {
        return 'danger'
      }
      return ''
    }
  },
  methods: {
    readdir () {
      fs.readdir(this.directory, (err, files) => {
        if (err) {
          M6.alert('读取失败', {type: 'error'})
          console.error(err)
          return
        }
        console.log(files)
        this.list = files
        this.readData(files)
      })
    },
    readData (files) {
      try {
        let dataList = []
        for (const file of files) {
          if (file.indexOf('.NC') === -1) {
            continue
          }
          let data = fs.readFileSync(path.join(this.directory, file), 'utf-8')
          let list = data.match(/Z-\d+\.\d?/g)
          let tmpSX = data.match(/Z0\. R3\.?/g)
          let shuangxie = tmpSX ? tmpSX.length : 0
          let sum = 0
          let xiekong = 0
          let dps = []
          if (list && list.length > 0) {
            for (let deep of list) {
              let num = Number(deep.replace('Z-', ''))
              dps.push(num)
              if (num === 1) {
                xiekong++
                continue
              }
              sum += Math.ceil(num / 100) * 100
            }
          }
          if (sum < 500) {
            sum = 500
          }
          for (let i = 0; i < shuangxie; i++) {
            dps.push(0)
          }
          dataList.push({
            file,
            list: dps,
            other: 0,
            sum,
            shuangxie,
            xiekong
          })
        }
        this.list = dataList
      } catch (error) {
        console.error(error)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.directory = decodeURIComponent(vm.$route.params.dir)
      vm.readdir()
    })
  },
  computed: {
    totalLength () {
      let l = 0
      for (const i of this.list) {
        l += Number(i.sum) + Number(i.other)
      }
      return l
    }
  }
}
</script>

<style lang="less" scoped>

</style>

