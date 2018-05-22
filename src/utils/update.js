'use strict'

import { App } from 'nw.gui'
import fs from 'fs'
import path from 'path'
import http from 'http'
const events = require('events')
const compressing = require('compressing');

const { manifest } = App
const platform = (/^win/.test(process.platform) ? 'win' : /^darwin/.test(process.platform) ? 'osx' : 'linux') + (process.arch === 'ia32' ? '32' : '64')

const options = { method: 'GET', mode: 'cors', credentials: 'include' }
let tmpUpdateJson = null

// get update.json
export function getUpdateJson (noCache) {
  // if (!noCache && tmpUpdateJson) return new Promise((resolve, reject) => resolve(tmpUpdateJson))
  if (!noCache && tmpUpdateJson) return Promise.resolve(tmpUpdateJson)
  return window.fetch(manifest.manifestUrl + '?' + new Date().getTime(), options)
    .then(resp => resp.json())
    .then(json => {
      tmpUpdateJson = json
      return tmpUpdateJson
    })
}

export function parseName (json) {
  if (!json || !json.packages) return
  const pkg = json.packages[platform]
  if (!pkg) return
  return path.parse(pkg.url).base
}

// check version
export function checkUpdate () {
  getUpdateJson().then(json => {
    // console.log(json, App.manifest.version)
    if (json.version === App.manifest.version) {
      return false
    } else {
      router.push({name: 'update'})
      return true
    }
  })
}

export function downloadHandle (savePath, json) {
  console.log(savePath, json)
  const ev = new events.EventEmitter()

  const uri = json.packages[platform].url
  const totalSize = json.packages[platform].size
  const loadFile = fs.createWriteStream(savePath)
  let loaded = 0

  http
    .get(uri, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) return ev.emit('error', res.statusCode)
      res.on('end', () => {
        loadFile.end()
        loadFile.destroySoon()
        ev.emit('end', savePath)
        // unzip(savePath, ev)
      })
      res.on('error', err => ev.emit('error', err.message))
      res.on('data', chunk => {
        loadFile.write(chunk)
        loaded += chunk.length
        ev.emit('data', loaded / totalSize)
      })
    })
    .on('error', err => ev.emit('error', err.message))

  return ev
}

export function unzip (savePath, ev) {
  console.log(ev, savePath)
  compressing.tgz.uncompress(savePath, M6Config.filePath)
  .then((res) => {
    console.log('suucess', res)
  }).catch(handleError)
}
function createDir (v, callback) {
  /* 创建的新目录名是nsrc*/
  fs.mkdir(v, function (err) {
    if (!err) {
      console.log('创建目录成功...');
      callback && callback(err);
    } else {
      console.log("创建目录失败...");
    }
  })
}
function handleError (err) {
  if (err) {
    console.log('压缩错误', err)
    throw err
  }
}