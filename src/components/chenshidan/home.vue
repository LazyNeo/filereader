<template lang="html">
  <div>
   <input @change="chooseDir" type="file" nwdirectory />
   <p>{{directory}}</p>
   <el-input v-model="filter" placeholder="请输入内容"></el-input>
   <el-button @click="readdir" type="success">读取目录</el-button>
   <ul>
     <li v-for="(item,index) of fileList" @click="gotoItem(item)">{{item}}</li>
   </ul>
  </div>
</template>

<script>
import fs from 'fs'
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
    chooseDir (e) {
      this.directory = e.target.value
      this.readdir()
    },
    readdir () {
      fs.readdir(this.directory, (err, files) => {
        if (err) {
          alert('读取失败')
          return
        }
        this.list = files
      })
    },
    gotoItem (item) {
      this.$router.push({
        name: 'chenshidanItem',
        params: {
          dir: encodeURIComponent(this.directory + '\\' + item)
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
  .sync{
    padding: 20px;
    .update{
      margin-bottom: 30px;
      .left-time{
        margin-right: 30px;
      }
    }
    .info{
      h3{
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 10px;
      }
    }
  }
</style>
