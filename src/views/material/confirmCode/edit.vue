<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑材料确认单' : '新建材料确认单' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="200px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="甲供材编号" prop="supplyPlanCode">
              <el-input v-model="formData.supplyPlanCode" class="form-input" disabled />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-button type="text" size="mini" @click="planVisible = true">选择甲供材计划</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="合同" prop="contractName">
              <el-input v-model="formData.contractName" class="form-input" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="甲供材计划名称" prop="supplyPlanName">
              <el-input v-model="formData.supplyPlanName" class="form-input" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="供应商" prop="secondParty">
              <el-input v-model="formData.secondParty" class="form-input" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="联系人" prop="secondPartyLinkman">
              <el-input v-model="formData.secondPartyLinkman" class="form-input" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="联系人电话" prop="secondPartyMobile">
              <el-input v-model="formData.secondPartyMobile" class="form-input" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="附件" prop="fileId">
              <FileEdit v-model="formData.fileId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="备注">
              <el-input
                v-model="formData.remark"
                class="form-input"
                type="textarea"
                maxlength="200"
                :rows="4"
                placeholder="请输入备注信息"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>材料确认明细</span>
      </div>
      <EditTable
        ref="table"
        v-model="tableData"
        :tableColumn="tableColumn"
        :validRules="validRules"
        :is-add="false"
        :is-remove="false"
        :show-footer="true"
        :border="true"
        :footerColspanMethod="footerColspanMethod"
        :footer-method="footerMethod"
      />
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" size="lg" @click="submit(1)">保存并提交</el-button>
    </div>
    <!-- 选择甲供材计划单 -->
    <!-- showRadio -->
    <SelectPlanList
      v-if="planVisible"
      showRadio
      :checkRowKey="formData.supplyPlanId || ''"
      :visible.sync="planVisible"
      @change="getSelectPlan"
    >
    </SelectPlanList>
  </div>
</template>

