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
    <el-card v-if="stepIndex === 1 || stepIndex === 2" class="box-card">
      <el-steps :active="stepIndex" align-center>
        <el-step title="规则配置" />
        <el-step title="工序配置" />
      </el-steps>
    </el-card>

    <!-- 规则配置 start -->
    <template v-if="stepIndex === 1">
      <el-card class="box-card">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="200px" class="form-con">
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="模板分类">
                <el-select
                  v-model="cateogry"
                  :disabled="isPreview"
                  clearable
                  placeholder="请选择"
                  class="form-input"
                  @change="changeCateogry"
                >
                  <el-option v-for="item in cateogryList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="模版名称" prop="templateId">
                <el-select
                  v-model="formData.templateId"
                  :disabled="isPreview"
                  clearable
                  placeholder="请选择"
                  class="form-input"
                  @change="getDetailsTemplateWorking"
                >
                  <el-option
                    v-for="item in templateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.status !== 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="名称" prop="name">
                <div class="form-input el-input el-input--small material">
                  <div
                    class="tag-wrapper"
                    :class="[formData.id || drawingList.length ? '' : 'placeholder']"
                    @click="handleMaterialClick"
                  >
                    {{ formData.name || '点击选择' }}
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="开始时间" prop="planStartTime">
                <el-date-picker
                  v-model="formData.planStartTime"
                  :disabled="isPreview"
                  type="datetime"
                  placeholder="请选择"
                  :picker-options="pickerOptions"
                  class="form-input"
                  default-time="08:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="图纸">
                <el-table :data="drawingList" border stripe size="small">
                  <el-table-column type="index" width="60" align="center" label="序号" />
                  <el-table-column prop="drawingName" label="图纸" />
                  <el-table-column prop="procedureNum" label="工序数量">
                    <template slot-scope="scope">{{ scope.row.count || '--' }} </template>
                  </el-table-column>
                  <el-table-column prop="duration" label="工期(天)">
                    <template slot-scope="scope">{{ scope.row.duration || '--' }} </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </template>
    <!-- 规则配置 end -->

    <!-- 工序配置 start -->
    <template v-if="stepIndex === 2">
      <el-card class="box-card">
        <el-table :data="configForm" border stripe size="small">
          <el-table-column min-width="250">
            <div slot="header" class="clearfix">
              <!-- :checked="checkAll" -->
              <el-checkbox
                id="checkAll"
                ref="checkAll"
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
            </div>
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.checkList" @change="handleCheckedGroupChange">
                <el-checkbox v-for="item in drawingList" :key="item.drawingId" :label="item.drawingId">{{
                  item.drawingName
                }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column prop="constructStage" label="施工阶段" min-width="150"> </el-table-column>
          <el-table-column prop="mainProcedure" label="工序名称" min-width="150" />
          <el-table-column prop="floorRule" label="工序规则" width="80" />
          <el-table-column prop="duration" label="工期(天)" width="80" />
        </el-table>
      </el-card>
    </template>
    <!-- 工序配置 end -->

    <!-- 配置预览 start -->
    <template v-if="stepIndex === 3">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :md="12">
            <div class="treeView">
              <el-input v-model="filterName" placeholder="请输入" style="width: 180px; margin-right: 10px;"> </el-input>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <vxe-table
              ref="previewTable"
              show-overflow
              highlight-hover-row
              row-key
              border="inner"
              align="left"
              :data="previewData"
              :tree-config="{
                children: 'children',
                accordion: true,
                line: true
              }"
            >
              <vxe-table-column field="name" tree-node>
                <template v-slot="{ row }">
                  {{ row.name || row.label || row.mainProcedure }}
                </template>
              </vxe-table-column>
              <vxe-table-column title="工序规则" width="140" field="floorRule"> </vxe-table-column>
              <vxe-table-column title="计划工期" width="140" field="duration"> </vxe-table-column>
            </vxe-table>
          </el-col>
        </el-row>
      </el-card>
    </template>
    <!-- 配置预览 end -->

    <!-- 建筑结构关联 start -->

    <el-dialog title="建筑结构关联" :visible.sync="dialogVisible" width="1100px">
      <build-list :entityId="formData.drawingLibraryId" @cancel="handleCancel" @submit="handleSubmit"></build-list>
    </el-dialog>
    <!-- 建筑结构关联 end -->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">{{ isPreview ? '返回' : '取消' }}</el-button>
      <template v-if="stepIndex < 2">
        <el-button type="primary" size="lg" @click="toStep()">下一步</el-button>
      </template>
      <template v-if="stepIndex === 2">
        <el-button size="lg" @click="stepIndex = 1">上一步</el-button>
        <el-button v-if="!isPreview" type="primary" size="lg" @click="save()">保存</el-button>
        <el-button type="success" size="lg" @click="preview()">预览</el-button>
      </template>
      <!-- 添加或编辑时预览页面 -->
      <template v-if="stepIndex === 3 && !isPreview">
        <el-button size="lg" @click="stepIndex = 2">{{ isPreview ? '上一步' : '返回' }}</el-button>
        <el-button size="lg" type="primary" @click="save()">保 存</el-button>
      </template>
      <!-- 直接预览 -->
      <template v-else-if="stepIndex === 3 && isPreview">
        <el-button v-if="status === 0" size="lg" type="primary" @click="publishItem">发布配置</el-button>
      </template>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-31
 * @Last Modified by: gengweigang
 */

