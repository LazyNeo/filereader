<template>
  <ul>
    <p>{{directory}}</p>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="file"
        label="文件名"
        width="180">
      </el-table-column>
      <el-table-column
        label="孔数目"
        width="180">
         <template slot-scope="scope">{{scope.row.list}}</template>
      </el-table-column>
      <el-table-column
        prop="sum"
        label="合计">
      </el-table-column>
      <el-table-column
        prop="xiekong"
        label="斜孔数目">
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
  methods: {
    readdir () {
      fs.readdir(this.directory, (err, files) => {
        if (err) {
          alert('读取失败')
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
          let data = fs.readFileSync(path.join(this.directory, file), 'utf-8')
          let list = data.match(/Z-\d+\.\d?/g)
          let sum = 0
          let xiekong = 0
          let dps = []
          for (let deep of list) {
            let num = Number(deep.replace('Z-', ''))
            dps.push(num)
            if (num === 1) {
              xiekong++
              continue
            }
            sum += Math.ceil(num / 100) * 100
          }
          dataList.push({
            file,
            list: dps,
            sum,
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
  }
}
</script>

<style lang="less" scoped>

</style>

