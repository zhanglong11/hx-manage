<!--
  /**
   任务名称：task#2852 【智慧工地2.0-前端】工序进度》静态页面切图
   开发人员：耿为刚
   日期：2020-04-01
   规则配置功能开发
   **/
-->
<template>
  <div class="container no-padding is-footer">
    <!-- BIM关联 start -->
    <el-card class="box-card">
      <div class="tree-table">
        <span class="label">主要施工工序</span>
        <div class="tree-extend">
          <span class="period">工期</span>
          <span class="relation">关联楼层</span>
          <span class="remark">备注</span>
          <span class="operation">操作</span>
        </div>
      </div>
      <el-tree :data="previewData" :props="defaultProps" :expand-on-click-node="false" default-expand-all>
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div class="tree-left">
            <span v-if="node.level < 4" class="el-icon-folder-opened" />
            <span v-else class="el-icon-copy-document" />
            <span>{{ node.label }}</span>
          </div>
          <div class="tree-extend">
            <span class="period">{{ data.duration }}</span>
            <span class="relation">{{ node.level === 2 ? node.label : getFloorBind(data.floorNum) }}</span>
            <el-popover class="remark" placement="bottom" width="200" trigger="hover" :content="data.remark">
              <span slot="reference">{{ data.remark }}</span>
            </el-popover>
            <span class="operation"
              ><el-button v-if="node.level === 3" type="text" @click="relationBim(data)">关联楼层</el-button></span
            >
          </div>
        </div>
      </el-tree>
    </el-card>
    <!-- BIM关联 end -->

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
    <!-- 关联楼层 模态框 start -->
    <el-dialog title="关联楼层" :visible.sync="modalParams.show" width="30%">
      <el-form
        ref="formRef"
        :model="modalParams.params"
        :rules="modalParams.formRules"
        label-width="85px"
        class="form-con"
      >
        <el-form-item label="关联bim" prop="floorId">
          <el-select v-model="modalParams.params.floorId" clearable placeholder="请选择" class="form-input">
            <template v-for="item in modalParams.bimList">
              <el-option
                v-if="!floorBindListFloorIds.includes(item.value) || modalParams.params.floorId === item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalParams.show = false">取 消</el-button>
        <el-button type="primary" @click="bindFloor()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联楼层 模态框 end -->
  </div>
</template>

<script>
/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-08
  任务类型：全新代码
