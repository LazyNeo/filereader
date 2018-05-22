import fs from 'fs'
import path from 'path'
// require('@/facedetect/index')
// 读取本地配置
let defaultSet = require('static/default_config.js').default
let oldSet
let localPath = M6Config.filePath + 'm6conf.json'
try {
  let data = fs.readFileSync(localPath, 'utf-8')
  oldSet = JSON.parse(data)
  // console.info('读取配置文件成功', oldSet.toString(), oldSet)
  oldSet.net_working = undefined
  window.localConfig = oldSet
} catch (e) {
  console.error('配置文件读取失败', e)
  window.localConfig = defaultSet
  oldSet = defaultSet
  fs.writeFile(localPath, JSON.stringify(defaultSet, null, '  '), function (err) {
    if (err) throw err
    console.info('写入完成')
  })
}
// 合并历史 配置项
let count = mergeSet(oldSet, defaultSet)
if (count > 0) {
  oldSet.net_working = undefined
  window.localConfig = oldSet
  fs.writeFile(localPath, JSON.stringify(oldSet, null, '  '), function (err) {
    if (err) {
      console.error('更新，写入失败', err)
      throw err
    }
    console.info('更新，写入完成', count)
  })
}
// 合并方法
function mergeSet (oldSet, defaultSet) {
  let count = 0
  for (let i in defaultSet) {
    if (!defaultSet.hasOwnProperty(i)) continue
    if (typeof oldSet[i] === 'object' || typeof oldSet[i] === 'array') {
      count += mergeSet(oldSet[i], defaultSet[i])
    }
    if (typeof oldSet[i] === 'undefined') {
      count++
      oldSet[i] = defaultSet[i]
      continue
    }
  }
  return count
}