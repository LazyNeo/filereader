/**
 * Created by Neo on 2016/10/31.
 */
import axios from 'axios'
import {urlConfig} from './url_config'
import { Shell } from 'nw.gui'
import Vue from 'vue'
// 判断是否是远程服务器
let cancel
let promiseArr = {}
const CancelToken = axios.CancelToken
// 请求拦截器
axios.interceptors.request.use(config => {
  // 发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('重复操作,操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})

const _method = (url, data = {}, config) => {
  let timer = null
  let timerRun = false
  if (!config || !config.loadingNotShow) {
    timer = setTimeout(() => {
      timerRun = true
      window.M6.updateLoading(true)
    }, 400)
  }
  data.u_id = M6Config.u_id
  data.env_type = M6Config.env_type
  data.M6_TOKEN = M6Config.M6_TOKEN
  return axios({
    url,
    method: config.method || 'Get',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: config.timeout || 20000,
    CancelToken: new CancelToken(c => {
      cancel = c
    })
  }).then((res) => {
    if (!timerRun) {
      clearInterval(timer)
      timer = null
    } else {
      window.M6.updateLoading(false)
    }
    return firstPromise(res)
  }).then(secondPromise).catch((error) => {
    if (!timerRun) {
      clearInterval(timer)
      timer = null
    } else {
      window.M6.updateLoading(false)
    }
    console.error(url, 'error', JSON.stringify(error.code))
    return Promise.reject(error)
  })
}
const gGet = (url, data = {}, {timeout = 120}) => {
  return axios({
    url,
    data: formDataPost(data),
    timeout
  })
}
const firstPromise = (res) => {
  if (res.status >= 200 && res.status < 300) {
    return res.data
    // return typeof res.body === 'string' ? res.json() : res.body;
  }
  window.console.error('res:', res)
  return {code: -1, msg: '网络连接异常,请稍后重试'}
}
const secondPromise = (json) => {
  if (json.code !== 0) {
    console.error('code: ' + json.code + '  msg:' + json.msg)
    if (json.code === 301) {
      M6.alert('啊呀,六六还不知道您是谁呢,快让我知道吧', {
        callback: () => {
          // location.href = CK.returnOnlineAuthUrl()
        },
        period: 2000
      })
      return
    }
  }
  return json
}
const errorPromise = (error, config) => {
  if (error.message === '重复操作,操作取消') {
    console.warn('m6', error, '重复操作,操作取消')
    return Promise.reject(error)
  }
  // 测试接口
  if (config.errorTest) {
    if (localConfig.host === 'localhost') {
      console.info('自动开启后台')
      Shell.openItem(M6Config.filePath + 'run.exe')
      setTimeout(setCallback, 3000)
    } else {
      M6.alert(msg, {type: 'error'})
    }
    return Promise.reject(error)
  }
  // 检测网络是否重置好的接口
  if (config.testNet) {
    setTimeout(setCallback, 3000)
    return Promise.reject(error)
  }
  let msg = '设置的pos后台为' + localConfig.host + ',但是并没有开启，请联系IT部门'
  if (error.response && error.response.status === 500) {
    msg = '后台系统发生内部错误，请上报IT部门'
  }
  Vue.prototype.$notify.error({
    title: '网络连接错误',
    message: msg
  })
  return Promise.reject(error)
}
function setCallback () {
  m6Get('test', {}, {testNet: true, timeout: 2000}).then(res => {
    localConfig.net_working = true
    CK.doCallBack('net_working')
  })
}
const formData = (data) => {
  let arr = []
  for (let key in data) {
    data[key] && arr.push(key + '=' + data[key])
  }
  return arr.join('&')
}
const formDataPost = (data) => {
  let dataT = new FormData()
  for (let key in data) {
    if (typeof data[key] === 'object') {
      data[key] && dataT.append(key, JSON.stringify(data[key]))
    } else if (typeof data[key] === 'undefined') {
      continue
    } else {
      dataT.append(key, data[key])
    }
  }
  // dataT.append('u_id', M6Config.u_id);
  // dataT.append('M6_TOKEN', M6Config.M6_TOKEN);
  return dataT
}
/**
 * Mocking client-server processing
 */
export const m6Get = (pattern, data, config) => {
  config = Object.assign({method: 'GET'}, config)
  return _method((window.localConfig ? 'http://' + window.localConfig.host + ':8097/' : 'http://192.168.31.117:8097/') + urlConfig.serverice[pattern] + '?' + formData(data), data, config)
}
export const globalGet = (pattern, data, config) => {
  return _method(pattern + '?' + formData(data), data, config)
}
export const m6Post = (pattern, data, config = {}) => {
  config = Object.assign({method: 'POST'}, config)
  return _method((window.localConfig ? 'http://' + window.localConfig.host + ':8097/' : 'http://192.168.31.118:8097/') + urlConfig.serverice[pattern], formDataPost(data), config)
}
