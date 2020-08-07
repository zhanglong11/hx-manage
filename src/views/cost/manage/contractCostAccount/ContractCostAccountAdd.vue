<!--
* @任务编号: 2824 || 成本核算页面开发
* @开发人员:张龙
* @日期:2020-03-06
* @任务类型:修改代码
-->
<!--
* @任务编号: 2824 || 树接口调用
* @开发人员:张龙
* @日期:2020-03-10
* @任务类型:全新代码
-->
<!--
* @任务编号: 2824 ||合同信息接口对接
* @开发人员:张龙
* @日期:2020-03-11
* @任务类型:全新代码
-->
<template>
  <div class="main">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div v-if="isDetail" class="header">
      <span class="label">成本核算状态：</span>
      <span>{{ _.get(_.find(paramList.manageSystemStatus, { value: orderInfo.status }), 'label') }}</span>
    </div>
    <div :class="`content ${isDetail ? 'isDetail' : ''}`">
      <div class="tree">
        <div class="tooltips">
          <el-form ref="treeQuery" :model="treeQuery" inline>
            <el-form-item label="" prop="search">
              <el-input v-model="treeSearch" placeholder="请输入">
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
          class="unit-tree"
          :expand-on-click-node="false"
          :props="defaultProps"
          default-expand-all
          :data="treeList"
          :render-content="renderContent"
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
            :total="total"
            :validRules="validRules"
            :isAdd="false"
            :isRemove="false"
            :border="true"
            :pageShow="true"
            @getList="getList"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
          />
        </el-card>
        <el-card v-if="detailVisible">
          <div slot="header" class="card-header">
            <span>工料机明细</span>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="人工指标" name="artificial" lazy>
              <VXTable
                ref="artificialRef"
                row-id="id"
                :tableData="artificialData"
                :columns="artificialColumn"
                :page-show="false"
              />
            </el-tab-pane>
            <el-tab-pane label="材料指标" name="material" lazy>
              <el-tabs v-model="materialActiveName">
                <el-tab-pane label="耗材指标" name="monthMaterial" lazy>
                  <VXTable row-id="id" :tableData="materialData" :columns="materialColumn" :page-show="false" />
                </el-tab-pane>
                <el-tab-pane label="周材指标" name="weekMaterial" lazy>
                  <VXTable row-id="id" :tableData="materialWeekData" :columns="materialWeekColumn" :page-show="false" />
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="机械指标" name="mechanical" lazy>
              <VXTable row-id="id" :tableData="mechanicalData" :columns="mechanicalColumn" :page-show="false" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
    <!--    <AuditForm v-if="isAudit" ref="audit" :disabled="orderInfo.status !== 1" />-->
    <!--    <div class="footerButton">-->
    <!--      <el-button @click="cancel">返回列表</el-button>-->
    <!--      <el-button v-if="!isDetail" type="primary" @click="submit">提交</el-button>-->
    <!--    </div>-->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <template v-if="!isCheck">
        <el-button @click="cancel">返回</el-button>
        <el-button v-if="orderInfo.status === 0 && !isDetail" type="primary" @click="submit">提交</el-button>
      </template>
      <template v-else>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
    <!--    <div class="footerButton">-->
    <!--      <el-button v-if="!isCheck" @click="cancel">返回</el-button>-->
    <!--      <el-button v-if="!isCheck" type="primary" @click="submit">提交</el-button>-->
    <!--      <template v-else>-->
    <!--        <el-button @click="cancel">取消</el-button>-->
    <!--        <el-button type="primary" @click="approval()">确定</el-button>-->
    <!--      </template>-->
    <!--    </div>-->
    <PersonPayDialog
      v-if="personVisible"
      :visible.sync="personVisible"
      :payId="payId"
      :payCode="payCode"
      :inventoryId="inventoryId"
      :costId="costId"
      :curTreeId="curTreeId"
      :isDetail="isDetail"
    />
    <MaterialPayDialog
      v-if="materialVisible"
      :visible.sync="materialVisible"
      :payId="payId"
      :payCode="payCode"
      :inventoryId="inventoryId"
      :costId="costId"
      :curTreeId="curTreeId"
      :isDetail="isDetail"
    />
    <MechanicalPayDialog
      v-if="mechanicalVisible"
      :visible.sync="mechanicalVisible"
      :payId="payId"
      :payCode="payCode"
      :inventoryId="inventoryId"
      :costId="costId"
      :curTreeId="curTreeId"
      :payType="payType"
      :isDetail="isDetail"
    />
  </div>
