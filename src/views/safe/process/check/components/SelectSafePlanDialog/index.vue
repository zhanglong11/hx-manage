<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="选择安全计划"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 460px;"
            placeholder="安全计划编号/安全计划名称/检查性质/检查人/检查部门/通知人/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划日期" prop="planTime">
          <DateRange :startTime.sync="pageQuery.planStartDate" :endTime.sync="pageQuery.planEndDate" />
        </el-form-item>
        <el-form-item label="检查性质" prop="checkNature">
          <SelectList v-model="pageQuery.checkNature" type="checkNatureList" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <VXTable
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      :columns="tableColumn"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      @radioChange="radioChange"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/safe/plan/plan'
export default {
  name: 'SelectSafePlanDialog',
  mixins: [PageMixin],
  props: {
    visible: {}
  },
  data() {
    return {
      pageQuery: {
        keyWords: '',
        status: null,
        time: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'planNumber',
          title: '安全计划编号',
          minWidth: 100
        },
        {
          field: 'planName',
          title: '安全计划名称',
          minWidth: 100
        },
        {
          field: 'type',
          title: '检查性质',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.checkNatureList, { value: row.checkNature }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'checkPersonName',
          title: '检查人',
          minWidth: 100
        },
        {
          field: 'checkPersonContact',
          title: '检查人联系方式',
          minWidth: 140
        },
        {
          field: 'checkDepartmentName',
          title: '检查部门',
          minWidth: 100
        },
        {
          field: 'notificationPersonNames',
          title: '通知人',
          minWidth: 100
        },
        {
          field: 'notificationPersonPhones',
          title: '通知人联系方式',
          minWidth: 140
        },
        {
          field: 'planStartDate',
          title: '计划开始日期',
          //日期格式化 张龙 3-30
          slots: {
            default: ({ row }) => [<span>{moment(row.planStartDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'planEndDate',
          title: '计划结束日期',
          slots: {
            default: ({ row }) => [<span>{moment(row.planEndDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'checkDays',
          title: '检查周期（天）',
          minWidth: 120
        },
        {
          field: 'remark',
          title: '备注',
          minWidth: 100
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.safeCommonStatus, { value: row.status }), 'label')}</span>
            ]
          },
          minWidth: 100
        }
      ]
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      this.radioRow = {}
    },
    submit() {
      this.$emit('update:visible', false)
      this.$emit('choose', this.radioRow)
    }
  }
}
</script>

<style scoped></style>
