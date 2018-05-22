/*eslint-disable */
import {m6Get, globalGet} from '../../api/ajax'
export default {
  install (Vue, options) {
    window.Vue = Vue
    var CK = {
      toUtf8: function (str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
          c = str.charCodeAt(i);
          if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
          } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          }
        }
        return out;
      },
      getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        return vars;
      },
      getUrlVar: function (name) {
        return this.getUrlVars()[name];
      },
      clearCookie: function () {
        // 设置过期原则
        localStorage.clear()
      },
      /**
       * 设置cookie
       * @param {[type]} key   [键名]
       * @param {[type]} value [键值]
       * @param {[type]} days  [保存的时间（天）]
       */
      setCookie: function (key, value, days = 7) {
        // 设置过期原则
        if (!value) {
          localStorage.removeItem(key)
        } else {
          var Days = days || 1; // 默认保留一天
          var exp = new Date();
          localStorage[key] = JSON.stringify({
            value,
            expires: exp.getTime() + Days * 24 * 60 * 60 * 1000
          })
        }
      },
      getCookie: function (name) {
        try {
          let o = JSON.parse(localStorage[name])
          if (!o) {
            // 未取得值或者为null和undefined
            return localStorage[name]
          } else if (typeof o !== "object") {
            // 不是正确的json值
            this.setCookie(name, localStorage[name])
            return localStorage[name]
          } else if (o.expires < Date.now()) {
            // 过期了
            return null
          } else {
            return o.value
          }
        } catch (e) {
          // console.log('localstorage读取错误', name, localStorage[name])
          let o = localStorage[name]
          // console.log('转存储localstorage', name, localStorage[name])
          this.setCookie(name, o)
          return o
        } finally {
        }
      },
      delCookie: function (name) {
          var exp = new Date();
          exp.setTime(exp.getTime() - 1);
          var cval=this.getCookie(name);
          if(cval!=null)
              document.cookie= name + "="+cval+";expires="+exp.toGMTString();
      },
      LoadJS: function (sId, fileUrl, callback) {
        let dom = document.querySelector(sId)
        if (!dom) {
          var script = document.createElement("script");
          script.src = fileUrl
          if (callback) {
            script.onload = callback
          }
          // script.id = sId;
          document.body.appendChild(script)
        }
      },
      LoadCss: function (sId, fileUrl) {
        return globalGet(fileUrl).then(res => {
          if (res.data != null && !document.getElementById(sId)) {
            let oHead = document.getElementsByTagName('HEAD').item(0);
            let oScript = document.createElement( "style" );
            oScript.rel = "javascript";
            oScript.type = "text/css";
            oScript.id = sId;
            oScript.defer = true;
            oScript.innerHTML = res.data;
            oHead.appendChild( oScript );
            return true
          } else {
            return false
          }
        })
      },
      //判断浏览器类型
      myBrowser : function() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
          return "Opera"
        }
        ; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
          return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1) {
          return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
          return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
          return "IE";
        }//判断是否IE浏览器
      },
      is_weixin: function () {
          var ua = navigator.userAgent.toLowerCase();
          if(ua.match(/MicroMessenger/i)=="micromessenger") {
              return true;
          } else {
              return false;
          }
      },
      is_weixin_work: function () {
          var ua = navigator.userAgent.toLowerCase();
          if(ua.match(/wxwork/i)=="wxwork") {
              return true;
          } else {
              return false;
          }
      },
      dataCollect: function (eventCode, eventLabel) {
        // 不统计信息
        return
        m6Get('clickEventLog', {eventCode, eventLabel})
      },
      mul: function (arg1, arg2){
        if (!arg1 || !arg2 || Number(arg1) === NaN || Number(arg2) === NaN) {
          // console.log(arg1, arg2)
          return 0
        }
        let m=0,s1=arg1.toString(),s2=arg2.toString();
        try {
          m+=s1.split(".")[1].length
        } catch (e) {}
        try {
          m+=s2.split(".")[1].length
        }catch(e){}
        return Math.ceil(Number(s1.replace(".",""))*Number(s2.replace(".","")))/Math.pow(10,m)
      },
      /**
       *
       * @param {*} item 商品信息
       * @param {*} price_id 店铺等级信息
       * @param {*} s_type 店铺是否是平价店铺
       * @param {*} user_lvl 用户等级
       * @param {*} index 用户等级
       * @param {*} moneyRatio 是否乘以价格系数
       * @param {*} numRatio 是否乘以数量系数
       *
       */
      getPrice (item, {price_id: store_lvl, s_type}, user_lvl, {index = -1, moneyRatio = false, numRatio = true} = {}) {
        // console.log(item, store_lvl, user_lvl)
        if (!item.item_id) {
          return 0
        }
        let ratio = 1
        let spec
        if (index < 0) {
          if (item.spec) {
            spec = item.spec
          } else {
            spec = item.specs[0]
          }
        } else {
          spec = item.specs[index]
        }
        ratio = 1
        if (moneyRatio) {
          ratio *= spec.money_ratio
        }
        if (numRatio) {
          ratio *= spec.ratio
        }
        // 判断是否为专属价格
        if (item.is_private > 0) {
          return item.private_p * ratio
        }
        // 判断是否是平价商品
        if (item.sp > 0 && s_type > 0) {
          return item.sp * ratio
        }
        if (!store_lvl || !user_lvl) {
          return item['p1'] * ratio || 0
        }
        if (user_lvl == 'p') {
          return item[store_lvl] * ratio || 0
        } else if (user_lvl == 'cp' || !this.ifHasfVPrice(item.dis_type)) {
          return item['c' + store_lvl] * ratio || 0
        } else {
          return item['p' + store_lvl] * ratio || 0
        }
      },
      ifHasfVPrice (dis_type) {
        return !(dis_type !== 'V' && dis_type!== 'P' && dis_type !== 'M' && dis_type !== 'W')
      },
      getDistance (point1, point2) {
        if (!point1.lat || !point1.lng || !point2.lat || !point2.lng) {
          return 0
        }
        let er = 6366.564864;
        return er*2*Math.asin(Math.sqrt(Math.pow(Math.sin((point1.lat - point2.lat)*Math.PI/180 / 2), 2) +  Math.cos(point1.lat * Math.PI/180) * Math.cos(point2.lat * Math.PI/180) *  Math.pow(Math.sin((point1.lng - point2.lng) * Math.PI/180 / 2), 2) ))
      },
      getDate: function (now) {
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let date = now.getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (date < 10) {
          date = '0' + date
        }
        return year + '-' + month + '-' + date
      },
      getDateTime: function (now) {
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let date = now.getDate()
        let hour = now.getHours()
        let minute = now.getMinutes()
        let second = now.getSeconds()
        if (month < 10) {
          month = '0' + month
        }
        if (date < 10) {
          date = '0' + date
        }
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
      },
      /**
       * [isEmojiCharacter 判断是否是emoji]
       * @param  {[type]}  substring [description]
       * @return {Boolean}           [description]
       */
      isEmojiCharacter: function(substring) {
        for ( var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                        || hs == 0x2b50) {
                    return true;
                }
            }
        }
      },
      dateFormat (str) {
        let date = new Date(str)
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      },
      setCallBack (name, callback) {
        if (typeof M6Config.callback[name] === 'function') {
          let fun = M6Config.callback[name]
          M6Config.callback[name] = () => {
            fun()
            callback()
          }
        } else {
          M6Config.callback[name] = () => {
            callback()
          }
        }
      },
      doCallBack (name) {
        if (typeof M6Config.callback[name] === 'function') {
          M6Config.callback[name]()
        } else {
          return
        }
      },
      haveRaffle: function () {
        if (this.getCookie('laset_raffle_time') && (Date.now() - this.getCookie('laset_raffle_time')) < 20000) {
          // console.log(Date.now() - this.getCookie('laset_raffle_time'))
          // 操作频繁
          return
        }
        this.setCookie('laset_raffle_time', Date.now())
        window.MtaH5.clickStat('User_click', {'raffleget': 'true'})
        m6Get('haveRaffle', {}, {loadingNotShow: true}).then(res => {
          if (res.data.p_id) {
            window.M6.alert(`恭喜你发现了隐藏剧情,获得了${res.data.name},快去领奖吧`, -1, () => {
              window.MtaH5.clickStat('User_click', {'rafflerecive': 'true'})
              window.location.href = res.data.link
            })
          }
        })
      },
      getStoreWorkDay ({work_day}) {
        let days = {
          list: [],
          origin: work_day
        }
        let init = Number(work_day)
        for (let i = 0; i < 7; i++) {
          if (init % 2 === 1) {
            days.list.push(true)
          } else {
            days.list.push(false)
          }
          init = Math.floor(init / 2)
        }
        if (Number(work_day) === 127) {
          days.desc = '无休'
        } else if (Number(work_day) === 62) {
          days.desc = '工作日营业'
        } else {
          let descList = ['日', '一', '二', '三', '四', '五', '六']
          let workList = []
          for (let i = 0; i < 7; i++) {
            if (days.list[i]) {
              workList.push(descList[i])
            }
          }
          if (workList.length === 0) {
            days.desc = '门店歇业'
          } else {
            days.desc = `周${workList.join(',')}营业`
          }
        }
        return days
      },
      computeInterTime (delay, item) {
        let nowTime = (new Date()).getHours() + 3
        if (delay > 0) {
          // 超过截单时间或者未超过截单时间但是当前时间超过下午配送时间
          return Number(item.daily_dev_time)
        } else {
          return Math.max(nowTime, item.daily_dev_time)
        }
      },
      computeTimeList (item, store) {
        if (!item.item_id || !item.times || item.times.length === 0 || !store.store_id) {
          console.log('信息错误', item, store)
          return []
        }
        let city = Number(store.store_city)
        let now = (new Date()).Format('yyyy-MM-dd hh:mm:ss')
        let times = []
        for (let time of item.times) {
          if (now > time.d_cut_time && city === Number(time.city)) {
            times.push({value: time.d_delivery_time, label: time.d_delivery_time})
          }
        }
        return times.sort((a, b) => {
          return a.value > b.value ? 1 : 0
        })
      },
      computeInterDay (item, store) {
        let now = (new Date()).Format('hh:mm:ss')
        // 店铺信息没有获取到
        if (!store.store_id || !item.item_id) {
          return 99
        }
        if (Number(item.delivery_mode) === 2) {
          // 约时达
          let fisrtDay = this.computeTimeList(item, store)[0]
          if (!fisrtDay || !fisrtDay.value) {
            // 没有配送时间,无法配送
            console.log('无法配送', item.times, store, this.computeTimeList(item, store))
            return -2
          }
          return Math.floor((Date.parse(fisrtDay.value) - Date.parse((new Date()).Format('yyyy-MM-dd')))/ (3600 * 24 * 1000))
        }
        let nowTime = (new Date()).getHours() + 3
        let passCuttime = Boolean(nowTime - 2 > item.cut_time.split(':')[0])
        let day = (new Date()).getDay()
        let deviTime = Number(item.delivery_time)
        let deviDay = deviTime % 7 || 0
        if (deviTime === -1) {
          return -1
        }
        // 商品为周几达商品,但是当天不营业
        if (Number(item.delivery_mode) === 1) {
          if (!store.workDays.list[deviTime % 7]) {
            return 99
          }
          if (deviDay > day) {
            return deviDay
          } else if (day === deviDay) {
            if (!passCuttime) {
              return 0
            } else {
              return 7
            }
          } else {
            return deviDay + 7 - day
          }
          // if (!passCuttime) {
          //   if (day === deviDay) {
          //     return 0
          //   } else {
          //     return 7
          //   }
          // } else {
          //   return Math.abs(deviDay - day) + 1
          // }
        }
        // 计算不考虑门店配送时间下的延期
        let delay = (passCuttime ? 1 : 0) + deviTime
        // 根据店铺时间判断是否需要延期
        while (!store.workDays.list[(day + delay) % 7]) {
          if (delay < 8) {
            delay++
          } else {
            break
          }
        }
        return delay
      },
      getType(o){
        let _t
        return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase()
      },
      deepCopy (source) {
        let destination = CK.getType(source)=="array"?[]:{}
        for (var p in source) {
          if (!source.hasOwnProperty(p)) continue
          if (CK.getType(source[p]) == "array" || CK.getType(source[p]) == "object") {
            destination[p] = CK.getType(source[p])=="array"?[]:{};
            destination[p] = CK.deepCopy(source[p]);        //递归调用在这里
          } else {
            destination[p]=source[p];
          }
        }
        return destination
      }
    }
    window.CK = CK
  }
}
/* eslint-enable */