</template>
<script>
import PersonPayDialog from './components/PersonPayDialog'
import api from '@/api/cost/costAccount'
import PageMixin from '@/mixins/pageMixin'
import MechanicalPayDialog from './components/MechanicalPayDialog'
import MaterialPayDialog from './components/MaterialPayDialog'
import treeFilter from '@/utils/treeFilter'
import paramList from '@/lib/paramList'
export default {
  name: 'ContractCostAccount',
  components: { PersonPayDialog, MechanicalPayDialog, MaterialPayDialog },
  mixins: [PageMixin],
  data() {
    return {
      treeQuery: {},
      treeSearch: '',
      paramList,
      pageQuery: {
        costId: this.$route.params.id,
        meteringUnitId: this.curTreeId,
        module: 'adjust_accounts',
        page: 1,
        rows: 10
      },
      costId: this.$route.params.id,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      orderInfo: {},
      request: api.inventoryList,
      treeData: [],
      treeList: [],
      requestFlag: false,
      detailVisible: false,
      curTreeId: null,
      payCode: null,
      payId: null,
      payType: null,
      editIndex: null,
      personVisible: false,
      materialVisible: false,
      mechanicalVisible: false,
      activeName: 'artificial',
      materialActiveName: 'monthMaterial',
      tableData: [],
      inventoryId: null,
      //清单信息
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'itemCode',
          title: '项目编码',
          minWidth: 100
        },
        {
          field: 'itemName',
          title: '项目名称',
          minWidth: 100
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 80
        },
        {
          field: 'comprehensiveUnitPrice',
          title: '合同单价（元）',
          minWidth: 140
        },
        {
          field: 'quantity',
          title: '合同数量',
          minWidth: 100
        },
        {
          field: 'updateUnitPrice',
          title: '变更后单价（元）',
          minWidth: 140
        },
        {
          field: 'updateQuantity',
          title: '变更后数量',
          minWidth: 100
        },
        {
          field: 'decomposingQuantity',
          title: '分解量',
          minWidth: 100
        },
        {
          field: 'combinedPrice',
          title: '总价（元）',
          minWidth: 100
        },
        {
          field: 'category',
          title: '所属分类',
          minWidth: 100
        },
        {
          field: 'accumulativeQuantity',
          title: '累计核算数量',
          minWidth: 120
        },
        {
          field: 'realQuanlity',
          title: '本次核算数量',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.editIndex ? (
                <el-input-number
                  v-model={row.realQuanlity}
                  controls={false}
                  max={row.decomposingQuantity - (row?.accumulativeQuantity || 0)}
                />
              ) : (
                <span>{row.realQuanlity}</span>
              )
            ]
          },
          minWidth: 100
        },
        {
          field: 'quantityMachineUnitPrice',
          title: '本次工料机核算单价（元）',
          slots: {
            default: ({ row }) => [
              <span>
                {row.realQuanlity
                  ? (
                      (row.personCombinedPrice + row.materialCombinedPrice + row.machineCombinedPrice) /
                      row.realQuanlity
                    ).toFixed(2)
                  : ''}
              </span>
            ]
          },
          minWidth: 180
        },
        {
          title: '本次工料机核算总价（元）',
          children: [
            {
              field: 'personCombinedPrice',
              title: '人',
              slots: {
                default: ({ row }) => [<span>{row.personCombinedPrice.toFixed(2)}</span>]
              },
              minWidth: 100
            },
            {
              field: 'materialCombinedPrice',
              title: '材料',
              slots: {
                default: ({ row }) => [<span>{row.materialCombinedPrice.toFixed(2)}</span>]
              },
              minWidth: 100
            },
            {
              field: 'machineCombinedPrice',
              title: '机械',
              slots: {
                default: ({ row }) => [<span>{row.machineCombinedPrice.toFixed(2)}</span>]
              },
              minWidth: 100
            },
            {
              field: 'remark',
              title: '合计',
              minWidth: 100,
              slots: {
                default: ({ row }) => [
                  <span>
                    {(row.personCombinedPrice + row.materialCombinedPrice + row.machineCombinedPrice).toFixed(2)}
                  </span>
                ]
              }
            }
          ]
        },
        {
          field: '',
          title: '操作',
          width: 160,
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              return [
                !this.isDetail ? (
                  rowIndex === this.editIndex ? (
                    <div style="display:inline-block">
                      <el-button type="text" onClick={() => (this.editIndex = null)}>
                        取消
                      </el-button>
                      <el-button type="text" onClick={() => this.saveDetail(row)}>
                        保存
                      </el-button>
                    </div>
                  ) : (
                    <el-button type="text" onClick={() => (this.editIndex = rowIndex)}>
                      编辑
                    </el-button>
                  )
                ) : null,
                <el-button type="text" onClick={() => this.showDetail(row.itemCode)}>
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
          minWidth: 100
        },
        {
          field: 'quotaName',
          title: '定额名称',
          minWidth: 100
        },
        {
          field: 'quotaName',
          title: '类别',
          slots: {
            default: () => [<span>人</span>]
          },
          minWidth: 100
        },
        {
          field: 'categoryCode',
          title: '类别编码',
          minWidth: 100
        },
        {
          field: 'categoryName',
          title: '类别名称',
          minWidth: 100
        },
        {
          field: 'specificationsModels',
          title: '规格及型号',
          minWidth: 100
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 100
        },
        {
          field: 'realCombinedPrice',
          title: '实际合价（元）',
          minWidth: 140
        },
        {
          field: 'handle',
          title: '操作',
          width: 160,
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.showPersonDialog(row, 'personVisible')}>
                  选择支付明细
                </el-button>
              ]
            }
          }
        }
      ],
      //材料指标
      materialData: [],
      materialColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'quotaCode',
          title: '定额编号',
          minWidth: 100
        },
        {
          field: 'quotaName',
          title: '定额名称',
          minWidth: 100
        },
        {
          field: 'checkName',
          title: '类别',
          slots: {
            default: () => [<span>材</span>]
          },
          minWidth: 100
        },
        {
          field: 'categoryCode',
          title: '类别编码',
          minWidth: 100
        },
        {
          field: 'categoryName',
          title: '类别名称',
          minWidth: 100
        },
        {
          field: 'specificationsModels',
          title: '规格及型号',
          minWidth: 100
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 100
        },
        {
          field: 'realQuanlity',
          title: '实际数量',
          slots: {
            default: ({ row }) => [<InputNumberCommon v-model={row.realQuanlity} />]
          },
          minWidth: 100
        },
        {
          field: 'realUnitPrice',
          title: '实际单价（元）',
          slots: {
            default: ({ row }) => [<span>{_.round(row.realCombinedPrice / row.realQuanlity, 2) || ''}</span>]
          },
          minWidth: 140
        },
        {
          field: 'realCombinedPrice',
          title: '实际合价（元）',
          slots: {
            default: ({ row }) => [<InputNumberCommon v-model={row.realCombinedPrice} />]
          },
          minWidth: 140
        },
        {
          field: 'handle',
          title: '操作',
          width: 160,
          slots: {
            default: ({ row }) => [
              <el-button type="text" onClick={() => this.saveRowDetail(row, true)}>
                保存
              </el-button>
            ]
          }
        }
      ],
      //周耗材
      materialWeekData: [],
      materialWeekColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'quotaCode',
          title: '定额编号',
          minWidth: 100
        },
        {
          field: 'quotaName',
          title: '定额名称',
          minWidth: 100
        },
        {
          field: 'categoryName',
          title: '类别',
          slots: {
            default: () => [<span>材</span>]
          },
          minWidth: 100
        },
        {
          field: 'categoryCode',
          title: '类别编码',
          minWidth: 100
        },
        {
          field: 'categoryName',
          title: '类别名称',
          minWidth: 100
        },
        {
          field: 'specificationsModels',
          title: '规格及型号',
          minWidth: 100
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 100
        },
        // {
        //   field: 'calculateQuanlity',
        //   title: '数量',
        //   minWidth: 100
        // },
        // {
        //   field: 'calculateUnitPrice',
        //   title: '单价（元）',
        //   minWidth: 100
        // },
        // {
        //   field: 'type',
        //   title: '合价（元）',
        //   slots: {
        //     default: ({ row }) => [<span>{row.calculateQuanlity * row.calculateUnitPrice}</span>]
        //   },
        //   minWidth: 100
        // },
        // {
        //   field: 'realQuanlity',
        //   title: '实际数量',
        //   minWidth: 100
        // },
        // {
        //   field: 'realUnitPrice',
        //   title: '实际单价（元）',
        //   minWidth: 140
        // },
        {
          field: 'realCombinedPrice',
          title: '实际合价（元）',
          minWidth: 140,
          slots: {
            default: ({ row }) => [<InputNumberCommon v-model={row.realCombinedPrice} />]
          }
        },
        {
          field: 'handle',
          title: '操作',
          width: 160,
          slots: {
            default: ({ row }) => [
              <el-button type="text" onClick={() => this.saveRowDetail(row)}>
                保存
              </el-button>
            ]
          }
        }
      ],
      //机械指标
      mechanicalData: [],
      mechanicalColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'quotaCode',
          title: '定额编号',
          minWidth: 100
        },
        {
          field: 'quotaName',
          title: '定额名称',
          minWidth: 100
        },
        {
          field: 'checkName',
          title: '类别',
          slots: {
            default: () => [<span>机</span>]
          },
          minWidth: 100
        },
        {
          field: 'categoryCode',
          title: '类别编码',
          minWidth: 100
        },
        {
          field: 'categoryName',
          title: '类别名称',
          minWidth: 100
        },
        {
          field: 'specificationsModels',
          title: '规格及型号',
          minWidth: 100
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 100
        },
        {
          field: 'realCombinedPrice',
          title: '实际合价（元）',
          slots: {
            default: ({ row }) => [<InputNumberCommon v-model={row.realCombinedPrice} />]
          },
          minWidth: 140
        },
        {
          field: 'handle',
          title: '操作',
          width: 160,
          slots: {
            default: ({ row }) => [
              <el-button type="text" onClick={() => this.saveRowDetail(row)}>
                保存
              </el-button>
            ]
          }
        }
      ]
    }
  },
  watch: {
    treeSearch(v) {
      this.refresh(v)
    }
  },
  created() {
    let { id, isCheck, isEdit, isDetail } = this.$route.params
    this.isCheck = isCheck
    this.isEdit = isEdit
    this.isDetail = isDetail
    this.id = id
    this.getTreeData()
    if (isEdit || isDetail) {
      this.getInfo()
    }
  },
  methods: {
    async getTreeData() {
      let res = await api.tree({ costId: this.costId, module: 'adjust_accounts' })
      this.treeData = res.data
      this.treeList = res.data
      // this.pageQuery.meteringUnitId = res.data[0].meteringUnitId
      // this.getList()
    },
    async getInfo() {
      let res = await api.detail(this.$route.params.id)
      this.orderInfo = res.data
    },
    reset() {
      this.treeSearch = ''
    },
    refresh(name) {
      let data = _.cloneDeep(this.treeData)
      this.treeList = treeFilter(data, e => e.name.includes(name))
    },
    async getQuantity() {
      let query = {
        itemCode: this.inventoryId,
        costId: this.costId,
        module: 'adjust_accounts',
        meteringUnitId: this.curTreeId
      }
      //人工
      let artificialDataRes = await api.quantityList({ ...query, ...{ type: 1 } })
      //机械
      let mechanicalDataRes = await api.quantityList({ ...query, ...{ type: 3 } })
      //耗材
      let materialDataRes = await api.quantityList({ ...query, ...{ type: 2, materialType: 1 } })
      //周耗材
      let materialWeekDataRes = await api.quantityList({ ...query, ...{ type: 2, materialType: 2 } })
      //人工
      this.artificialData = artificialDataRes.data.records
      //机械
      this.mechanicalData = mechanicalDataRes.data.records
      //耗材
      this.materialData = materialDataRes.data.records
      //周耗材
      this.materialWeekData = materialWeekDataRes.data.records
    },

    renderContent(h, { node, data, store }) {
      // return <div class={`tree-item  ${data.children && data.children.length ? 'disabled' : ''}`}>{data.name}</div>
      return (
        <div
          class={`tree-item ${data.meteringUnitId === this.curTreeId ? 'isActive' : ''} ${
            data.children && data.children.length ? 'disabled' : ''
          }`}
        >
          {data.name}
        </div>
      )
    },
    cancel() {
      this.$router.back()
    },
    async submit() {
      let res = await api.submitAudit(this.$route.params.id)
      if (res.code !== 200) {
        return
      }
      this.$message.success('操作成功')
      this.$router.back()
    },
    async saveDetail(row) {
      if (!row.realQuanlity) {
        this.$message.error('请输入本次核算数量')
        return
      }
      const price = row.updateUnitPrice || row.comprehensiveUnitPrice
      const res = await api.updateQuantityList({
        id: row.id,
        realQuanlity: row.realQuanlity,
        realUnitPrice: price,
        realCombinedPrice: row.realQuanlity * price
      })
      this.$message.success('操作成功')
      this.editIndex = null
    },
    showDetail(inventoryId) {
      this.detailVisible = true
      this.inventoryId = inventoryId
      this.getQuantity()
    },
    showPayDetail(row, type, payType) {
      this.payCode = row.categoryCode
      this.payId = row.id
      this.payType = payType
      this[type] = true
    },
    showPersonDialog(row) {
      this.payCode = row.categoryCode
      this.payId = row.id
      this.personVisible = true
    },
    async saveRowDetail(row, isMaterial) {
      if (isMaterial) {
        if (!row.realQuanlity || !row.realCombinedPrice) {
          this.$message.error('请填写完整')
          return
        }
        await api.saveList({
          id: row.id,
          categoryCode: row.categoryCode,
          itemCode: this.inventoryId,
          costId: this.costId,
          meteringUnitId: this.curTreeId,
          realQuanlity: row.realQuanlity,
          realUnitPrice: _.round(row.realCombinedPrice / row.realQuanlity, 2),
          realCombinedPrice: row.realCombinedPrice
        })
      } else {
        if (!row.realCombinedPrice) {
          this.$message.error('请填写完整')
          return
        }
        await api.saveList({
          id: row.id,
          categoryCode: row.categoryCode,
          itemCode: this.inventoryId,
          costId: this.costId,
          meteringUnitId: this.curTreeId,
          realCombinedPrice: row.realCombinedPrice
        })
      }
      this.$message.success('操作成功')
      await this.getQuantity()
    },
    handleNodeClick(item) {
      if (item.children && item.children.length) {
        // this.curTreeId = null
        return
      }
      this.editIndex = null
      this.detailVisible = false
      this.curTreeId = item.meteringUnitId
      this.pageQuery.meteringUnitId = item.meteringUnitId
      this.getList()
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>
<style lang="less" scoped>
div.main {
  /*height: calc(100vh - 300px) !important;*/
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
    /*height: calc(100% - 60px);*/
    /*&.isDetail {*/
    /*  height: calc(100% - 100px);*/
    /*}*/
    /*overflow: hidden;*/
    .tree {
      flex: 0 0 420px;
      overflow-y: auto;
      background: #fff;
    }
    .table-info {
      flex: 1;
      margin-bottom: 50px;
      overflow-y: auto;
    }
  }
}
.unit-tree {
  /*/deep/ .is-current > .el-tree-node__content {*/
  /*  background-color: #9ecafd;*/
  /*}*/
  /*/deep/ .el-tree-node__content:hover {*/
  /*  background-color: #c1d6f3;*/
  /*}*/
  /deep/.tree-item {
    &.disabled {
      cursor: not-allowed;
      color: #dcdfe6;
    }
    &.isActive {
      /*background: #6e8ab0;*/
      color: #4b99b0;
    }
  }
}
</style>
