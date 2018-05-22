<template lang="html">
  <div>
    <label>路径<input v-model="path"></label><br>
    <label>是否使用自定义前缀
      <input v-model="profexShow" type="checkbox">
      <input v-show="profexShow" v-model="profexName">
    </label><br>
    <label >是否使用随机名称<input v-model="nameMode" name="nameMode" type="radio" value='1'></label><br>
    <label >是否使用默认名称<input v-model="nameMode" name="nameMode" type="radio" value='2'></label><br>
    <label >是否使用自定义名称
      <input v-model="nameMode" name="nameMode" type="radio" value='3'>
      <input v-show="nameMode == 3" v-model="name">
    </label>
    <br>
    <imgUploader :path="computedPath" :name-mode="nameMode" :if-prefex="profexShow" :profex="profexName" :default-name="defaultName" :name="name"
                 v-on:uploaded="uploaded"></imgUploader>
    <br>
    <label>
      上传后文件路径
      {{filename}}
    </label>
  </div>
</template>

<script>
  import imgUploader from './imgUploader'
  export default {
    data () {
      return {
        path: 'm6shake/',
        name: 'name',
        nameMode: '1',
        definedName: false,
        defaultName: false,
        profexShow: false,
        profexName: '',
        filename: ''
      }
    },
    methods: {
      uploaded (filename) {
        this.filename = 'http://m6fresh.img-cn-shanghai.aliyuncs.com/' + filename
      }
    },
    computed: {
      computedPath () {
        if (this.profexShow == true) {
          return this.path + this.profexName
        } else {
          return this.path
        }
      }
    },
    components: {
      imgUploader
    }
  }
</script>

<style lang="less" scoped>
</style>
