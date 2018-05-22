/**
 * Created by Administrator on 2016/10/10.
 */
// export function getLoading (state) {
//   window.console.log("====ceshi ====")
//   return true;
//   // return state.loading;
// }

export const getLoading = state => {
  if (state.loading && state.loading.length > 0) {
    return true
  } else {
    return false
  }
}

export const getUploading = state => state.uploading

export const getSubLoad= state => state.subLoad

export const getAlertShow= state => state.alertShow

export const getConfirmShow= state => state.confirmShow

export const getPromptShow= state => state.promptShow

export const getSyncMsgList= state => state.syncMsgList

export const getCartInfo= state => state.cartInfo

export const getUserInfo= state => state.userInfo

export const getSyncNums= state => state.syncNums

export const getGlobalJob = state => state.globalJob