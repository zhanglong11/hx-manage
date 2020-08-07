<!--
@bug名称: 1253/选择总物资计划模态框缺少物资种类
@开发人员: 董渊海
@修改日期: 2020-03-23
@任务类型: 修改代码，选择总物资计划模态框，添加物资种类，修改比例(5%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 17b336f4058bf4489a328ddcf5cec6d254a6aee7
@代码提交修改日期: 2020-03-02
@任务类型: 修改代码，完成 租赁计划 列表接口对接，新增接口对接，新增租赁计划界面样式调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 6600fc69b57e504075ed3574a7619696fc484db0
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 原材料检验计划 查询列表、新增(编辑)、删除接口对接；总物资计划模态框添加物资类别参数控制
@补加代码注释日期: 2020-04-11

@bug名称: 1646/物资与设备管理->需用计划->新增需用计划：需用明细部分，点击“添加”，在选择总物资计划窗体，以字段【编号】和【名称】为查询条件，查询无效
@开发人员: 董渊海
@修改日期: 2020-04-16
@任务类型: 修改代码，修复该bug，修改比例(2%)
-->
<template>
  <el-dialog width="720px" :title="'选择总物资计划'" :visible="visible" @close="handleCancel">
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="编号/名称"
              style="width: 140px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item v-if="materialSource" label="类别" prop="type">
            <el-select v-model="form.type" style="width: 100px;">
              <el-option label="材料" value="1"> </el-option>
              <el-option label="机械" value="2"> </el-option>
            </el-select>
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
      <vxe-table-column field="materialName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="materialType" title="类别">
        <template v-slot="{ row }">
          <span v-if="row.materialType === 1">材料</span>
          <span v-else-if="row.materialType === 2">机械</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="materialKind" title="种类">
        <template v-slot="{ row }">
          <span v-if="row.materialKind === 1">耗材</span>
          <span v-else-if="row.materialKind === 2">周材</span>
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
import Api from '@/api/device/goodsPlan/totalMaterial'
export default {
  name: 'ModalTotalMaterial',
  props: {
    visible: Boolean,
    materialSource: String,
    validList: Array
  },
  data() {
    return {
      sourceType: '',
      form: {
        synthesize: '',
        type: ''
      },
      selectRow: null,
      tableData: [],

      loading: false,
      page: 1,
      rows: 10,
      total: 0
    }
  },
  watch: {
    materialSource(val) {
      this.sourceType = val
    },
    visible(val) {
      if (val) {
        this.refresh(1, this.rows)
      }
    }
  },
  methods: {
    refresh(page, rows) {
      let content = this.form.synthesize
      let materialType = this.form.type
      if (!this.materialSource) {
        materialType = '1'
      }
      this.loading = true
      Api.getTotalMaterialList({
        projectId: localStorage.getItem('projectId'),
        materialSource: this.sourceType, //1是自购，2是租赁
        content,
        materialType,
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
          this.$emit('disposeSelectRecord', this.selectRow)
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
