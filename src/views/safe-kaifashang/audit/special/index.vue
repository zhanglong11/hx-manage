<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 580px;"
            placeholder="特种作业施工编号/作业部门/作业地点/作业内容/作业安全标砖/现场指挥人/现场监护人/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划开始日期" prop="planStartTime">
          <DateRange :startTime.sync="pageQuery.planStartStartDate" :endTime.sync="pageQuery.planStartEndDate" />
        </el-form-item>
        <el-form-item label="计划结束日期" prop="planEndTime">
          <DateRange :startTime.sync="pageQuery.planEndStartDate" :endTime.sync="pageQuery.planEndEndDate" />
        </el-form-item>
        <el-form-item label="作业类别" prop="operationCategory">
          <SelectList v-model="pageQuery.operationCategory" type="operationType" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
        <el-form-item label="实际开始日期" prop="actualTime">
          <DateRange :startTime.sync="pageQuery.actualStartStartDate" :endTime.sync="pageQuery.actualStartEndDate" />
        </el-form-item>
        <el-form-item label="实际结束日期" prop="actualEndTime">
          <DateRange :startTime.sync="pageQuery.actualEndStartDate" :endTime.sync="pageQuery.actualEndEndDate" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
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
import api from '@/api/safe/process/special'
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
          field: 'specialOperationNumber',
          title: '特种作业施工编号',
          minWidth: 140
        },
        {
          field: 'operationDepartment',
          title: '作业部门'
        },
        {
          field: 'operationAddress',
          title: '作业地点'
        },
        {
          field: 'operationCategory',
          title: '作业类别',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.operationType, { value: row.operationCategory }), 'label')}</span>
            ]
          }
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
          field: 'operationContent',
          title: '作业内容'
        },
        {
          field: 'operationSafetyStandard',
          title: '作业安全标准'
        },
        {
          field: 'fieldManger',
          title: '现场指挥人'
        },
        {
          field: 'onsiteGuardian',
          title: '现场监护人'
        },
        {
          field: 'actualStartDate',
          title: '实际开始时间',
          minWidth: 160
        },
        {
          field: 'actualEndDate',
          title: '实际结束时间',
          minWidth: 160
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
      this.$router.push({ path: 'auditSpecialDetail', query: { id } })
    }
  }
}
</script>

<style scoped></style>