**/
import { processProgressApi } from '../api/process-progress'
export default {
  name: 'BimRelation',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      stepIndex: 1, // 当前步骤
      allFloorNumber: [], // 所有楼层
      allSelectFloorNumber: [], // 所有选择过的楼层
      defaultLayer: [
        {
          label: '标准层',
          value: 0
        },
        {
          label: '非标准层',
          value: 1
        },
        {
          label: '避难层',
          value: 2
        }
      ],
      templateList: [], // 模板列表下拉框数据
      layerData: {
        standardFloorDuration: 0,
        refugeFloorDuration: 0,
        nonstandardFloorDuration: 0
      },
      standardFloor: [
        {
          floorNumbers: [],
          selectFloorNumber: [],
          order: ''
        }
      ], // 标准层数据
      nonstandardFloor: [
        {
          floorNumbers: [],
          selectFloorNumber: [],
          order: ''
        }
      ], // 非标准层数据
      refugeFloor: [
        {
          floorNumbers: [],
          selectFloorNumber: [],
          order: ''
        }
      ], // 避难层数据
      formData: {
        name: '',
        nonstandardFloor: '',
        refugeFloor: '',
        remark: '',
        standardFloor: '',
        startTime: '',
        templateId: '',
        totalFloorNum: 10,
        entityId: '1',
        entityName: '单体名称',
        projectId: this.$store.state.project.projectId
      },
      defaultProps: {
        children: 'children',
        label: 'label',
        level: 'level',
        duration: 'duration',
        associatedType: 'associatedType',
        remark: 'remark'
      },
      previewData: [], // 预览数据
      configId: '', // 工序配置id
      configForm: [], // 工序配置明细
      // 限制只能选今天之后的数据
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
        value: ''
      },
      // 关联楼层模态框
      modalParams: {
        show: false,
        params: {
          configId: '',
          floorNum: '',
          entityId: '',
          entityName: '',
          floorId: '',
          floorName: ''
        },
        formRules: {
          floorId: [{ required: true, message: '请选择', trigger: 'change' }]
        },
        bimList: []
      },
      floorBindList: [], // 已关联的楼层
      floorBindListFloorIds: [] // 已关联的楼层id
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init() {
      this.getDetailsConfigWorking()
      this.initFloorNumber()
    },
    // 关联楼层
    relationBim(item) {
      let floorNum = item.floorNum + ''
      let floorId = ''
      let floorName = ''
      this.floorBindList.map(e => {
        if (floorNum === e.floorNum) {
          floorId = e.floorId
          floorName = e.floorName
        }
      })
      this.modalParams.show = true
      this.modalParams.params.configId = this.formData.id
      this.modalParams.params.entityId = this.formData.entityId
      this.modalParams.params.entityName = this.formData.name
      this.modalParams.params.floorNum = item.floorNum
      this.modalParams.params.floorId = floorId
      this.modalParams.params.floorName = floorName
    },
    // 绑定楼层
    bindFloor() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.bindFloorSuccess()
        } else {
          return false
        }
      })
    },
    // 绑定楼层 - 异步
    async bindFloorSuccess() {
      this.modalParams.bimList.map(item => {
        if (item.value === this.modalParams.params.floorId) {
          this.modalParams.params.floorName = item.label
        }
      })
      await processProgressApi.bindFloor(this.modalParams.params)
      this.$message({
        type: 'success',
        message: '关联成功!'
      })
      this.modalParams.show = false
      this.getDetailsConfigWorking()
      this.$refs['formRef'].resetFields()
    },
    // 获取bim楼层数据
    async getBimResource(entityId) {
      if (!entityId) {
        return
      }
      const result = await processProgressApi.getBimResource(entityId)
      let list = []
      if (result && result.length > 0) {
        result.map(item => {
          list.push({
            label: item.name,
            value: item.id
          })
        })
      }
      this.modalParams.bimList = list
    },
    // 获取关联楼层
    getFloorBind(num) {
      let newNum = num + ''
      let floorName = ''
      this.floorBindList.map(item => {
        if (item.floorNum === newNum) {
          floorName = item.floorName
        }
      })
      return floorName
    },
    // 工序配置下楼层绑定关系
    async queryFloorBindList() {
      const result = await processProgressApi.queryFloorBindList(this.id)
      const list = result.data || []
      const floorBindListFloorIds = []
      list.map(item => {
        floorBindListFloorIds.push(item.floorId)
      })
      this.floorBindListFloorIds = floorBindListFloorIds
      this.floorBindList = list
    },
    // 获取工序配置详情
    async getDetailsConfigWorking() {
      if (!this.id) {
        return
      }
      const result = await processProgressApi.getDetailsConfigWorking(this.id)
      const datas = result.data
      this.formData = Object.assign({}, datas)
      this.getBimResource(datas.entityId)
      const standardFloorSelects = datas.standardFloor && datas.standardFloor.split(',').map(Number)
      const refugeFloorSelects = datas.refugeFloor && datas.refugeFloor.split(',').map(Number)
      const nonstandardFloorSelects = datas.nonstandardFloor && datas.nonstandardFloor.split(',').map(Number)
      this.allSelectFloorNumber = [...standardFloorSelects, ...refugeFloorSelects, ...nonstandardFloorSelects]
      this.standardFloor[0].selectFloorNumber = standardFloorSelects
      this.refugeFloor[0].selectFloorNumber = refugeFloorSelects
      this.nonstandardFloor[0].selectFloorNumber = nonstandardFloorSelects

      // 处理楼层工期与施工顺序
      this.layerData.standardFloorDuration = datas.standardFloorDuration
      this.layerData.refugeFloorDuration = datas.refugeFloorDuration
      this.layerData.nonstandardFloorDuration = datas.nonstandardFloorDuration
      this.standardFloor[0].order = datas.standardProcedure
      this.refugeFloor[0].order = datas.refugeProcedure
      this.nonstandardFloor[0].order = datas.nonstandardProcedure
      this.initFloorNumber()
      this.getDetailsConfigListWorking()
      this.queryFloorBindList()
    },
    // 解决table表单不刷新问题
    refreshTable() {
      this.standardFloor.push('')
      this.standardFloor.splice(1, 1)
      this.refugeFloor.push('')
      this.refugeFloor.splice(1, 1)
      this.nonstandardFloor.push('')
      this.nonstandardFloor.splice(1, 1)
    },
    // 初始化楼层数据
    initFloorNumber() {
      const floorNumber = []
      for (let i = 1; i <= this.formData.totalFloorNum; i++) {
        floorNumber.push({
          label: `${i} 层`,
          value: i
        })
      }
      this.allFloorNumber = floorNumber
      // 初始化标准层数据
      this.initLayer('standardFloor')
      // 初始化避难层数据
      this.initLayer('refugeFloor')
      // 初始化非标准层数据
      this.initLayer('nonstandardFloor')
    },
    // 初始化层级数据
    initLayer(key) {
      this[key].map(item => {
        item.floorNumbers = this.allFloorNumber.filter(e => {
          if (this.allSelectFloorNumber.indexOf(e.value) < 0) {
            return e
          }
        })
      })
    },
    // 获取工序列表
    async getDetailsConfigListWorking() {
      if (!this.id) {
        return
      }
      const result = await processProgressApi.getDetailsConfigListWorking(this.id)
      const datas = result.data || []
      datas.map((item, i) => {
        const selectLayer = []
        if (item.standardFlag) {
          selectLayer.push(0)
        }
        if (item.nonstandardFlag) {
          selectLayer.push(1)
        }
        if (item.refugeFlag) {
          selectLayer.push(2)
        }
        item.selectLayer = selectLayer
        if (!item.floorRule) {
          item.floorRule = i === 0 ? 'N' : `N-${i}`
        }
      })
      this.configForm = datas
      this.preview()
    },
    // 处理工序配置所有工序明细数据
    initConfigForm() {
      const params = []
      this.configForm.map((item, index) => {
        params.push({
          configId: this.configId,
          constructStage: item.constructStage,
          detailId: this.id ? item.detailId : item.id,
          floorRule: item.floorRule,
          duration: item.duration || 0,
          mainProcedure: item.mainProcedure,
          standardFlag: item.selectLayer.indexOf(0) >= 0 ? 1 : 0,
          nonstandardFlag: item.selectLayer.indexOf(1) >= 0 ? 1 : 0,
          refugeFlag: item.selectLayer.indexOf(2) >= 0 ? 1 : 0,
          remark: item.remark,
          sort: index,
          templateId: item.templateId,
          associatedType: item.associatedType
        })
      })
      return params
    },
    // 预览
    preview() {
      const list = this.initConfigForm()
      const previewData = [
        {
          label: this.formData.templateName,
          level: 1,
          duration: '',
          associatedType: '',
          remark: '',
          children: [
            {
              label: this.formData.name,
              level: 2,
              duration: 0,
              associatedType: '',
              remark: '',
              children: []
            }
          ]
        }
      ]
      const durationArray = []
      // 计算楼层
      const countFloor = (num, isUnderground = false) => {
        const items = {
          label: `${isUnderground ? '-' : ''}${num}层`,
          floorNum: isUnderground ? -num : num,
          level: 3,
          duration: 0,
          durationTotal: 0,
          associatedType: '',
          remark: '',
          children: []
        }
        const standardFloor = this.formData.standardFloor && this.formData.standardFloor.split(',').map(Number)
        const refugeFloor = this.formData.refugeFloor && this.formData.refugeFloor.split(',').map(Number)
        const nonstandardFloor = this.formData.nonstandardFloor && this.formData.nonstandardFloor.split(',').map(Number)
        const initItemList = (array, key) => {
          const itemList = []
          if (array.indexOf(num) >= 0) {
            list.map((e, j) => {
              if (e[key] === 1) {
                itemList.push({
                  label: e.mainProcedure,
                  level: 4,
                  duration: e.duration || 0,
                  associatedType: e.associatedType,
                  remark: e.remark
                })
                if (j === 0) {
                  items.durationTotal += e.duration * (durationArray.length + 1)
                } else {
                  items.durationTotal += e.duration
                }
                items.duration += e.duration
              }
            })
            items.children.push(...itemList)
          }
        }
        initItemList(standardFloor, 'standardFlag')
        initItemList(refugeFloor, 'refugeFlag')
        initItemList(nonstandardFloor, 'nonstandardFlag')

        if (isUnderground) {
          previewData[0].children[0].children.unshift(items)
        } else {
          previewData[0].children[0].children.push(items)
        }
        durationArray.push(items.durationTotal)
        previewData[0].children[0].duration += items.duration
      }

      // 地下楼层
      for (let i = 1; i <= this.formData.undergroundFloorNum; i++) {
        countFloor(i, true)
      }
      // 地上楼层
      for (let i = 1; i <= this.formData.overgroundFloorNum; i++) {
        countFloor(i)
      }
      previewData[0].children[0].duration = Math['max'].apply(Math, durationArray)
      this.previewData = previewData
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/process-progress/working-procedure-list'
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../../styles/color.less');
.form-con {
  padding-right: 15%;
}
.form-input {
  width: 100%;
}
.inline-input {
  width: 30%;
  display: inline-block;
}
.tree-table {
  margin-bottom: 10px;
  background: #f8f8f9;
  border-bottom: 1px solid #ebeef5;
  height: 60px;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: @sub-base-color;
  .label {
    padding-left: 20px;
    flex: 1;
    text-align: left;
  }
  .tree-extend {
    width: 900px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    span {
      flex: 1;
      text-align: center;
      &.remark {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
}
/deep/.el-tree-node__content {
  height: auto;
}
.custom-tree-node {
  display: flex;
  align-items: center;
  flex: 1;
  height: 45px;
  .tree-left {
    flex: 1;
  }
  .tree-extend {
    width: 900px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    span {
      text-align: center;
      width: 25%;
      &.remark {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
}
</style>
