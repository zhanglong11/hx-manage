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
    <el-card class="box-card">
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
                  <el-option v-for="item in cateogryList" :key="item.value" :label="item.desc" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="模块名称" prop="templateId">
                <el-select
                  v-model="formData.templateId"
                  :disabled="isPreview"
                  clearable
                  placeholder="请选择"
                  class="form-input"
                  @change="getDetailsTemplateWorking"
                >
                  <el-option v-for="item in templateList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="楼号或地下室名称" prop="name">
                <el-tree
                  ref="bimTreeRef"
                  node-key="bimResourceId"
                  :data="bimTreeData"
                  :props="bimTreeProps"
                  default-expand-all
                  show-checkbox
                  :expand-on-click-node="false"
                  @check="selectBim"
                ></el-tree>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="formData.startTime"
                  :disabled="isPreview"
                  type="date"
                  placeholder="请选择"
                  :picker-options="pickerOptions"
                  class="form-input"
                  value-format="yyyy-MM-dd 00:00:00"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="地上楼层数" prop="overgroundFloorNum">
                <el-input-number
                  v-model="formData.overgroundFloorNum"
                  :disabled="isPreview"
                  :min="1"
                  @change="changeFloor"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="地下楼层数" prop="undergroundFloorNum">
                <el-input-number
                  v-model="formData.undergroundFloorNum"
                  :disabled="isPreview"
                  :min="0"
                  @change="changeFloor"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 标准层 表单 start -->
          <el-row :gutter="20">
            <el-col :md="20">
              <el-form-item label="标准层">
                <el-table ref="standardFloorFef" :data="standardFloor" border stripe size="small">
                  <el-table-column prop="floorNumbers" label="标准楼层" min-width="360">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.selectFloorNumber"
                        :disabled="isPreview"
                        multiple
                        size="lg"
                        placeholder="请选择"
                        style="width: 100%;"
                        @change="changeLayer($event, 'standardFloor')"
                        @remove-tag="removeTag"
                      >
                        <el-option
                          v-for="item in scope.row.floorNumbers"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="工期（天）/层" min-width="140">
                    <template>{{ layerData.standardFloorDuration }}</template>
                  </el-table-column>
                  <el-table-column prop="order" label="施工顺序" />
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 标准层 表单 end -->

          <!-- 避难层 表单 start -->
          <el-row :gutter="20">
            <el-col :md="20">
              <el-form-item label="避难层">
                <el-table ref="refugeFloorFef" :data="refugeFloor" border stripe size="small">
                  <el-table-column prop="floorNumbers" label="标准楼层" min-width="360">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.selectFloorNumber"
                        :disabled="isPreview"
                        multiple
                        size="lg"
                        placeholder="请选择"
                        style="width: 100%;"
                        @change="changeLayer($event, 'refugeFloor')"
                        @remove-tag="removeTag"
                      >
                        <el-option
                          v-for="item in scope.row.floorNumbers"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="工期（天）/层" min-width="140">
                    <template>{{ layerData.refugeFloorDuration }}</template>
                  </el-table-column>
                  <el-table-column prop="order" label="施工顺序" min-width="140" />
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 避难层 表单 end -->

          <!-- 非标准层 表单 start -->
          <el-row :gutter="20">
            <el-col :md="20">
              <el-form-item label="非标准层">
                <el-table ref="nonstandardFloorFef" :data="nonstandardFloor" border stripe size="small">
                  <el-table-column prop="floorNumbers" label="标准楼层" min-width="360">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.selectFloorNumber"
                        :disabled="isPreview"
                        multiple
                        size="lg"
                        placeholder="请选择"
                        style="width: 100%;"
                        @change="changeLayer($event, 'nonstandardFloor')"
                        @remove-tag="removeTag"
                      >
                        <el-option
                          v-for="item in scope.row.floorNumbers"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="工期（天）/层" min-width="140">
                    <template>{{ layerData.nonstandardFloorDuration }}</template>
                  </el-table-column>
                  <el-table-column prop="order" label="施工顺序" min-width="140" />
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 非标准层 表单 end -->

          <!-- <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="关联构件">
                <el-input class="form-input" :disabled="isPreview" />
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remark"
                  :disabled="isPreview"
                  class="form-input"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入备注信息"
                />
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
          <el-table-column prop="name" label="标准楼层" width="280">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.selectLayer"
                :disabled="isPreview"
                multiple
                placeholder="请选择"
                style="width: 100%;"
                @change="changeConfigDetails($event, scope.row.selectLayer)"
              >
                <el-option v-for="item in defaultLayer" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="constructStage" label="施工阶段" min-width="140">
            <template slot-scope="scope">
              {{ $getLabelFromArg('constructStage', scope.row.constructStage) }}
            </template>
          </el-table-column>
          <el-table-column prop="mainProcedure" label="主要施工工序" min-width="140" />
          <el-table-column prop="floorRule" label="楼层规则" min-width="140" />
          <el-table-column prop="remark" label="备注" min-width="140" />
          <el-table-column label="操作" align="center">
            <template v-if="scope.$index > 0 && !isPreview" slot-scope="scope">
              <el-button
                :disabled="scope.$index === 1"
                type="text"
                size="mini"
                @click="swapConfigDetailsUp(scope.$index)"
                >上移</el-button
              >
              <el-button
                :disabled="scope.$index === configForm.length - 1"
                type="text"
                size="mini"
                @click="swapConfigDetailsDown(scope.$index)"
                >下移</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>
    <!-- 工序配置 end -->

    <!-- 配置预览 start -->
    <template v-if="stepIndex === 3">
      <el-card class="box-card">
        <div class="tree-table">
          <span class="label">主要施工工序</span>
          <div class="tree-extend">
            <span class="period">工期</span>
            <span class="relation">关联名称</span>
            <span class="remark">备注</span>
          </div>
        </div>
        <el-tree :data="previewData" :props="defaultProps" default-expand-all>
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <div class="tree-left">
              <span v-if="node.level < 4" class="el-icon-folder-opened" />
              <span v-else class="el-icon-copy-document" />
              <span>{{ node.label }}</span>
            </div>
            <div class="tree-extend">
              <span class="period">{{ data.duration }}</span>
              <span class="relation">{{ $getLabelFromArg('associatedType', data.associatedType) }}</span>
              <el-popover class="remark" placement="bottom" width="200" trigger="hover" :content="data.remark">
                <span slot="reference">{{ data.remark }}</span>
              </el-popover>
            </div>
          </div>
        </el-tree>
      </el-card>
    </template>
    <!-- 配置预览 end -->

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
      <el-button v-if="stepIndex > 2" size="lg" @click="stepIndex = 2">{{ isPreview ? '上一步' : '返回' }}</el-button>
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
export default {
  name: 'ProcessProgressAddInterleaving',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      isPreview: this.$route.query.preview && this.$route.query.preview === 'true' ? true : false,
      cateogryList: this.$enum.getValueDescList('WORKING_TEMPLATE_TYPE'), // // 模板分类下拉框数据
      cateogry: '',
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
        overgroundFloorNum: 10,
        undergroundFloorNum: 0,
        totalFloorNum: 10,
        entityId: '1',
        entityName: '单体名称',
        projectId: this.$store.state.project.projectId
      },
      formRules: {
        templateId: [{ required: true, message: '请选择模块名称', trigger: 'change' }],
        name: [{ required: true, message: '请选择楼号或地下室名称', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        overgroundFloorNum: [{ required: true, message: '请输入地上楼层数', trigger: 'blur' }]
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
      bimTreeData: [], // bim数据
      bimTreeProps: {
        children: 'children',
        label: 'bimResourceName',
        id: 'id',
        type: 'type',
        bimVersionId: 'bimVersionId',
        disabled: 'disabled'
      } // bim数据字段
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
      this.queryTemplateListWorking()
      this.queryBimTree()
    },
    // 获取bim数据
    async queryBimTree() {
      const result = await processProgressApi.queryBimTree(this.formData.projectId)
      const datas = result.data || []
      datas.map(items => {
        items.disabled = true
        if (items.children) {
          items.children.map(item => {
            item.disabled = true
          })
        }
      })
      this.bimTreeData = datas
      this.getDetailsConfigWorking()
    },
    // 选择bim
    selectBim(e, checked) {
      let bimTreeRef = this.$refs.bimTreeRef
      if (checked.checkedKeys.length > 0) {
        this.$refs.bimTreeRef.setCheckedKeys([e.bimResourceId])
        this.formData.entityId = e.bimResourceId
        this.formData.entityName = e.bimResourceName
        this.formData.name = e.bimResourceName
      } else {
        this.formData.entityId = ''
        this.formData.entityName = ''
        this.formData.name = ''
      }
    },
    // 获取工序配置详情
    async getDetailsConfigWorking() {
      if (!this.id) {
        this.initFloorNumber()
        return
      }
      const result = await processProgressApi.getDetailsConfigWorking(this.id)
      const datas = result.data
      this.formData = Object.assign({}, datas)
      this.$refs.bimTreeRef.setCheckedKeys([datas.entityId]) // 选中bim树

      const standardFloorSelects = datas.standardFloor && datas.standardFloor.split(',').map(Number)
      const refugeFloorSelects = datas.refugeFloor && datas.refugeFloor.split(',').map(Number)
      const nonstandardFloorSelects = datas.nonstandardFloor && datas.nonstandardFloor.split(',').map(Number)
      this.allSelectFloorNumber = [...standardFloorSelects, ...refugeFloorSelects, ...nonstandardFloorSelects]
      // 处理楼层工期与施工顺序
      this.layerData.standardFloorDuration = datas.standardFloorDuration
      this.layerData.refugeFloorDuration = datas.refugeFloorDuration
      this.layerData.nonstandardFloorDuration = datas.nonstandardFloorDuration
      this.standardFloor[0].order = datas.standardProcedure
      this.refugeFloor[0].order = datas.refugeProcedure
      this.nonstandardFloor[0].order = datas.nonstandardProcedure
      this.standardFloor[0].selectFloorNumber = standardFloorSelects
      this.refugeFloor[0].selectFloorNumber = refugeFloorSelects
      this.nonstandardFloor[0].selectFloorNumber = nonstandardFloorSelects
      this.initFloorNumber(true)
    },
    // 工序模板详情
    async getDetailsTemplateWorking(id) {
      const result = await processProgressApi.getDetailsTemplateWorking(id)
      const datas = result.data
      const list = []
      this.formData.templateName = datas.name
      for (let i = 0; i < datas.totalProcedureCount; i++) {
        list.push(i === 0 ? 'N' : `N-${i}`)
      }
      this.layerData.standardFloorDuration = datas.standardFloorDuration
      this.layerData.refugeFloorDuration = datas.refugeFloorDuration
      this.layerData.nonstandardFloorDuration = datas.nonstandardFloorDuration
      this.standardFloor[0].order = list.join(',')
      this.refugeFloor[0].order = list.join(',')
      this.nonstandardFloor[0].order = list.join(',')
      this.refreshTable()
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
    // 选择模板分类
    changeCateogry(cateogry) {
      this.formData.templateId = ''
      this.queryTemplateListWorking(cateogry)
    },
    // 工序模板查询
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
      const templateList = []
      list.map(item => {
        templateList.push({
          label: item.name,
          value: item.id
        })
      })
      this.templateList = templateList
    },
    // 楼层改变
    changeFloor() {
      this.initFloorNumber()
    },
    // 初始化楼层数据
    initFloorNumber(isEdit = false) {
      const floorNumber = []
      for (let i = 1; i <= this.formData.undergroundFloorNum; i++) {
        floorNumber.unshift({
          label: `-${i} 层`,
          value: -i
        })
      }
      for (let i = 1; i <= this.formData.overgroundFloorNum; i++) {
        floorNumber.push({
          label: `${i} 层`,
          value: i
        })
      }
      this.formData.totalFloorNum = floorNumber.length
      this.allFloorNumber = floorNumber
      // 初始化标准层数据
      this.initLayer('standardFloor', isEdit)
      // 初始化避难层数据
      this.initLayer('refugeFloor', isEdit)
      // 初始化非标准层数据
      this.initLayer('nonstandardFloor', isEdit)
    },
    // 初始化层级数据
    initLayer(key, isEdit) {
      // 编辑回显
      if (isEdit) {
        this[key][0].floorNumbers = this.allFloorNumber.filter(e => {
          if (this[key][0].selectFloorNumber.indexOf(e.value) >= 0) {
            return e
          }
        })
        setTimeout(() => {
          this[key][0].floorNumbers = []
        }, 1000)
      } else {
        this[key].map(item => {
          item.floorNumbers = this.allFloorNumber.filter(e => {
            if (this.allSelectFloorNumber.indexOf(e.value) < 0) {
              return e
            }
          })
        })
      }
    },
    // 移除tag
    removeTag(e) {
      const index = this.allSelectFloorNumber.indexOf(e)
      if (index >= 0) {
        this.allSelectFloorNumber.splice(index, 1)
        this.initFloorNumber()
      }
    },
    // 选择标准楼层
    changeLayer(array, key) {
      const newArray = array.sort(function (a, b) {
        return a - b
      })
      this.formData[key] = newArray.join(',')
      newArray.map(item => {
        if (this.allSelectFloorNumber.indexOf(item) < 0) {
          this.allSelectFloorNumber.push(item)
        }
      })
      this.initFloorNumber()
    },
    // 下一步
    toStep() {
      if (this.stepIndex === 1) {
        // 预览不更新
        if (this.isPreview) {
          this.stepIndex = this.stepIndex + 1
          this.getDetailsConfigListWorking()
          return
        }
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            if (this.allSelectFloorNumber.length < this.allFloorNumber.length) {
              this.$message({
                type: 'error',
                message: `标准楼层只选择了 ${this.allSelectFloorNumber.length} 层，还差 ${
                  this.allFloorNumber.length - this.allSelectFloorNumber.length
                } 层没有选择`
              })
              return
            }
            if (this.allSelectFloorNumber.length > this.allFloorNumber.length) {
              this.$message({
                type: 'error',
                message: `标准楼层选择有误，请重新选择`
              })
              return
            }
            this.saveConfigWorking()
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
    // 保存工序配置
    async saveConfigWorking() {
      let result = ''
      if (this.id) {
        result = await processProgressApi.updateConfigWorking(this.formData)
      } else {
        result = await processProgressApi.addConfigWorking(this.formData)
      }
      this.configId = result.data || ''
      if (this.id) {
        this.getDetailsConfigListWorking()
      } else {
        this.queryListWorking()
      }
    },
    // 获取工序列表
    async queryListWorking() {
      const params = {
        templateId: this.formData.templateId,
        page: 1,
        rows: 100
      }
      const result = await processProgressApi.queryListWorking(params)
      const datas = result.data
      const list = datas.records || []
      list.map((item, i) => {
        item.configId = this.configId
        item.selectLayer = [0, 1, 2]
        item.standardFlag = i === 0 ? 1 : 0
        item.refugeFlag = i === 0 ? 1 : 0
        item.nonstandardFlag = i === 0 ? 1 : 0
        item.floorRule = i === 0 ? 'N' : `N-${i}`
      })
      this.configForm = list
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
    },
    // 工序配置明细 选择
    changeConfigDetails(e, array) {
      array.sort()
    },
    // 工序配置明细 下移
    swapConfigDetailsUp(index) {
      this.configForm.splice(index - 1, 0, this.configForm[index])
      this.configForm.splice(index + 1, 1)
    },
    // 工序配置明细 下移
    swapConfigDetailsDown(index) {
      this.configForm.splice(index + 2, 0, this.configForm[index])
      this.configForm.splice(index, 1)
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
    // 保存
    async save() {
      const params = this.initConfigForm()
      await processProgressApi.saveDetailConfigWorking(this.configId, params)
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      this.goBack()
    },
    // 预览
    preview() {
      this.stepIndex = 3
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
      const countFloor = (num = 1, isUnderground = false) => {
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
    width: 800px;
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
    width: 800px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    span {
      flex: 1;
      text-align: center;
      max-width: 33.3333%;
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
