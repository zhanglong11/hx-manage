/*
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
*/
import http from '@/utils/axios'
export const noticeApi = {
  // 获取项目列表
  queryProjectList: data => {
    return http.get('cim6d/system/project/list', data)
  },
  // 查询消息列表
  queryListMessage: data => {
    Object.assign(data, {
      projectType: 'construction',
      projectId: localStorage.getItem('projectId')
    })
    return http({
      url: 'common/message/list',
      method: 'post',
      data: {}
    })
  },
  // 获取消息详情
  getDetailsMessage: id => {
    return http({
      url: `common/message/get/${id}`,
      method: 'get'
    })
  },
  // 添加消息
  addMessage: data => {
    return http({
      url: 'common/message/add',
      method: 'post',
      data
    })
  },
  // 编辑消息
  updateMessage: data => {
    return http({
      url: 'common/message/update',
      method: 'post',
      data
    })
  },
  // 删除消息
  deleteMessage: id => {
    return http({
      url: `common/message/delete/${id}`,
      method: 'get'
    })
  },
  // 查询用户详情
  getUserInfo: id => {
    return http({
      url: `cim6d/system/user/get/${id}`,
      method: 'get'
    })
  }
}
