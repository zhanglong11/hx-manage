/**
 任务名称：TASK#2848 【智慧工地2.0-前端】资料管理》项目资料》列表、新增、编辑、详情切图及功能开发
 开发人员：崔洛宜
 日期：2020-04-01
 任务类型：集团资料列表页面(新增)
 **/
import Api from '@/views/data-manage/api/work-bench'
const state = {
  projectList: []
}

const mutations = {
  changeProjectList(state, projectList) {
    state.projectList = projectList
  }
}
const actions = {
  //获取项目列表
  async getProjectList({ commit }) {
    let res = await Api.getProjectList({ page: 1, rows: 999 })
    let projectList = res.data
    commit('changeProjectList', projectList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