<script>
import Api from '../api/confirmCode'
import SelectPlanList from '../planList/components/SelectPlanList'
import overfullList from '@/views/material/confirmCode/lib/overfullList'
export default {
  name: 'Edit',
  components: { SelectPlanList },
  data() {
    // 这里存放数据
    return {
      id: null,
      formData: {},
      formRules: {
        supplyPlanCode: [{ required: true, message: '必填' }],
        contractName: [{ required: true, message: '必填' }],
        supplyPlanName: [{ required: true, message: '必填' }]
      },
      planVisible: false,
      tableData: [],
      editIndex: null,
      overfullList,
      tableColumn: [
        { type: 'seq', title: '序号', width: 100 },
        {
          field: 'itemName',
          title: '名称'
        },
        {
          field: 'model',
          title: '型号'
        },
        {
          field: 'specifications',
          title: '规格'
        },
        {
          field: 'supplyNum',
          title: '计划供应量'
        },
        {
          field: 'lastSupplyNum',
          title: '上期累计量'
        },
        {
          field: 'currentSupplyNum',
          title: '本期供应量',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.editIndex ? (
                <el-input-number v-model={row.currentSupplyNum} controls={false} />
              ) : (
                <span>{row.currentSupplyNum}</span>
              )
            ]
          }
        },
        {
          field: 'currentUnitPrice',
          title: '单价',
          slots: {
            default: ({ row, rowIndex }) => [
              rowIndex === this.editIndex ? (
                <el-input-number v-model={row.currentUnitPrice} controls={false} />
              ) : (
                <span>{row.currentUnitPrice}</span>
              )
            ]
          }
        },
        {
          field: 'total',
          title: '合价',
          slots: {
            default: ({ row }) => [<span>{row.currentUnitPrice * row.currentSupplyNum || 0}</span>]
          }
        },
        {
          field: 'totalSupplyNum',
          title: '本期累积量',
          slots: {
            default: ({ row }) => [<span>{row.lastSupplyNum + row.currentSupplyNum || 0}</span>]
          }
        },
        {
          field: 'overfulfilFlag',
          title: '是否超供',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(this.overfullList, { value: row.overfulfilFlag }), 'label')}</span>
            ]
          }
        },
        {
          field: 'usedPart',
          title: '使用部位'
        },
        {
          field: 'handle',
          title: '操作',
          width: 120,
          slots: {
            default: ({ row, rowIndex }) => [
              this.editIndex === rowIndex ? (
                <div style="display:inline-block">
                  <el-button type="text" onClick={() => this.cancelRow(row, rowIndex)}>
                    取消
                  </el-button>
                  <el-button type="text" onClick={() => this.saveRow(row)}>
                    保存
                  </el-button>
                </div>
              ) : (
                // <el-button type="text" onClick={() => (this.editIndex = rowIndex)}>
                //   编辑
                // </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.editRow(rowIndex)
                  }}
                >
                  编辑
                </el-button>
              )
            ]
          }
        }
      ],
      validRules: {
        currentSupplyNum: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    const { id } = this.$route.params
    this.id = id
    if (id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await Api.detail(this.id)
      this.formData = res.data
      this.tableData = res.data.detailList || []
      this.tableLoading = false
    },
    async getSelectPlan(row) {
      const res = await Api.getMaterialDetail(row.id)
      this.formData = {
        ...this.formData,
        supplyPlanCode: res.data.supplyPlanCode,
        supplyPlanName: res.data.supplyPlanName,
        supplyPlanId: res.data.id,
        contractName: res.data.contractName,
        lastSupplyMoney: res.data.lastSupplyMoney,
        contractId: res.data.contractId,
        secondParty: res.data.secondParty,
        secondPartyLinkman: res.data.secondPartyLinkman,
        secondPartyMobile: res.data.consigneeMobile
      }
      let detailList = _.clone(res.data.detailList)
      let cloneData =
        detailList &&
        detailList.map(d => {
          return {
            contractId: d.contractId,
            supplyPlanId: row.id,
            materialId: d.materialId,
            supplyDetailId: d.id,
            itemName: d.itemName,
            model: d.model,
            specifications: d.specifications,
            supplyNum: d.supplyNum,
            lastSupplyNum: d.lastSupplyNum,
            usedPart: d.usedPart
          }
        })
      this.tableData = cloneData || []
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    cancelRow(row) {
      this.$refs.table.$refs.table.$refs.vxeTable.revertData(row)
      this.editIndex = null
    },
    async saveRow(row) {
      await this.$refs.table.$refs.table.$refs.vxeTable.validate(row)
      row.totalSupplyNum = row.currentSupplyNum + row.lastSupplyNum
      row.overfulfilFlag = row.totalSupplyNum > row.supplyNum ? 1 : 0
      this.$refs.table.$refs.table.$refs.vxeTable.reloadRow(row)
      this.editIndex = null
      this.updateFooter()
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['itemName'].includes(column.property)) {
            return (
              data.reduce(
                (acc, cur) => acc + _.get(cur, 'currentUnitPrice', 0) * _.get(cur, 'currentSupplyNum', 0),
                0
              ) || 0
            )
          }
          return null
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '应付款'
          }
          if (['itemName'].includes(column.property)) {
            return (
              data.reduce(
                (acc, cur) => acc + _.get(cur, 'currentUnitPrice', 0) * _.get(cur, 'currentSupplyNum', 0),
                0
              ) || 0
            )
          }
          return null
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '上期已付款'
          }
          if (['itemName'].includes(column.property)) {
            return this.formData.lastSupplyMoney
          }
          return null
        })
      ]
    },
    footerColspanMethod({ columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: 1,
          colspan: 7
        }
      } else if (columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 6
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    updateFooter() {
      this.$refs.table.$refs.table.$refs.vxeTable.updateFooter()
    },
    // goList(id) {
    //   this.$router.push({ name: `MaterialConfirmCode`, query: { contractId: '123' } })
    // },
    editRow(index) {
      if (this.editIndex !== null) {
        this.$message.error('请结束编辑')
        return
      }
      this.editIndex = index
    },
    async submit(isAudit) {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          if (this.editIndex || this.editIndex === 0) {
            this.$message.error('请结束编辑')
            return
          }
          await this.$refs.table.$refs.table.$refs.vxeTable.validate()
          let form = { ...this.formData, ...{ detailList: this.tableData } }
          if (isAudit) {
            await Api.saveSubmit(form)
          } else {
            this.$route.params.id ? await Api.update(form) : await Api.add(form)
          }
          // if (isAudit) {
          //   let audit = this.$route.params.id
          //     ? await Api.submitAudit(this.$route.params.id)
          //     : await Api.submitAudit(res.data)
          // }
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.form-con {
  padding-right: 15%;
}
.form-input {
  width: 100%;
  /deep/.el-input__inner {
    text-align: left;
  }
}
.inline-input {
  width: 30%;
  display: inline-block;
}
</style>
