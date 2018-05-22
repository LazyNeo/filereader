export default {
  version: '20180420', // 版本号
  host: 'localhost', // 默认服务器连接地址
  root: 'chenshidanHome', // 首页功能
  env: 'store', // 运行环境
  hasBackend: true, // 是否带有后台
  printer: '600store(62)',
  autoUpdate: true,
  comps: { // 功能列表
    sync: true,  // 开启同步功能
    pos: true, // pos收银功能
    umspos: false // 无人pos收银功能
  },
  sync: {
    startHours: 8, // 开始打印订单的时间
    endHours: 19, // 结束打印订单的时间
    period: 180, // 数据刷新时间间隔（秒）
    maxLogNum: 10 // 最大日志条数
  },
  store_code: -1, // 门店编码
  // 以下为python的配置信息
  is_debug: 0,
  sys: {
    status: 0,
    leaveTimeMin: 30,
    weight: {},
    weightTotal: 0,
    weightBound: 0.1,
    storeDBUser: 'm6Shake',
    storeDBPassword: 'm6fresh',
    storeDBIp: '192.168.1.21',
  }
}
