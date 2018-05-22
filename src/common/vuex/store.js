import Vuex from 'vuex';
import Vue from 'vue';
import * as types from '../vuex/mutation-type'
import * as actions from '../vuex/actions'
import * as getters from '../vuex/getters'
import {popPlugin} from '../popPlugin'
Vue.use(Vuex);

const state = {
  alertShow: {
    show: false,
    msg: '出了点小问题,请刷新页面重试!',
    period: 2000,
    config: {},
    callback: () => window.console.log('alert')
  },
  confirmShow: {
    show: false,
    msg: '是否要执行该操作？',
    okCallback: () => window.console.log('ok'),
    cancelCallback: () => window.console.log('cancel')
  },
  promptShow: {
    show: false,
    msg: '请补全相关信息',
    type: '',
    defaultInput: '',
    okCallback: () => window.console.log('ok'),
    cancelCallback: () => window.console.log('cancel')
  },
  loading: [],
  uploading: false,
  cartInfo: {},
  userInfo: {},
  globalJob: {},
  subLoad:{
    loading:true,
    isShowImage:true,
    message:""
  },
  syncMsgList: [],
  syncNums: {}
};
const mutations = {
  [types.UPDATE_LOADING](state,loading) {
    if (loading) {
      state.loading.push(true)
    } else {
      state.loading.pop()
    }
  },
  [types.UPDATE_UPLOADING](state,uploading) {
    state.uploading=uploading
  },
  [types.UPDATE_SUB_LOADING](state,subload){
    state.subLoad.loading=subload.loading;
    state.subLoad.isShowImage=subload.isShowImage;
    state.subLoad.message=subload.message;
  },
  [types.UPDATE_ALERT_CONFIG](state,alertShow){
    state.alertShow = {
      show: alertShow.show,
      msg: alertShow.msg || '出了点小问题,请刷新页面重试!',
      period: alertShow.period || 2000,
      config: {},
      callback: alertShow.callback
    }
  },
  [types.UPDATE_CONFIRM_CONFIG](state,confirmShow){
    state.confirmShow = {
      show: confirmShow.show,
      msg: confirmShow.msg || '是否要执行该操作？',
      okCallback: confirmShow.okCallback,
      cancelCallback: confirmShow.cancelCallback
    }
  },
  [types.UPDATE_PROMPT_CONFIG](state,promptShow){
    state.promptShow = {
      show: promptShow.show,
      msg: promptShow.msg || '请补全相关信息',
      type: promptShow.type || '',
      defaultInput: promptShow.defaultInput || '',
      okCallback: promptShow.okCallback,
      cancelCallback: promptShow.cancelCallback
    }
  },
  [types.UPDATE_SYNC_MSG_LIST](state,syncMsgList){
    state.syncMsgList = syncMsgList
  },
  [types.UPDATE_GLOBAL_JOB] (state, globalJob) {
    state.globalJob = globalJob
  },
  [types.UPDATE_CART_INFO](state,cartInfo){
    state.cartInfo = cartInfo
  },
  [types.UPDATE_USER_INFO](state,userInfo){
    state.userInfo = Object.assign({}, userInfo)
  },
  [types.UPDATE_SYNC_NUMS](state,syncNums){
    state.syncNums = syncNums
  }
}
export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins: [popPlugin]
})
