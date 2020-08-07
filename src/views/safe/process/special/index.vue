<!--
* @任务编号: 2824 || 列表页显示问题
* @开发人员:张龙
* @日期:2020-03-05
* @任务类型:修改代码
-->
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
    <div class="btn-add">
      <el-button type="primary" icon="el-icon-plus" @click="toEdit(null)">新建</el-button>
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
          title: '作业部门',
          minWidth: 100
        },
        {
          field: 'operationAddress',
          title: '作业地点',
          minWidth: 100
        },
        {
          field: 'operationCategory',
          title: '作业类别',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.operationType, { value: row.operationCategory }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'planStartDate',
          title: '计划开始日期',
          //日期格式化问题 张龙 3-30
          slots: {
            default: ({ row }) => [<span>{moment(row.planStartDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'planEndDate',
          title: '计划结束日期',
          //日期格式化问题 张龙 3-30
          slots: {
            default: ({ row }) => [<span>{moment(row.planEndDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'operationContent',
          title: '作业内容',
          minWidth: 100
        },
        {
          field: 'operationSafetyStandard',
          title: '作业安全标准',
          minWidth: 100
        },
        {
          field: 'fieldManger',
          title: '现场指挥人',
          minWidth: 100
        },
        {
          field: 'onsiteGuardian',
          title: '现场监护人',
          minWidth: 100
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
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                row.status !== 1 || !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                    查看
                  </el-button>
                ) : null
              ]
            }
          }
        }
      ]
    }
  },
  computed: {
    isAudit() {
      return this.$route.meta.isAudit
    }
  },
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `specialEdit/${id}` }) : this.$router.push({ path: `specialEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: 'SafeProcessSpecialDetail', params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `auditSpecialDetail/${id}` })
      //   : this.$router.push({ path: `specialDetail/${id}` })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await api.delete(row.id)
      this.$message.success('删除成功')
      this.getList()
    }
  }
}
</script>

<style scoped></style>
