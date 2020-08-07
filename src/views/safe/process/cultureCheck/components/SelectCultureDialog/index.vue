<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="选择安全文明"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 340px;"
            placeholder="项目安全指标/危险发生概率/指标完成情况/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
        </el-form-item>
        <el-form-item label="创建日期" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
        <el-form-item label="年度" prop="year">
          <el-date-picker
            v-model="pageQuery.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
            style="width: 100%;"
          />
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
import api from '@/api/safe/plan/culture'
export default {
  name: 'SelectCultureDialog',
  mixins: [PageMixin],
  props: {
    visible: {}
  },
  data() {
    return {
      pageQuery: {},
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'civilizationNumber',
          title: '安全文明计划编号',
          minWidth: 160
        },
        {
          field: 'civilizationName',
          title: '安全文明管理目标名称',
          minWidth: 160
        },
        {
          field: 'civilizationContent',
          title: '安全文明管理内容',
          minWidth: 140
        },
        {
          //3-19 张龙 替换字段
          field: 'principalName',
          title: '负责人',
          minWidth: 100
        },
        {
          field: 'principalContact',
          title: '负责人联系方式',
          minWidth: 120
        },
        {
          field: 'planStartDate',
          title: '计划开始日期',
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
          field: 'civilizationTarget',
          title: '安全文明管理目标',
          minWidth: 140
        },
        {
          field: 'remark',
          title: '备注',
          minWidth: 100
        },
        {
          field: 'creatorName',
          title: '创建人',
          minWidth: 100
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160
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
