var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var nwPath = require('nw').findpath()
var rootPath = path.resolve(__dirname, '../')
var packageJsonPath = path.resolve(rootPath, './package.json')

module.exports = runNwDev

function runNwDev(uri = '') {
  console.log('uri:', uri)
  if (uri && (uri + '').trim()) {
    tmpJson = require(packageJsonPath)
    tmpJson.main = uri
    fs.writeFileSync(packageJsonPath, JSON.stringify(tmpJson, null, '  '), 'utf-8')
  }

  var closed
  var nwCmd = nwPath + ' ' + rootPath
  console.log('开发系统架构：', process.arch)
  if (process.arch == 'x64') {
    // 64为开发系统的时候加载vue devtools
    nwCmd += ' --load-extension="D:\\wamp\\www\\vue-devtools\\shells\\chrome"'
  }
  var nwDev = exec(nwCmd, { cwd: rootPath }, function(err, stdout, stderr) {
    process.exit(0)
    closed = true
  })
  
  nwDev.stdout.on('data', console.log)
  nwDev.stdout.on('error', console.error)

  // 退出时也关闭 NW 进程
  process.on('exit', exitHandle)
  process.on('uncaughtException', exitHandle)

  function exitHandle(e) {
    if (!closed) nwDev.kill()
    console.log(e || '233333, bye~~~')
  }
}