/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-03
  任务类型：全新代码
**/
/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-04
**/
import { processProgressApi } from '../api/process-progress'
import Api from '@/views/measureQuantity/api/measure'
import _ from 'lodash'
import BuildList from './build.vue'
import XEUtils from 'xe-utils'
export default {
  name: 'ProcessProgressAddInterleavingSmartDecoration',
  components: {
    BuildList
  },
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      cateogryList: this.$getArgList('templateCategory'), // // 模板分类下拉框数据
      cateogry: '',
      stepIndex: this.$route.query.preview && this.$route.query.preview === 'true' ? 3 : 1, // 当前步骤,查看时直接进入预览界面
      dialogVisible: false,
      templateList: [], // 模板列表下拉框数据
      templateInfo: {}, //选中模板的基本信息
      formData: {
        projectId: this.$store.state.project.projectId,
        planStartTime: '',
        templateId: '',
        drawingLibraryName: '',
        drawingLibraryId: '',
        name: ''
      },
      formRules: {
        templateId: [
          {
            required: true,
            message: '请选择模块名称',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请选择建筑结构名称',
            trigger: 'blur'
          }
        ],
        planStartTime: [
          {
            required: true,
            message: '请选择计划开始时间',
            trigger: 'change'
          }
        ]
      },
      drawingList: [], //选中建筑结构的图纸数据
      configForm: [], // 工序配置明细
      configInfo: {}, //设置完成的配置项，
      checkAll: false,
      isIndeterminate: false,
      checked: true,
      previewData: [], // 预览数据
      originData: [], //预览数据的副本
      configId: '', // 工序配置id
      // 限制只能选今天之后的数据
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
        value: ''
      },
      isPreview: this.$route.query.preview && this.$route.query.preview === 'true' ? true : false,
      status: Number(this.$route.query.status), //预览项的状态，是否发布
      filterName: ''
    }
  },
  watch: {
    checkAll(val) {
      let target = document.getElementById('checkAll')
      if (!target) return
      if (val) {
        target.classList.add('is-checked')
        target.querySelector('.el-checkbox__input').classList.add('is-checked')
      } else {
        target.classList.remove('is-checked')
        target.querySelector('.el-checkbox__input').classList.remove('is-checked')
      }
    },
    isIndeterminate(val) {
      let target = document.getElementById('checkAll')
      if (!target) return

      if (val) {
        target.querySelector('.el-checkbox__input').classList.add('is-indeterminate')
      } else {
        target.querySelector('.el-checkbox__input').classList.remove('is-indeterminate')
      }
    }
  },
  created() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    async init() {
      this.queryTemplateListWorking()
      if (!this.id) return
      // this.initPreviewInfoFromList()
      if (this.isPreview) {
        this.queryConfigPreviewTreeInfo()
      } else {
        //编辑操作
        this.getConfigDetailInfo(this.id)
      }
    },
    // 获取配置项的详细信息
    getConfigDetailInfo(id) {
      return new Promise(async (resolve, reject) => {
        let response = await processProgressApi.getDetailsConfigWorking(id)
        // 规则配置参数
        let result = response.data || {}
        this.cateogry = result.templateCategory
        Object.assign(this.formData, {
          planStartTime: result.planStartTime,
          templateId: result.templateId,
          drawingLibraryId: result.drawingLibraryId,
          name: result.name,
          status: result.status,
          id: result.id
        })
        this.getDetailsTemplateWorking(result.templateId)
        this.drawingList = result.drawList
        // 工序配置 参数:
        this.configInfo = {}
        _.forEach(result.detailList, item => {
          this.configInfo[item.detailId] = _.map(item.drawingList, 'drawingId')
        })
        this.handleFormatterConfigForm()
        resolve(result)
        // console.log('detail', result, this.configInfo)
      })
    },
    /**单体树形结构列表
     *用于编辑和查看详情时展示数据
     **/
    // getTreeListInfo() {
    //   return new Promise(async (resolve, reject) => {
    //     let res = await Api.getTreeListInfo(this.$store.state.project.projectId)
    //     let treeInfo = res.data || []
    //     // console.log('tree', treeInfo)
    //     resolve(treeInfo)
    //   })
    // },

    // 选择模板分类,
    changeCateogry(cateogry) {
      this.formData.templateId = ''
      this.queryTemplateListWorking(cateogry)
    },
    // 模板列表查询
    async queryTemplateListWorking(cateogry = '') {
      const params = {
        projectId: this.$store.state.project.projectId,
        cateogry,
        page: 1,
        rows: 50
      }
      const result = await processProgressApi.queryTemplateListWorking(params)
      const datas = result.data
      const list = datas.records || []
      this.templateList = list
    },
    // 选择建筑结构及图纸信息
    handleMaterialClick() {
      this.dialogVisible = true
    },
    //关闭建筑关联diaolog
    handleCancel() {
      this.dialogVisible = false
    },
    //提交时关闭dialog
    handleSubmit({ id, name }) {
      this.formData.name = name
      this.formData.drawingLibraryName = name
      this.formData.drawingLibraryId = id
      this.getAllDrawingsByNode(id)
      this.dialogVisible = false
    },

    //根据单体ID获取单体下所有的图纸
    async getAllDrawingsByNode(id) {
      let result = await Api.getAllDrawingsByNode(id)
      this.drawingList = result.data || []
      console.log('所有的图纸', this.drawingList)
    },
    // 工序模板详情
    async getDetailsTemplateWorking(id) {
      this.getTemplateprocedureList(id)
      const result = await processProgressApi.getDetailsTemplateWorking(id)
      const datas = result.data
      this.templateInfo = Object.assign(this.templateInfo, result.data || {})
      // console.log('工序模板详情', datas)
    },
    // 获取选中模板下的工序信息
    async getTemplateprocedureList(id) {
      let params = {
        projectId: this.$store.state.project.projectId,
        page: 1,
        rows: 500,
        templateId: id
      }
      const result = await processProgressApi.queryListWorking(params)
      this.templateInfo.list = result.data.records || []
      // console.log('工序列表', this.templateInfo)
    },
    // 下一步
    toStep() {
      if (this.stepIndex === 1) {
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            console.log('工序列表', this.configInfo)
            if (!this.configForm.length) {
              this.handleFormatterConfigForm()
            }
            this.stepIndex = this.stepIndex + 1
          } else {
            this.$message({
              type: 'error',
              message: '请完善表单!'
            })
            return false
          }
        })
      }
    },
    // 根据模板工序和图纸生成工序配置页数据
    handleFormatterConfigForm(settingInfo) {
      let list = this.templateInfo.list || []
      let drawCount = this.drawingList.length
      console.log('list', list, this.configInfo)
      this.configForm = list.map(item => {
        let currentItemCheckList = this.configInfo[item.id] || []
        let currentItemCheckCount = currentItemCheckList.length
        return Object.assign(item, {
          checkList: currentItemCheckList, //选中的图纸
          checkAll: drawCount && currentItemCheckCount === drawCount, //是否选中所有的图纸
          isIndeterminate: drawCount && currentItemCheckCount && currentItemCheckCount !== drawCount //是否有选中项
        })
      })
      if (!Object.keys(this.configInfo).length) return
      this.handleCheckedGroupChange()
    },
    // 选中图纸时判断选中项的数量，设置头部全选的状态
    handleCheckedGroupChange() {
      let checkAll = true //是否全选
      let isIndeterminate = false //是否半选
      let drawCount = this.drawingList.length
      _.forEach(this.configForm, item => {
        item.checkAll = item.checkList.length === drawCount
        item.isIndeterminate = Boolean(item.checkList.length)
        checkAll = checkAll && item.checkAll
        isIndeterminate = isIndeterminate || item.isIndeterminate
      })
      this.checkAll = checkAll
      this.isIndeterminate = checkAll ? false : isIndeterminate
    },
    // 切换顶部的全选状态
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      this.checkAll = val
      if (val) {
        _.forEach(this.configForm, item => {
          item.checkList = _.map(this.drawingList, 'drawingId')
          item.checkAll = true
          item.isIndeterminate = true
        })
      } else {
        _.forEach(this.configForm, item => {
          item.checkList = []
          item.checkAll = false
          item.isIndeterminate = false
        })
      }
    },
    // 获取工序配置结果
    initConfigForm() {
      let params = []
      _.forEach(this.configForm, item => {
        item.checkList.forEach(subItem => {
          params.push({
            //工序内容
            detailId: item.id,
            duration: item.duration,
            floorRule: item.floorRule,
            mainProcedure: item.mainProcedure,
            templateId: item.templateId,
            drawingId: subItem
          })
        })
      })
      console.log('params', params)
      return params
    },
    // 保存
    async save() {
      let params = _.cloneDeep(this.formData)
      const list = this.initConfigForm()
      if (!list.length) {
        this.$message.warning('您还没有进行相关配置')
        return
      }
      params.detailAddList = list
      if (this.id) {
        await processProgressApi.updateConfigWorking(params)
      } else {
        await processProgressApi.saveDetailConfigWorking(params)
      }

      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      this.goBack()
    },
    // 为保存时的预览功能
    async preview() {
      this.stepIndex = 3
      this.previewData = []
      this.originData = []
      let params = _.cloneDeep(this.formData)
      const list = this.initConfigForm()
      if (!list.length) {
        this.$message.warning('您还没有进行相关配置')
        return
      }
      params.detailAddList = list
      console.log('预览', params)
      let result = await processProgressApi.getConfigPreviewInfo(params)
      let data = result.data || []
      this.initPreviewInfo(data)
    },
    // 格式化预览数据:添加和编辑时点击预览按钮
    initPreviewInfo(data) {
      let result = []
      let rootNode = _.find(data, {
        pid: '0'
      })
      result.push(rootNode)
      this.findChildrenInfo(result, data)
      this.previewData = [...result]
      Object.assign(this.originData, this.previewData)
      this.$nextTick(() => {
        if (this.$refs.previewTable) {
          this.$refs.previewTable.setAllTreeExpansion(true)
        }
      })
      console.log('previewData', this.previewData)
    },
    // 根据父节点查找所有的子节点
    findChildrenInfo(parentNodes, data) {
      _.forEach(parentNodes, item => {
        let parentId = item.id
        let matchedChildren = _.filter(data, {
          pid: parentId
        })
        if (matchedChildren) {
          item.children = [...matchedChildren]
        }

        if (item.type === 5 && item.procedureList) {
          item.children = _.map(item.procedureList, subItem => {
            return Object.assign(subItem, {
              name: subItem.mainProcedure
            })
          })
        }
        this.findChildrenInfo(item.children, data)
      })
    },
    // 从list页查看详情时直接展示预览页面时处理
    async queryConfigPreviewTreeInfo() {
      let result = await processProgressApi.getConfigTreeInfo(this.id)
      let data = result.data || []
      this.initPreviewInfo(data)
    },
    // initPreviewInfoFromList() {
    // Promise.all([this.getConfigDetailInfo(this.id), this.getTreeListInfo()]).then(([result, treeInfo]) => {
    //   // 匹配到的建筑结构,type==2
    //   let matchedNode = _.find(treeInfo, { id: result.drawingLibraryId })
    //   let procedureInfo = result.detailList || []
    //   if (!matchedNode.children || !matchedNode.children.length) return
    //   matchedNode.children.forEach(item3 => {
    //     if (!item3.children || !item3.children.length) return
    //     item3.children.forEach(item4 => {
    //       if (!item4.children || !item4.children.length) return
    //       item4.children.forEach(item5 => {
    //         if (!item5.children) {
    //           item5.children = []
    //           // 判断户型对应的图纸包含在哪几道工序中
    //           let matchedProcedure = _.filter(procedureInfo, subItem => {
    //             let subList = subItem.drawingList || []
    //             let matchedDrawing = _.find(subList, { drawingId: item5.drawingId })
    //             return matchedDrawing
    //           })
    //           if (matchedProcedure) {
    //             item5.children.push(...matchedProcedure)
    //           }
    //         }
    //       })
    //     })
    //   })
    //   this.previewData = [matchedNode]
    //   Object.assign(this.originData, this.previewData)
    //   this.$nextTick(() => {
    //     if (this.$refs.previewTable) {
    //       this.$refs.previewTable.setAllTreeExpansion(true)
    //     }
    //   })
    // })
    // },
    // 返回
    goBack() {
      this.$router.push({
        path: '/decoration-progress-smart-decoration/working-procedure-list'
      })
    },
    // 查看时发布工序配置
    async publishItem() {
      let result = await processProgressApi.publishConfigWorking(this.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
        this.goBack()
      }
    },
    // 预览时点击重置按钮
    reset() {
      this.filterName = ''
      this.$refs.previewTable.setFilter('')
      this.init()
    },
    // 预览时搜索
    handleSearch() {
      let filterName = XEUtils.toString(this.filterName).trim()
      if (filterName) {
        let options = {
          children: 'children'
        }
        let searchProps = ['label', 'name', 'mainProcedure']
        this.previewData = XEUtils.searchTree(
          this.originData,
          item => {
            if (searchProps.some(key => XEUtils.toString(item[key] || '').indexOf(filterName) > -1)) {
              return item
            }
          },
          options
        )
        // 搜索之后默认全部展开子节点
        this.$nextTick(() => {
          this.$refs.previewTable.setAllTreeExpansion(true)
        })
      } else {
        Object.assign(this.previewData, this.originData)
      }
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

.el-form-item.is-error {
  .tag-wrapper {
    border-color: #f56c6c !important;
  }
}

.form-input {
  &.material {
    .tag-wrapper {
      line-height: 22px;
      min-height: 32px;
      box-sizing: border-box;
      padding: 5px 10px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;

      &.active {
        color: @main-color;
      }

      &.placeholder {
        color: @sub-color;
      }
    }
  }
}

.inline-input {
  width: 30%;
  display: inline-block;
}

// .tree-table {
//   margin-bottom: 10px;
//   background: #f8f8f9;
//   border-bottom: 1px solid #ebeef5;
//   height: 60px;
//   display: flex;
//   align-items: center;
//   text-align: center;
//   font-size: 14px;
//   font-weight: bold;
//   color: @sub-base-color;

//   .label {
//     padding-left: 20px;
//     flex: 1;
//     text-align: left;
//   }

//   .tree-extend {
//     width: 800px;
//     display: inline-flex;
//     align-items: center;
//     justify-content: flex-end;

//     span {
//       flex: 1;
//       text-align: center;

//       &.remark {
//         white-space: nowrap;
//         text-overflow: ellipsis;
//         overflow: hidden;
//         word-break: break-all;
//       }
//     }
//   }
// }

// /deep/.el-tree-node__content {
//   height: auto;
// }

// .custom-tree-node {
//   display: flex;
//   align-items: center;
//   flex: 1;
//   height: 45px;

//   .tree-left {
//     flex: 1;
//   }

//   .tree-extend {
//     width: 800px;
//     display: inline-flex;
//     align-items: center;
//     justify-content: flex-end;

//     span {
//       flex: 1;
//       text-align: center;
//       max-width: 33.3333%;

//       &.remark {
//         white-space: nowrap;
//         text-overflow: ellipsis;
//         overflow: hidden;
//         word-break: break-all;
//       }
//     }
//   }
// }
</style>
