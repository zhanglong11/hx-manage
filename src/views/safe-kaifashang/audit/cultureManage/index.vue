<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 400px;"
            placeholder="安全文明管理目标名称/内容/负责人/负责人联系方式/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划日期" prop="status">
          <DateRange
            valueFormatter="YYYY-MM-DD HH:MM:SS"
            :startTime.sync="pageQuery.planEndDate"
            :endTime.sync="pageQuery.planEndDate"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange
            valueFormatter="YYYY-MM-DD HH:MM:SS"
            :startTime.sync="pageQuery.createTimeStart"
            :endTime.sync="pageQuery.createTimeEnd"
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
    />
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/safe/plan/culture'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        keyWords: '',
        status: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
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
          title: '负责人'
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
          }
        },
        {
          field: 'planEndDate',
          title: '计划结束日期',
          slots: {
            default: ({ row }) => [<span>{moment(row.planEndDate).format('YYYY-MM-DD')}</span>]
          }
        },
        {
          field: 'civilizationTarget',
          title: '安全文明管理目标',
          minWidth: 140
        },
        {
          field: 'remark',
          title: '备注'
        },
        {
          field: 'creatorName',
          title: '创建人'
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
          }
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                row.status === 1 ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                    审核
                  </el-button>
                ) : (
                  <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                    查看
                  </el-button>
                )
              ]
            }
          }
        }
      ]
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push({ path: 'cultureManageDetail', query: { id } })
    }
  }
}
</script>

<style scoped></style>
