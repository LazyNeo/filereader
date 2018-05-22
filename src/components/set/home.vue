<template lang="html">
  <div>
    <el-tabs class="set-tab" v-model="activeTab" type="card" @tab-click="toggleTab">
      <el-tab-pane label="基础设置" name="first">
        <basic-set></basic-set>
      </el-tab-pane>
      <el-tab-pane label="同步设置" name="second">
        <sync-set></sync-set>
      </el-tab-pane>
      <el-tab-pane v-if="false" label="pos设置" name="third">
        <pos-set></pos-set>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import basicSet from './basicSet'
import syncSet from './syncSet'
import posSet from './posSet'
export default {
  data () {
    return {
      activeTab: 'first'
    }
  },
  methods: {
    toggleTab () {
    }
  },
  components: {
    basicSet,
    syncSet,
    posSet
  }
}
</script>

<style lang="less" scoped>
  .set-tab{
    margin: 20px 20px 0;
  }
</style>
