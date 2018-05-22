var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var util = require('util')
const compressing = require('compressing');
const pipe = require('multipipe')

var buildWinSetup = require('./build-win-setup.js')
var buildUpgrade = require('./build-upgrade')

var rootPath = path.resolve(__dirname, '../')

// get config
var config = require(path.resolve(rootPath, 'config'))

// `./package.json`
var tmpJson = require(path.resolve(rootPath, './package.json'))
var manifestPath = path.resolve(config.build.assetsRoot, './package.json')

// manifest for `./dist/package.json`
var manifest = {}
config.build.nw.manifest.forEach(function(v, i) {
  if (util.isString(v)) manifest[v] = tmpJson[v]
  else if (util.isObject(v)) manifest = util._extend(manifest, v)
})
var pythonFileList = ['run.exe', 'platforms/qminimal.dll', 'ffmpeg.dll', 'platforms/qoffscreen.dll', 'platforms/qwindows.dll', 'printsupport/windowsprintersupport.dll']
var pythonPathList = ['platforms', 'printsupport']
var inquque = []
fs.writeFile(manifestPath, JSON.stringify(manifest, null, '  '), 'utf-8', function(err) {
  if (err) throw err

  // start build app
  if (!config.build.nw.builder) return
  var NwBuilder = require('nw-builder')
  var nw = new NwBuilder(config.build.nw.builder)
  nw.build(function(err, data) {
    if (err) console.log(err)
    console.log('build nw done!')
    // 将python项目的exe移至目录下
    // 压缩win32等目录下文件
    var root = path.resolve(__dirname, '../')
    var builderConfig = config.build.nw.builder
    var releaseRoot = path.resolve(root, builderConfig.buildDir + '/' + manifest.version + '/')
    for (var platform of builderConfig.platforms) {
      var sourcePath = path.resolve(releaseRoot, './' + platform)
      // var disPath = path.resolve(releaseRoot, './' + platform + '.tgz')
      for (var pathname of pythonPathList) {
        fs.mkdir(path.resolve(sourcePath, pathname), function (err) {
          if (err) {
            console.log(err)
          }
        })
      }
      for (var filename of pythonFileList) {
        fs.writeFileSync(path.resolve(releaseRoot, './' + platform + '/' + filename), fs.readFileSync('D:/share/' + platform + '/' + filename))
      }
      // You should take care of stream errors in caution, use multipipe to handle error in one place
      // const tarStream = new compressing.tgz.Stream();
      // tarStream.addEntry(sourcePath);
      // const destStream = fs.createWriteStream(disPath);
      // pipe(tarStream, destStream, handleError);
    }
    doPack()
  })
})
function handleError (err) {
  inquque.push(true)
  if (err) {
    console.log('压缩错误', err)
    throw err
  }
  // 还未完全打包好
  if (inquque.length < config.build.nw.builder.platforms.length) {
    return
  }
  doPack()
}
function doPack () {
  if (config.build.noSetup) return
  if (~config.build.nw.builder.platforms.toString().indexOf('win')) buildWinSetup().then(() => buildUpgrade(manifest))
  else buildUpgrade(manifest)
}