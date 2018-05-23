<template lang="html">
  <div class="container">
    <el-row>
      <el-col :span="8">
        <el-button @click="choose" type="success">目录选择</el-button>
      </el-col>
      <el-col :span="10">目录：{{directory}}</el-col>
    </el-row>
   <input ref="file_choose" hidden @change="chooseDir" type="file" nwdirectory />
   <el-input v-model="filter" placeholder="请输入内容进行筛选"></el-input>
   <ul class="file-list">
     <li class="item" v-for="(item,index) of fileList" @click="gotoItem(item)">{{item}}</li>
   </ul>
  </div>
</template>

<script>
import fs from 'fs'
import path from 'path'
export default {
  data () {
    return {
      env: 'center',
      filter: '',
      directory: '',
      today: (new Date()).Format('yyyy/MM/dd'),
      list: []
    }
  },
  methods: {
    choose () {
      this.$refs.file_choose.click()
    },
    chooseDir (e) {
      this.directory = e.target.value
      this.readdir()
    },
    readdir () {
      fs.readdir(this.directory, (err, files) => {
        if (err) {
          M6.alert('读取失败', {type: 'error'})
          return
        }
        this.list = files
      })
    },
    gotoItem (item) {
      this.$router.push({
        name: 'chenshidanItem',
        params: {
          dir: encodeURIComponent(path.join(this.directory, item))
        }
      })
    }
  },
  computed: {
    fileList () {
      if (!this.filter) {
        return this.list
      }
      let l = []
      for (const t of this.list) {
        if (t.indexOf(this.filter) !== -1) {
          l.push(t)
        }
      }
      return l
    }
  }
}
</script>

<style lang="less" scoped>
  .container{
    overflow-y: scroll;
  }
  .file-list{
    padding-left: 10%;
    .item{
      padding: 2px 0;
    }
  }
</style>
