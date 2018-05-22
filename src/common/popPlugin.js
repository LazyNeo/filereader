export const popPlugin = (store) => {
  let M6 = {
    alert: function () {
      if (arguments.length === 1 || typeof arguments[1] !== 'object') {
        M6.oldAlert(...arguments)
      } else {
        M6.newAlert(...arguments)
      }
    },
    oldAlert (msg, period = 2000, callback = () => {}, config = {}) {
      let alertShow = {
        text: msg,
        type: config.type || 'warning',
        showCancelButton: false,
        confirmButtonText: '确认'
      }
      // console.log(config)
      if (period > 0) {
        alertShow.timer = period
      }
      swal(alertShow).then(callback, (dismiss) => {
        if (dismiss === 'timer' || dismiss === 'overlay') {
          callback()
        }
      })
    },
    newAlert (msg, {period = 2000, callback = () => {}, type = 'warning'} = {}) {
      M6.oldAlert(msg, period, callback, {type})
    },
    /**
     * [confirm description] 确认弹出框
     * @param  {[type]} msg            [弹出框提示信息]
     * @param  {[type]} okCallback     [确认按钮回调函数]
     * @param  {[type]} cancelCallback [取消按钮回调函数]
     * @return {[type]}                [description]
     */
    confirm: function (
      {msg = '确认执行操作么?', type = 'warning', okCallback = () => {}, customeClass = '', cancelCallback = () => {}, okText = '确认', cancelText = '取消', easyOk = false} =
      {}
    ) {
      let alertShow = {
        html: `<p class="${customeClass}">${msg}</p>`,
        type,
        showCancelButton: true,
        confirmButtonText: okText,
        cancelButtonText: cancelText
      }
      swal(alertShow).then(okCallback, (dismiss) => {
        if (easyOk && (dismiss === 'timer' || dismiss === 'overlay')) {
          okCallback()
        } else {
          cancelCallback()
        }
      })
    },
    /**
     * [prompt description]
     * @param  {[type]} msg            [description]
     * @param  {[type]} okCallback     [description]
     * @param  {[type]} cancelCallback [description]
     * @param  {[type]} type           [description]
     * @return {[type]}                [description]
     */
    prompt: function ({msg = '', okCallback = () => {}, cancelCallback = () => {}, input = 'text', inputValue = ''}) {
      let alertShow = {
        text: msg,
        type: 'warning',
        input,
        inputValue,
        showCancelButton: false,
        confirmButtonText: '确认'
      }
      swal(alertShow).then(okCallback, (dismiss) => {
        if (dismiss === 'timer' || dismiss === 'overlay') {
          cancelCallback()
        }
      })
    },
    updateLoading (flag) {
      store.commit('UPDATE_LOADING', flag)
    },
    updateUploading (flag) {
      store.commit('UPDATE_UPLOADING', flag)
    }
  }
  window.M6 = M6
}
