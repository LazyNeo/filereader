import * as types from '../vuex/mutation-type'
/**
 * 更新loading
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateLoading = ({commit},loading) => {
    commit(types.UPDATE_LOADING,loading)
}
/**
 * 更新loading
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateUploading = ({commit},uploading) => {
    commit(types.UPDATE_UPLOADING,uploading)
}

/**
 * 更新subLoad
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateSubLoading=({commit},subload) => {
  commit(types.UPDATE_SUB_LOADING,subload)
}

/**
 * 更新alert信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateAlertShow=({commit},alertShow) => {
  commit(types.UPDATE_ALERT_CONFIG,alertShow)
}

/**
 * 更新confirm信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateConfirmShow=({commit},confirmShow) => {
  commit(types.UPDATE_CONFIRM_CONFIG,confirmShow)
}
/**
 * 更新Prompt信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updatePromptShow=({commit},getPromptShow) => {
  commit(types.UPDATE_PROMPT_CONFIG,getPromptShow)
}

/**
 * 获取用户信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateSyncMsgList=({commit},getSyncMsgList) => {
  commit(types.UPDATE_SYNC_MSG_LIST, getSyncMsgList)
}

/**
 * 获取用户信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateCartInfo=({commit},getCartInfo) => {
  commit(types.UPDATE_CART_INFO, getCartInfo)
}
/**
 * 获取用户信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateUserInfo=({commit},getUserInfo) => {
  commit(types.UPDATE_USER_INFO, getUserInfo)
}

/**
 * 获取环境信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateSyncNums=({commit},getSyncNums) => {
  commit(types.UPDATE_SYNC_NUMS, getSyncNums)
}

/**
 * 获取环境信息
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const updateGlobalJob = ({commit}, getGlobalJob) => {
  commit(types.UPDATE_GLOBAL_JOB, getGlobalJob)
}
