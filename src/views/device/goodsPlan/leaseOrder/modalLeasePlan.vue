<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 30d0953c4a78d9a7fe4e41d80840a6e8643bfc98
@代码提交修改日期: 2020-03-04
@任务类型: 修改代码，选择租赁计划模态框调整，选择合同模态框添加合同类型参数控制
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 205b52064519eb0958411cba677f55987291c7c8
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，物资设备计划模块和审核模块 时间组件 添加时分秒
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: dc31821aaea172ad4d3f0b9ce3764ac7212999d5
@代码提交修改日期: 2020-03-07
@任务类型: 修改代码，租赁计划需求变动 去掉开始时间组件、结束时间组件
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog width="1080px" :title="'请选择租赁计划'" :visible="visible" @open="handleLoad" @close="handleCancel">
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="租赁计划编号/租赁计划名称/创建人"
              style="width: 250px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <!--<el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px"
            ></el-date-picker>
          </el-form-item>-->
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="草稿" value="0"></el-option>
              <el-option label="待审核" value="1"></el-option>
              <el-option label="已通过" value="2"></el-option>
              <el-option label="已驳回" value="3"></el-option>
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
      <vxe-table-column field="planCode" title="租赁计划编号"></vxe-table-column>
      <vxe-table-column field="name" title="租赁计划名称"></vxe-table-column>
      <!--<vxe-table-column field="startTime" title="开始时间"></vxe-table-column>
      <vxe-table-column field="endTime" title="结束时间"></vxe-table-column>-->
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
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="handleEnter">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/goodsPlan/leasePlan'
export default {
  name: 'ModalLeasePlan',
  props: {
    visible: Boolean
  },
  data() {
    return {
      selectRow: null,
      form: {
        synthesize: '',
        startTime: '',
        endTime: '',
        createTime: '',
        status: ''
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
      let createTimeBegin = ''
      let createTimeEnd = ''
      if (this.form.createTime !== null && this.form.createTime !== '' && this.form.createTime.length !== 1) {
        createTimeBegin = moment(this.form.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        createTimeEnd = moment(this.form.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      /*let startTimeBegin = ''
      let startTimeEnd = ''
      if (this.form.startTime !== null && this.form.startTime !== '' && this.form.startTime.length !== 1) {
        startTimeBegin = moment(this.form.startTime[0]).format('YYYY-MM-DD HH:mm:ss')
        startTimeEnd = moment(this.form.startTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let endTimeBegin = ''
      let endTimeEnd = ''
      if (this.form.endTime !== null && this.form.endTime !== '' && this.form.endTime.length !== 1) {
        endTimeBegin = moment(this.form.endTime[0]).format('YYYY-MM-DD HH:mm:ss')
        endTimeEnd = moment(this.form.endTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }*/

      let content = this.form.synthesize

      this.loading = true

      Api.getLeasePlanList({
        type: '2', //查询租赁计划
        projectId: localStorage.getItem('projectId'),
        content,
        /*startTimeBegin,
        startTimeEnd,
        endTimeBegin,
        endTimeEnd,*/
        createTimeBegin,
        createTimeEnd,
        status: '2', //状态为已通过的租赁计划
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
    handleLoad() {
      this.refresh(1, this.rows)
    },
    handleCancel() {
      this.selectRow = null
      this.$refs.xTable.clearRadioRow()
      this.$emit('update:visible', false)
    },
    handleEnter() {
      if (this.selectRow) {
        this.$emit('update:visible', false)
        this.$emit('optionSelectRecord', this.selectRow)
        //console.log(this.selectRow)
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
