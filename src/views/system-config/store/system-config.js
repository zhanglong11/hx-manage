/*
   任务名称：增加全局参数缓存
   开发人员：耿为刚
   日期：2020-04-08
   任务描述：全新代码
 */
import { systemConfigApi } from '../api/system-config'
const state = {
  config: JSON.parse(localStorage.getItem('systemConfig') || '{}') // 全局参数缓存
}

const mutations = {
  // 设置全局参数缓存
  /*
  通过value 获取系统参数label
  group 分组参数
  value 参数编码
  this.$getLabelFromArg(group, value)
  */

  /**
   * 将此方法修改未actions 中的setSystemConfigStorage 方法
   * **/

  // async setSystemConfigStorage(state) {
  //   const result = await systemConfigApi.queryTreeArg({ module: 'construction-2.0' })
  //   const datas = result.data || []
  //   const list = {}
  //   datas.map(items => {
  //     const listItems = {
  //       id: items.id,
  //       label: items.argText,
  //       value: items.argCode,
  //       argGroup: items.argGroup,
  //       children: []
  //     }
  //     if (items.children) {
  //       items.children.map(item => {
  //         listItems.children.push({
  //           label: item.argText,
  //           value: item.argCode,
  //           argGroup: item.argGroup,
  //           deleteFlag: item.deleteFlag
  //         })
  //       })
  //     }
  //     list[items.argCode] = listItems
  //   })
  //   localStorage.setItem('systemConfig', JSON.stringify(list))
  //   state.config = list
  // }

  SET_CONFIG(state, list) {
    localStorage.setItem('systemConfig', JSON.stringify(list))
    state.config = list
  }
}

const actions = {
  setSystemConfigStorage({ commit }) {
    return new Promise(async resolve => {
      const result = await systemConfigApi.queryTreeArg({ module: 'construction-2.0' })
      const datas = result.data || []
      const list = {}
      datas.map(items => {
        const listItems = {
          id: items.id,
          label: items.argText,
          value: items.argCode,
          argGroup: items.argGroup,
          children: []
        }
        if (items.children) {
          items.children.map(item => {
            listItems.children.push({
              label: item.argText,
              value: item.argCode,
              argGroup: item.argGroup,
              deleteFlag: item.deleteFlag
            })
          })
        }
        list[items.argCode] = listItems
      })
      commit('SET_CONFIG', list)
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}
