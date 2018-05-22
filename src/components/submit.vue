<template lang="html">
  <div class="submit">
    <div v-show="!msgShow" class="feild">
        <p>{{showMsgList[type]}}</p>
        <textarea id="msg" placeholder="相关信息" type="text" rows="6" v-model='info'></textarea>
        <input class="btn btn-success" value="提交" style="width:100%;margin-top: 50px;" type="button" @click="submit">
        <hr class="hr20">
    </div>
    <div v-show="msgShow">
        <p style="font-size: 26px;margin-top: 66%;">您的信息已提交审核，请耐心等待</p>
    </div>
  </div>

</template>

<script>
import {m6Get} from 'api/ajax.js'
export default {
  name: 'submit',
  data () {
    return {
      type: '',
      showMsgList: {
        1: '您还不是答题管理员，请在下方填写您的相关信息（如：部门-姓名-邮箱等），以便我们审核',
        2: '您还不是答题管理员，请在下方填写您的相关信息（如：部门-姓名-邮箱等），以便我们审核',
        3: '如要申请参加相关活动的权限，请在下方填写您的相关信息（如：群名称-群昵称-邮箱等），以便我们审核',
        4: '如要申请参加相关考核的权限，请在下方填写您的相关信息（如：姓名-部门），以便我们审核',
        10: '您没有采购人员权限，如要权限，请在下方填写您的相关信息（如：姓名-部门），以便我们审核',
        11: '您没有采购经理权限，如要权限，请在下方填写您的相关信息（如：姓名-部门等），以便我们审核',
        20: '您没有仓储人员权限，如要权限，请在下方填写您的相关信息（如：姓名-部门等），以便我们审核',
        21: '您没有仓储经理权限，如要权限，请在下方填写您的相关信息（如：姓名-部门等），以便我们审核',
        30: '您没有店铺巡视，如要权限，请在下方填写您的相关信息（如：姓名-部门等），以便我们审核',
        31: '您没有门店图库系统[管理员]权限，如要权限，请在下方填写您的相关信息（如：姓名-部门等），以便我们审核',
        32: '您没有门店图库系统[店长]权限，如要权限，请在下方填写您的相关信息（如：姓名-门店等），以便我们审核',
        40: '您没有扫描系统权限，如要权限，请在下方填写您的相关信息（如：姓名-部门等），以便我们审核',
        41: '您没有扫描系统管理员权限，如要权限，请在下方填写您的相关信息（如：姓名-部门等），以便我们审核',
        71: '您没有养成系统管理员权限，如要权限，请在下方填写您的相关信息（如：姓名-申请理由等），以便我们审核',
        81: '您没有开门权限，如要开门权限，请在下方填写您的相关信息（如：姓名-申请理由等），以便我们审核'
      },
      info: '',
      msgShow: false,
      userId: -1,
      flag: true
    }
  },
  created () {
    this.userId = window.CK.getUrlVar('_user') || window.CK.getCookie('u_id')
    // 申请权限的类型 1 管理员权限 2 答题权限
    this.type = Number(window.CK.getUrlVar('_type'))
    if (!this.userId || !this.type || !this.showMsgList[this.type]) {
      window.M6.alert('参数缺失！')
      this.flag = false
      return
    }
    if ((this.type === 3 || this.type === 4 || this.type === 32 || this.type === 81) && !window.CK.getUrlVar('_a')) {
      window.M6.alert('参数缺失！')
      this.flag = false
    }
  },
  methods: {
    submit () {
      if (!this.flag) {
        window.M6.alert('参数缺失！')
        return
      }
      if (this.info === '') {
        window.M6.alert('请在下方填写您的相关信息')
        return
      }
      let data = {
        userId: this.userId,
        type: this.type,
        msg: this.info,
        attr2: window.CK.getUrlVar('_a') || ''
      }
      m6Get('submitUserInfo', data).then((res) => {
        if (res.code !== 0) {
          window.M6.alert(res.msg)
          return
        }
        this.msgShow = true
      })
    }
  }
}
</script>

<style lang="less">
  .submit{
    position: absolute;
    min-height: 100%;
    top: 0;
    left: 0;
    right: 0;
    font-size: 24px;
    // background: url('http://m6fresh.oss-cn-shanghai.aliyuncs.com/m6shake/XzRTnirEEHbWx2JafNrDYh3y.jpg') repeat;
    .feild{
      height: 80%;
      margin-top: 10%;
      p{
        font-weight: bold;
      }
      textarea{
        width: 100%;
      }
    }
  }
</style>
