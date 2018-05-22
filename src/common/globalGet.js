/*
  立即执行虚函数
 */
import path from 'path'
(() => {
  let M6Config = {
    appVersion: 201802261649,
    callback: {},
    imgHost: 'https://m6fresh.oss-cn-shanghai.aliyuncs.com/',
    phoneReg: /^1(((3|4|5|7|8)\d{9})|((99|98|66)\d{8}))$/,
    urlReg: /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/)*[\w-]+(\.[\w-]+)*\/?(\?([\w\-.,@?^=%&:/~+#]*)+)?/,
    imgReg: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    env_type: '', // 网页处于什么环境 mini小程序 weixin微信网页 inner内部版网页 im内部版移动端
    execPath: path.join(process.execPath, '../'),
    u_id: CK.getCookie('o2o_u_id'),
    store_id: CK.getCookie('m6_store_id'),
    cursorPage: 'posHome',
    M6_TOKEN: CK.getCookie('M6_TOKEN')
  }
  if (process.execPath.indexOf('node_modules') !== -1) {
    M6Config.filePath = './'
    M6Config.ifDev = true
  } else {
    M6Config.filePath = path.join(process.execPath, '../')
    M6Config.ifDev = false
  }
  window.M6Config = M6Config

  // 兼容性配置
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        return window.setTimeout(callback, 1000 / 60)
      }
  })()
  // 日期函数
  Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      'S': this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
})()
