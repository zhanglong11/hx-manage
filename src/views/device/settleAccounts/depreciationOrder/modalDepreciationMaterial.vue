<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: b3a4aa7c259c85548859d00bdc08c147853936bc
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 选择采购单和采购明细模态框组件开发，列表接口对接、新增接口对接、删除接口对接
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 6e98fe97b280b74fa36674b9250888b51c321c05
@代码提交修改日期: 2020-03-12
@任务类型: 修改代码，物资折旧单 选择采购单和采购明细模态框组件样式细节调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog width="1080px" :title="'选择物资'" :visible="visible" @open="handleLoad" @close="handleCancel">
    <div class="step-des">
      <div class="step-des-one" :class="{ 'cur-step': step === 1 }">
        <div class="step-des-num cur-step-num">1</div>
        <div class="cur-step-txt">步骤1</div>
        <div>选择采购单</div>
      </div>
      <div class="step-des-line"></div>
      <div class="step-des-two" :class="{ 'cur-step': step === 2 }">
        <div class="step-des-num cur-step-num">2</div>
        <div class="cur-step-txt">步骤2</div>
        <div>选择采购单中的明细</div>
      </div>
    </div>

    <div v-show="step === 1">
      <vxe-table
        size="mini"
        border
        resizable
        show-overflow
        :data="tableData"
        :loading="loading"
        @radio-change="radioPurchaseChangeEvent"
      >
        <vxe-table-column type="radio" width="50"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
        <vxe-table-column field="dispatchCode" title="采购单编号"></vxe-table-column>
        <vxe-table-column field="planCode" title="需用计划编号"></vxe-table-column>
        <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
        <vxe-table-column field="contractCode" title="合同编号"></vxe-table-column>
        <vxe-table-column field="purchaseAmount" title="采购单金额(元)"></vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
        <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
        <vxe-table-column field="status" title="状态">
          <template v-slot="{ row }">
            <span v-if="row.status === 0">草稿</span>
            <span v-else-if="row.status === 1">待审核</span>
            <span v-else-if="row.status === 2">已通过</span>
            <span v-else-if="row.status === 3">已驳回</span>
          </template>
        </vxe-table-column>
      </vxe-table>
      <vxe-pager
        border
        size="mini"
        :loading="loading"
        :current-page="page"
        :page-size="rows"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </div>

    <div v-show="step === 2">
      <vxe-table
        size="mini"
        border
        resizable
        show-overflow
        :data="tableDataDetail"
        :loading="loadingDetail"
        @radio-change="radioPurchaseDetailChangeEvent"
      >
        <vxe-table-column type="radio" width="50"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
        <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
        <vxe-table-column field="materialName" title="名称"></vxe-table-column>
        <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="dispatchAmount" title="采购数量"></vxe-table-column>
        <vxe-table-column field="unitPrice" title="合同单价(元)"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="合价"></vxe-table-column>
        <vxe-table-column field="materialType" title="类别">
          <template v-slot="{ row }">
            <span v-if="row.materialType === 1">材料</span>
            <span v-else-if="row.materialType === 2">机械</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="materialKind" title="物资种类">
          <template v-slot="{ row }">
            <span v-if="row.materialKind === 1">耗材</span>
            <span v-else-if="row.materialKind === 2">周材</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <template v-if="step === 1">
        <el-button type="primary" @click="handleNext">下一步</el-button>
      </template>
      <template v-if="step === 2">
        <el-button @click="handlePrev">上一步</el-button>
        <el-button type="primary" @click="handleEnter">确定</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/goodsPlan/purchaseOrder'
export default {
  name: 'ModalDepreciationMaterial',
  props: {
    visible: Boolean
  },
  data() {
    return {
      step: 1,

      tableData: [],
      loading: false,
      purchase: null,
      page: 1,
      rows: 10,
      total: 0,

      tableDataDetail: [],
      loadingDetail: false,
      purchaseDetail: null
    }
  },
  methods: {
    radioPurchaseChangeEvent({ row }) {
      this.purchase = row
    },
    radioPurchaseDetailChangeEvent({ row }) {
      this.purchaseDetail = row
    },
    refresh(page, rows) {
      this.loading = true
      Api.getPurchaseOrderList({
        projectId: localStorage.getItem('projectId'),
        type: '1', //代表采购单
        status: '2', //查询已通过的
        page,
        rows
      }).then(res => {
        //console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.page = page
        this.rows = rows
      })
    },
    handleLoad() {
      this.refresh(1, this.rows)
    },
    handlePageChange({ currentPage, pageSize }) {
      this.refresh(currentPage, pageSize)
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.step = 1
    },
    handleNext() {
      if (this.purchase) {
        this.loadingDetail = true
        Api.getPurchaseOrderDetail(this.purchase.id).then(res => {
          //console.log(res)
          let data = res.data
          if (data && data.list && data.list.length) {
            this.tableDataDetail = data.list
            this.loadingDetail = false
            this.step = 2
          }
        })
      } else {
        this.$message.error('请选择采购单')
      }
    },
    handlePrev() {
      this.step = 1
    },
    handleEnter() {
      if (this.purchaseDetail) {
        this.step = 1
        this.$emit('update:visible', false)
        this.$emit('optionSelectRecord', this.purchaseDetail)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    }
  }
}
</script>

<style scoped lang="less">
.step-des {
  display: flex;
  justify-content: space-evenly;
  color: #999999;
  position: relative;
  margin-bottom: 30px;

  .step-des-line {
    position: absolute;
    width: 282px;
    margin-left: -188px;
    height: 1px;
    background: #e5e5e5;
    left: 50%;
    top: 9px;
  }

  .step-des-one,
  .step-des-two {
    margin-left: 36px;
    position: relative;
  }

  .step-des-num {
    width: 30px;
    height: 30px;
    border: solid 1px #e5e5e5;
    border-radius: 50%;
    text-align: center;
    line-height: 28px;
    position: absolute;
    top: -5px;
    left: -36px;
  }

  .cur-step {
    .cur-step-num {
      border-color: #409eff;
      background: #409eff;
      color: #fff;
    }
    .cur-step-txt {
      color: #666666;
      font-weight: bold;
    }
  }
}
</style>
