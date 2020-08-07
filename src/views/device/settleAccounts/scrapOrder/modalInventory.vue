<!--
@任务名称: 2623/物资报废处理单遗留问题
@开发人员: 董渊海
@创建日期: 2020-02-12
@任务类型: 全新代码

@修改日期: 2020-03-16
@任务类型: 修改代码，对接模态框库存物资列表接口，修改比例(90%)

@修改日期: 2020-03-16
@任务类型: 修改代码，添加记录重复校验，修改比例(8%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: c168eaca35978f92de892657dd54701bdaaed203
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单 对接 列表接口(100%)、新增接口、编辑接口、保存提交功能、删除接口、详情接口、模态框选择剩余库存物资列表接口
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 8da7d9a2516771f5ef9782fc514be72d8c3514da
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单 添加报废处理数量校验、报废处理单价校验、选择报废物资明细记录是否重复校验
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog width="1080px" :title="'请选择'" :visible="visible" @open="handleOpen" @close="handleCancel">
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="编码/名称/规格型号/单位/库存数量/平均单价/合价"
              style="width: 330px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <vxe-table
      ref="xTable"
      size="mini"
      border
      resizable
      show-overflow
      :data="tableData"
      :loading="loading"
      @radio-change="radioChangeEvent"
    >
      <vxe-table-column type="radio" width="50"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
      <vxe-table-column field="materialName" title="名称" show-overflow="title"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="materialAmount" title="库存数量"></vxe-table-column>
      <vxe-table-column field="unitPrice" title="平均单价(元)"></vxe-table-column>
      <vxe-table-column field="totalPrice" title="合价(元)">
        <template v-slot="{ row }">
          <span>{{ row.unitPrice && row.materialAmount ? row.unitPrice * row.materialAmount : 0 }}</span>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="page"
      :page-size="rows"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEnter">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/material/remnantInventory'
export default {
  name: 'ModalPurchaseOrder',
  props: {
    visible: Boolean,
    validList: Array
  },
  data() {
    return {
      selectRow: null,
      form: {
        synthesize: ''
      },
      tableData: [],

      loading: false,
      page: 1,
      rows: 10,
      total: 0
    }
  },
  methods: {
    refresh(page, rows) {
      let content = this.form.synthesize
      this.loading = true
      Api.getList({
        projectId: localStorage.getItem('projectId'),
        content,
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
    handleSearch() {
      this.refresh(1, this.rows)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh(1, this.rows)
    },
    handleOpen() {
      this.refresh(1, this.rows)
    },
    handleCancel() {
      this.selectRow = null
      this.$refs.xTable.clearRadioRow()
      this.$emit('update:visible', false)
    },
    handleEnter() {
      if (this.selectRow) {
        let flag = false
        //console.log(this.validList)
        for (let i = 0; i < this.validList.length; i++) {
          if (this.validList[i].materialId === this.selectRow.id) {
            flag = true
            break
          }
        }
        if (flag) {
          this.$message.error('当前选择记录与明细表记录重复')
        } else {
          this.$emit('update:visible', false)
          this.$emit('optionSelectRecord', this.selectRow)
        }
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    handlePageChange({ currentPage, pageSize }) {
      this.refresh(currentPage, pageSize)
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
