<template>
  <div>
    <div class="date-picker">
      <div class="before" @click="beforeBtn">
        <span class="glyphicon glyphicon-chevron-left"></span>
      </div>
      <div class="date-select">
        <input type="date" class="date" v-model="today">
      </div>
      <div class="after" @click="afterBtn">
        <span class="glyphicon glyphicon-chevron-right"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      today: window.CK.getDate(new Date())
    }
  },
  methods: {
    beforeBtn () {
      this.today = this.getDays(this.today, -1)
    },
    afterBtn () {
      this.today =  this.getDays(this.today, 1)
    },
    getDays: function (now, days) {
      let year = now.slice(0, 3+1)
      let month = now.slice(5, 6+1)
      if (now.slice(5, 6) === '0') {
        month = now.slice(6, 6+1)
      }
      month = month - 1
      let date = now.slice(8, 9+1)
      if (now.slice(8, 9) === '0') {
        date = now.slice(9, 9+1)
      }
      let newdate = new Date(Number(year), Number(month), Number(date))
      let newtimes = newdate.getTime() + days * (24*60*60*1000)
      let yesd = new Date(newtimes)
      year = yesd.getFullYear()
      month = yesd.getMonth() + 1
      date = yesd.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      return year + '-' + month + '-' + date
    }
  },
  watch: {
    today (newValue, oldValue) {
      let newT = new Date(newValue)
      let nowT = new Date()
      let nt = window.CK.getDate(nowT)
      if (newT.getTime() > nowT.getTime()) {
        window.M6.alert('只能选择今日及之前的日期')
        this.today = oldValue
        return
      }
      if (oldValue > nt) {
        return
      }
      this.today =  newValue
      this.$emit('change', this.today)
    }
  }
}
</script>

<style lang="less" scoped>
  .date-picker{
    background: #29b6f6;
    height: 2rem;
    line-height: 2rem;
    color: #fff;
    overflow: hidden;
    font-weight: bold;
    font-size: .9rem;
    div{
      height: 100%;
      span{
      }
    }
    .before{
      float: left;
      width: 20%;
      background: #4fc3f7;
      span{
        margin-left: 35%;
      }
    }
    .date-select{
      float: left;
      width: 60%;
      text-align: center;
      position: relative;
      .date{
        width: 100%;
        left: 0;
        height: 100%;
        background-color: #29b6f6;
        text-align: center;
        border: 0px;
        appearance:none;
        color:#fff;
        padding-left: 20%;
      }
    }
    .after{
      float: right;
      width: 20%;
      background: #4fc3f7;
      text-align: right;
      span{
        margin-right: 35%;
      }
    }
  }
</style>
