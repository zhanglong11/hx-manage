/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 13:40:37
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-06-30 15:31:23
 */

/*
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，添加项目负责人列表接口，修改比例(5%)

@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-25
@任务类型: 修改代码，添加上传文件接口，修改比例(5%)

@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-26
@任务类型: 修改代码，添加机构查询、新增、上移下移接口，修改比例(10%)
*/
import http from '@/utils/axios'
export const projectApi = {
  // 项目类型列表
  getProjectType: data => {
    return http.system({
      url: '/cim6d/system/project/type/list',
      method: 'get',
      data
    })
  },
  // 查询项目列表
  queryProject: data => {
    return http.system({
      url: '/cim6d/system/project/query',
      method: 'post',
      data
    })
  },

  // 新建项目
  addProject: data => {
    return http.system({
      url: '/cim6d/system/project/add',
      method: 'post',
      data
    })
  },
  // 批量删除项目
  deleteProjectBatch: data => {
    return http.system({
      url: '/cim6d/system/project/batch/delete',
      method: 'post',
      data
    })
  },
  // 删除项目
  deleteProject: id => {
    return http.system({
      url: `/cim6d/system/project/delete/${id}`,
      method: 'get'
    })
  },
  // 查询项目详情
  getProject: id => {
    return http.system({
      url: `/cim6d/system/project/get/${id}`,
      method: 'get'
    })
  },
  // 生成sdk
  generateKeyProject: id => {
    return http.system({
      url: `GET /cim6d/system/project/key/generate/${id}`,
      method: 'get'
    })
  },
  // 项目启动
  startProject: projectId => {
    return http.system({
      url: `GET /cim6d/system/project/start/${projectId}`,
      method: 'get'
    })
  },
  // 编辑项目
  updateProject: data => {
    return http.system({
      url: '/cim6d/system/project/update',
      method: 'post',
      data
    })
  },
  // 获取项目下的角色与人员
  getUserRoleProject: projectId => {
    return http.system({
      url: `/cim6d/system/project/user/role/${projectId}`,
      method: 'get'
    })
  },
  // 查询用户下的项目列表
  getUserProject: () => {
    return http.system({
      url: `cim6d/system/project/list`,
      method: 'get'
    })
  },
  // 根据项目id获取该项目关联的GIS-id、BIM-id
  getLibraryGraphicsProject: id => {
    return http.system({
      url: `/cim6d/system/project/graphics/library/query/${id}`,
      method: 'get'
    })
  },
  // 回显Gis关联库
  queryGimGraphicsLibraryProject: data => {
    return http.system({
      url: `/cim6d/gimGraphicsLibrary/list`,
      method: 'post',
      data
    })
  },
  // 回显Bim关联库
  getGimGraphicsLibraryProject: data => {
    return http.system({
      url: `/cim6d/gimGraphicsLibrary/list`,
      method: 'post',
      data
    })
  },
  // 查询项目负责人列表
  getPrincipalList: data => {
    return http.system({
      url: `/cim6d/system/user/query`,
      method: 'post',
      data
    })
  },
  // 上传项目图片
  upLoadFile: data => {
    return http.file({
      url: `/file/commonFile/uploadImage`,
      method: 'post',
      data
    })
  },
  // 获取项目架构树状信息
  getProjectOrganList: data => {
    return http.system({
      url: `/cim6d/system/project/organ/list`,
      method: 'post',
      data
    })
  },
  // 机构上移、下移
  updateOrganSort: (id, targetId) => {
    return http.system({
      url: `/cim6d/system/project/organ/move/${id}/${targetId}`,
      method: 'get'
    })
  },
  // 机构新增
  addOrganInfo: data => {
    return http.system({
      url: `/cim6d/system/project/organ/add`,
      method: 'post',
      data
    })
  }
}
