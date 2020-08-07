/**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （移动代码）
     **/

import api from '@/api/workflow'
import toTree from '@/utils/toTree'
export default {
  namespaced: true,
  state: {
    userListTree: [],
    roleList: [],
    roleCategory: [],
    formList: [],
    processCategory: [],
    processCategoryTree: []
  },
  mutations: {
    changeUserListTree(state, treeData) {
      state.userListTree = treeData
    },
    changeRoleList(state, list) {
      state.roleList = list
    },
    changeRoleCategory(state, list) {
      state.roleCategory = list
    },
    changeFormList(state, list) {
      state.formList = list
    },
    changeProcessCategory(state, list) {
      state.processCategory = list
      state.processCategoryTree = toTree(list)
    }
  },
  actions: {
    async getRoleList({ commit }) {
      const list = await api.getRoleList()
      commit('changeRoleList', list)
    },
    async getRoleCategory({ commit }) {
      const list = await api.getRoleCategory()
      commit('changeRoleCategory', list)
    },
    async getFormList({ commit }) {
      const list = await api.getFormList()
      let newList = []
      list.map(item => {
        newList.push(...item.children)
      })
      commit('changeFormList', newList)
    },
    async getProcessCategory({ commit }) {
      const list = await api.getProcessCategory()
      commit('changeProcessCategory', list)
    }
  }
}
