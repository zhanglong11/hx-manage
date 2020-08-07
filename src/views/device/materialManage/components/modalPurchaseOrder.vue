<!--
@任务名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，选择采购单模态框功能调整，修改比例(40%)
-->
<template>
  <el-dialog
    width="1080px"
    :title="'请选择采购单'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <el-input
              v-model="form.content"
              placeholder="采购单编号/供应商名称/合同编号/创建人"
              style="width: 280px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px;"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" @click="refresh()">搜索</el-button>
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
      <vxe-table-column field="dispatchCode" title="采购单编号"></vxe-table-column>
      <vxe-table-column field="planCode" title="需用计划编号"></vxe-table-column>
      <vxe-table-column field="supplierName" title="供应商名称" show-overflow="title"></vxe-table-column>
      <vxe-table-column field="contractCode" title="合同编号"></vxe-table-column>
      <vxe-table-column field="purchaseAmount" title="采购单金额(元)"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creator" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="150px"></vxe-table-column>
      <!--
        /**
       任务名称：1210/采购单数据不对
       开发人员：崔洛宜
       日期：2020-03-18
       BUG类型：
       **/
      -->
      <vxe-table-column field="status" title="状态">
        <template slot-scope="{ row }">
          <span>{{
            row.status !== null && row.status !== undefined
              ? baseStatus.filter(item => item.value === row.status)[0].label
              : ''
          }}</span>
        </template>
      </vxe-table-column>
    </vxe-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/material/weighOrder'
import baseStatus from '@/lib/basicStatus'
export default {
  name: 'ModalPurchaseOrder',
  props: {
    visible: Boolean
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        content: '',
        createTime: ''
      },
      selectRow: null,
      tableData: [],
      baseStatus,
      loading: false
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      /**
       任务名称：1210/采购单数据不对
       开发人员：崔洛宜
       日期：2020-03-18
       BUG类型：
       **/
      this.loading = true
      Api.getPurchaseOrderList({
        content: this.form.content,
        type: '1', //1为采购单、2为租赁单
        status: '2', //查询已通过的采购单
        projectId: this.projectId,
        createTimeBegin: this.form.createTime[0],
        createTimeEnd: this.form.createTime[1]
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.loading = false
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh()
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    clearRadioRowEevnt() {
      this.selectRow = null
      this.$refs.xTable.clearRadioRow()
    },
    onOk() {
      if (this.selectRow) {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRow)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
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
