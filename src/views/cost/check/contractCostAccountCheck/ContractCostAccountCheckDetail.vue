<!--
* @任务编号: 2824 || 成本核算页面开发
* @开发人员:张龙
* @日期:2020-03-06
* @任务类型:修改代码
-->
<template>
  <div class="main">
    <!-- 流程图 start -->
    <ViewFlow :id="$route.params.id" />
    <!-- 流程图 end -->
    <div class="header">
      <span class="label">成本核算状态：</span>
      <span>{{ _.get(_.find(paramList.manageSystemStatus, { value: orderInfo.status }), 'label') }}</span>
    </div>
    <div class="content">
      <div class="tree">
        <div class="tooltips">
          <el-form ref="treeQuery" :model="treeQuery" inline>
            <el-form-item label="" prop="search">
              <el-input v-model="treeQuery.search" placeholder="请输入">
                <i slot="suffix" class="el-icon-search" />
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-tree
          :expand-on-click-node="false"
          :props="defaultProps"
          default-expand-all
          show-checkbox
          :data="treeData"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="table-info">
        <el-card>
          <div slot="header" class="card-header">
            <span>清单明细</span>
          </div>
          <EditTable
            v-model="tableData"
            :tableColumn="tableColumn"
            :validRules="validRules"
            :isAdd="false"
            :isRemove="false"
            :border="true"
            :pageShow="true"
          />
        </el-card>
        <el-card v-if="detailVisible">
          <div slot="header" class="card-header">
            <span>工料机明细</span>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="人工指标" name="artificial">
              <VXTable :tableData="artificialData" :columns="artificialColumn" :page-show="false" />
            </el-tab-pane>
            <el-tab-pane label="材料指标" name="material" lazy>
              <el-tabs v-model="materialActiveName">
                <el-tab-pane label="耗材指标" name="material" lazy>
                  <VXTable :tableData="materialData" :columns="materialColumn" :page-show="false" />
                </el-tab-pane>
                <el-tab-pane label="周耗指标" name="weekMaterial" lazy>
                  <VXTable :tableData="materialWeekData" :columns="materialColumn" :page-show="false" />
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="机械指标" name="mechanical" lazy>
              <VXTable :tableData="mechanicalData" :columns="mechanicalColumn" :page-show="false" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
    <section style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>审核</span>
        </div>
        <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
          <el-form-item label="审核结果" prop="auditStatus" style="width: 50%;">
            <el-radio-group v-model="form.auditStatus">
              <el-radio :label="0">同意</el-radio>
              <el-radio :label="1">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="remark " style="width: 50%;">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
          <el-form-item label="附件" prop="file" style="width: 50%;">
            <FileUpload v-model="form.file" />
          </el-form-item>
        </el-form>
      </el-card>
    </section>
    <div class="btn-box">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/api/cost/costAccount'
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
export default {
  name: 'ContractCostAccount',
  mixins: [PageMixin],
  data() {
    return {
      form: {},
      paramList,
      orderInfo: {},
      rules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      },
      treeQuery: {},
      pageQuery: {
        costId: 'a53fb0d0de5543cea8b87af7235bc3d0',
        meteringUnitId: this.curTreeId
      },
      costId: 'a53fb0d0de5543cea8b87af7235bc3d0',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      request: api.inventoryList,
      treeData: [],
      requestFlag: false,
      curTreeId: null,
      payCode: null,
      payType: null,
      detailVisible: false,
      payDetailVisible: false,
      payStepVisible: false,
      activeName: 'artificial',
      materialActiveName: 'material',
      tableData: [],
      inventoryId: null,
      //清单信息
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'itemCode',
          title: '项目编码',
          width: 100
        },
        {
          field: 'itemName',
          title: '项目名称',
          width: 100
        },
        {
          field: 'unit',
          title: '单位',
          width: 80
        },
        //无数据
        {
          field: 'checkName',
          title: '合同单价（元）',
          width: 140
        },
        //无数据
        {
          field: 'type',
          title: '合同数量',
          width: 100
        },
        {
          field: 'updateUnitPrice',
          title: '变更后单价（元）',
          width: 140
        },
        {
          field: 'updateQuantity',
          title: '变更后数量',
          width: 100
        },
        {
          field: 'decomposingQuantity',
          title: '分解量',
          width: 100
        },
        {
          field: 'remark',
          title: '总价（元）',
          width: 100
        },
        //无数据
        {
          field: 'category',
          title: '所属分类',
          width: 100
        },
        {
          field: 'number',
          title: '已核算数量',
          width: 100
        },
        {
          field: 'remark',
          title: '工料机核算单价（元）',
          width: 160
        },
        {
          title: '工料机核算总价（元）',
          children: [
            {
              field: 'personCombinedPrice',
              title: '人',
              width: 100
            },
            {
              field: 'materialCombinedPrice',
              title: '材料',
              width: 100
            },
            {
              field: 'machineCombinedPrice',
              title: '机械',
              width: 100
            },
            {
              field: 'remark',
              title: '合计',
              width: 100
            }
          ]
        },
        {
          field: '',
          title: '操作',
          width: 120,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.showDetail(row.id)}>
                  查看
                </el-button>
              ]
            }
          }
        }
      ],
      validRules: {
        name: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      },
      //人工指标
      artificialData: [],
      artificialColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'quotaCode',
          title: '定额编号',
          width: 100
        },
        {
          field: 'quotaName',
          title: '定额名称',
          width: 100
        },
        {
          field: 'quotaName',
          title: '类别',
          width: 100
        },
        {
          field: 'categoryCode',
          title: '类别编码',
          width: 100
        },
        {
          field: 'categoryName',
          title: '类别名称',
          width: 100
        },
        {
          field: 'specificationsModels',
          title: '规格及型号',
          width: 100
        },
        {
          field: 'unit',
          title: '单位',
          width: 100
        },
        //无数据
        {
          field: 'calculateQuanlity',
          title: '本次实际数量',
          width: 140
        },
        {
          field: 'calculateUnitPrice',
          title: '本次实际单价（元）',
          width: 160
        },
        {
          field: 'type',
          title: '本次实际合价（元）',
          width: 160
        }
      ],
      //材料指标
      materialData: [],
      materialWeekData: [],
      materialColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'quotaCode',
          title: '定额编号',
          width: 100
        },
        {
          field: 'checkName',
          title: '定额名称',
          width: 100
        },
        {
          field: 'checkName',
          title: '类别',
          width: 100
        },
        {
          field: 'categoryCode',
          title: '类别编码',
          width: 100
        },
        {
          field: 'categoryName',
          title: '类别名称',
          width: 100
        },
        {
          field: 'specificationsModels',
          title: '规格及型号',
          width: 100
        },
        {
          field: 'unit',
          title: '单位',
          width: 100
        },
        {
          field: 'calculateQuanlity',
          title: '数量',
          width: 100
        },
        {
          field: 'calculateUnitPrice',
          title: '单价（元）',
          width: 100
        },
        {
          field: 'type',
          title: '合价（元）',
          width: 100
        },
        {
          field: 'realQuanlity',
          title: '实际数量',
          width: 100
        },
        {
          field: 'realUnitPrice',
          title: '实际单价（元）',
          width: 140
        },
        {
          field: 'realCombinedPrice',
          title: '实际合价（元）',
          width: 140
        }
      ],
      //机械指标
      mechanicalData: [],
      mechanicalColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'quotaCode',
          title: '定额编号',
          width: 100
        },
        {
          field: 'checkName',
          title: '定额名称',
          width: 100
        },
        {
          field: 'checkName',
          title: '类别',
          width: 100
        },
        {
          field: 'categoryCode',
          title: '类别编码',
          width: 100
        },
        {
          field: 'categoryName',
          title: '类别名称',
          width: 100
        },
        {
          field: 'specificationsModels',
          title: '规格及型号',
          width: 100
        },
        {
          field: 'unit',
          title: '单位',
          width: 100
        },
        {
          field: 'calculateQuanlity',
          title: '数量',
          width: 100
        },
        {
          field: 'calculateUnitPrice',
          title: '单价（元）',
          width: 100
        },
        {
          field: 'type',
          title: '合价（元）',
          width: 100
        },
        {
          field: 'realQuanlity',
          title: '实际数量',
          width: 100
        },
        {
          field: 'realUnitPrice',
          title: '实际单价（元）',
          width: 140
        },
        {
          field: 'realCombinedPrice',
          title: '实际合价（元）',
          width: 140
        }
      ]
    }
  },
  created() {
    this.getTreeData()
    this.getInfo()
  },
  methods: {
    async getTreeData() {
      let res = await api.tree({ costId: this.costId })
      this.treeData = res.data
      this.pageQuery.meteringUnitId = res.data[0].id
      this.getList()
    },
    async getInfo() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
    },
    async getQuantity() {
      let query = { inventoryId: this.inventoryId, costId: this.costId }
      let artificialDataRes = await api.quantityList({ ...query, ...{ type: 1 } })
      let mechanicalDataRes = await api.quantityList({ ...query, ...{ type: 3 } })
      let materialDataRes = await api.quantityList({ ...query, ...{ type: 6 } })
      let materialWeekDataRes = await api.quantityList({ ...query, ...{ type: 7 } })
      this.artificialData = artificialDataRes.data.records
      this.mechanicalData = mechanicalDataRes.data.records
      this.materialData = materialDataRes.data.records //耗材
      this.materialWeekData = materialWeekDataRes.data.records //周耗材
    },
    reset() {},
    refresh() {},
    cancel() {
      this.$router.back()
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = api.audit(this.$route.query.id, this.form.auditStatus)
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    saveDetail(row) {
      console.log(row)
    },
    showDetail(inventoryId) {
      this.detailVisible = true
      this.inventoryId = inventoryId
      this.getQuantity()
    },
    showPayDetail(code, type) {
      this.payType = type
      this.payCode = code
      this.payDetailVisible = true
    },
    hidePayDetail() {
      this.payDetailVisible = false
    },
    showStep() {
      this.payStepVisible = true
    },
    handleNodeClick(item) {
      this.curTreeId = item.id
      this.pageQuery.meteringUnitId = item.id
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
div.main {
  .header {
    text-align: right;
    padding-bottom: 10px;
    font-size: 18px;
    .label {
      color: #747474;
    }
  }
  .content {
    display: flex;
    background: #f0f2f5;
    .tree {
      flex: 0 0 400px;
      background: #fff;
    }
    .table-info {
      flex: 1;
      overflow-y: auto;
    }
  }
}
</style>
