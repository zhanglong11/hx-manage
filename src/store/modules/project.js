/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-27
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-07-25 08:56:32
 */
import router from '@/router'
const state = {
  projectId: localStorage.getItem('projectId') || '', // 项目id
  projectName: localStorage.getItem('projectName') || '', //项目名称
  projectType: localStorage.getItem('projectType') || '', // 项目类型
  latitude: localStorage.getItem('latitude') || '', // 项目位置
  longitude: localStorage.getItem('longitude') || ''
}

const mutations = {
  // 设置项目缓存
  setProjectLocalStorage(state, obj) {
    localStorage.setItem('projectId', obj.id)
    localStorage.setItem('projectType', obj.type)
    localStorage.setItem('projectName', obj.name)
    state.projectId = obj.id
    state.projectName = obj.name
    state.projectType = obj.type
    this.commit('setLocal', {
      latitude: obj.latitude,
      longitude: obj.longitude
    })
    if (process.env.NODE_ENV === 'development' && !obj.isApproval) {
      this.commit('setWebTitle', {
        serviceCode: obj.type,
        webTitle: '本地开发'
      })
      this.commit('getPower', () => {
        let powerFisterRouter = this.state.userPower && this.state.userPower.power[0]

        if (router.history.current.name === powerFisterRouter) {
          location.reload()
        } else {
          // 判断有没有合同管理权限
          let contract = {
            ContractMerchants: this.state.userPower.power.includes('ContractMerchants'),
            Contract: this.state.userPower.power.includes('Contract'),
            ContractSmartDecoration: this.state.userPower.power.includes('ContractSmartDecoration')
          }
          let hasContract = false
          let contractRouterKey = ''
          for (const key in contract) {
            if (contract.hasOwnProperty(key)) {
              hasContract = hasContract || contract[key]
              if (contract[key]) {
                contractRouterKey = key
              }
            }
          }
          // console.log('hasContract', hasContract, contractRouterKey)
          if (hasContract) {
            router.push({
              name: contractRouterKey
            })
          } else {
            router.push({
              name: powerFisterRouter
            })
          }
        }
        this.dispatch('design/getProjectDetail')
        this.dispatch('setSystemConfigStorage')
      })
      return
    } else {
      this.dispatch('design/getProjectDetail')
      this.dispatch('setSystemConfigStorage')
    }
    let powerFisterRouter = this.state.userPower && this.state.userPower.power[0]
    if (!obj.routerName) {
      if (router.history.current.name === powerFisterRouter) {
        location.reload()
      } else {
        router.push({
          name: powerFisterRouter
        })
      }
    }
  },
  // 单独设置项目id
  setProjectId(state, projectId) {
    localStorage.setItem('projectId', projectId)
    state.projectId = projectId
  },
  // 单独设置项目名称
  setProjectName(state, projectName) {
    localStorage.setItem('projectName', projectName)
    state.projectName = projectName
  },
  // 单独设置项目经纬度
  setLocal(state, obj) {
    localStorage.setItem('latitude', obj.latitude)
    localStorage.setItem('longitude', obj.longitude)
    state.latitude = obj.latitude
    state.longitude = obj.longitude
  }
}

export default {
  state,
  mutations
}
