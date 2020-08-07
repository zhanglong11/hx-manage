import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
const timeout = 30000
const urlSuffix = process.env.VUE_APP_BASE_API
const fileUrl = `/cim6d-file-storage${urlSuffix}`
const service = create('/cim6d-system' + urlSuffix)
//const service = create('/cim6d-system-test_byk')
const design = create('/cim6d-design' + urlSuffix) //设计模块
const schedule = create('/cim6d-schedule' + urlSuffix) // 进度模块
const construction = create('/cim6d-construction' + urlSuffix)
// const construction = create('/cim6d-construction-test_byk')
const workflow = create('/cim6d-process' + urlSuffix) // 工作流
const gis = create('/cim6d-bim-light' + urlSuffix)
const file = create(fileUrl) // 智慧施工2.0工作台
const working = create('/cim6d-construction' + urlSuffix) // 智慧施工2.0 工序进度
const safety = create('/cim6d-quality-safety' + urlSuffix) //安全模块
const labour = create(`/cim6d-construction${urlSuffix}/labour`) //劳务模块
const labourSafety = create(`/cim6d-construction${urlSuffix}/safety`) //劳务安全
const iot = create(`/cim6d-iot${urlSuffix}/iot`) // 物联网
const bimSynergy = create('/cim6d-bim-synergy' + urlSuffix) // bim协同
const decoration = create(`/cim6d-construction${urlSuffix}`) // 精装修项目工序相关
const global = create('/cim6d-global' + urlSuffix) //用于获取权限树
const material = create('/cim6d-material-equipment' + urlSuffix) //材料设备，精装修项目
const model = create('/cim6d-quality-safety' + urlSuffix) //模型管理
const admin = create('/cim6d-admin' + urlSuffix) //超管系统
// const found = create('/cim6d-construction' + urlSuffix + '-yjq') // 资金管理-杨佳奇

service.admin = admin
service.design = design
service.schedule = schedule
service.construction = construction
service.workflow = workflow
service.gis = gis
service.system = service
service.file = file
service.working = working
service.safety = safety
service.labour = labour
service.labourSafety = labourSafety
service.iot = iot
service.decoration = decoration
service.bimSynergy = bimSynergy
service.global = global
service.material = material
service.model = model

// service.found = found
export default service
export const filePreviewUrl = fileUrl
export {
  design,
  schedule,
  construction,
  workflow,
  gis,
  file,
  working,
  safety,
  labour,
  labourSafety,
  iot,
  bimSynergy,
  decoration,
  global,
  material,
  model,
  fileUrl
}

export const post = (url, data, config = {}) => {
  return service.post(url, data, config)
}
export const get = (url, data) => {
  return service.get(url, {
    params: data
  })
}
export const getDownload = (url, data) => {
  return file.get(url, {
    params: data,
    responseType: 'blob'
  })
}

function create(baseURL) {
  const instance = axios.create({
    baseURL,
    timeout
  })
  addInterceptor(instance)
  return instance
}
function addInterceptor(service) {
  // request interceptor
  service.interceptors.request.use(
    config => {
      // do something before request is sent
      if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['x-access-token'] = getToken()
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      const res = response.data
      if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
        // bug号：1183、修改人：董渊海、修改时间：2020-03-20
        return response
      }
      /*
       * @任务编号: 2525 | 左侧树接口做拦截
       * @开发人员:申豪强
       * @日期:2020-03-20
       * @任务类型: 新代码
       */
      if (response.config.url.indexOf('.json') > -1 && response.data instanceof Array) {
        return response.data
      }
      if (res.code === 1000) {
        store.dispatch('user/logout')
        return
      }
      // if the custom code is not 20000, it is judged as an error.
      if (!res.success && res.code !== 200) {
        Message({
          message: res.message || res.msg || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    },
    error => {
      console.log('err, 1111' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
  )
}
