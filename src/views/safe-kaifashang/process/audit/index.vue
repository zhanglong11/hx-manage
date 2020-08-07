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
            style="width: 280px;"
            placeholder="考核编号/被考核单位/主要记事/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="考核日期" prop="assessTime">
          <DateRange :startTime.sync="pageQuery.assessStartDate" :endTime.sync="pageQuery.assessEndDate" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
        <el-form-item label="考核评价" prop="assessEvaluate">
          <SelectList v-model="pageQuery.assessEvaluate" type="auditEvaluate" />
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
      <el-button v-if="$hasPower('SafeProcessAuditAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
        >新建</el-button
      >
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
import api from '@/api/safe/process/audit'
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
          field: 'assessNumber',
          title: '考核编号'
        },
        {
          field: 'assessCompanyName',
          title: '被考核单位'
        },
        {
          field: 'assessDate',
          title: '考核日期',
          //日期格式化问题 张龙 3-30
          slots: {
            default: ({ row }) => [<span>{moment(row.assessDate).format('YYYY-MM-DD')}</span>]
          }
        },
        {
          field: 'assessEvaluate',
          title: '考核评价',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.auditEvaluate, { value: row.assessEvaluate }), 'label')}</span>
            ]
          }
        },
        {
          field: 'rectificationDate',
          title: '整改期限',
          slots: {
            default: ({ row }) => [<span>{moment(row.rectificationDate).format('YYYY-MM-DD')}</span>]
          }
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
          title: '创建时间'
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
                this.$hasPower('SafeProcessAuditEdit') && row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                this.$hasPower('SafeProcessAuditDelete') && row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                this.$hasPower('SafeProcessAuditAudit') && row.status === 1 && this.isAudit ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id)}>
                    审核
                  </el-button>
                ) : null,
                (this.$hasPower('SafeProcessAuditDetail') && row.status !== 1) || !this.isAudit ? (
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
      id ? this.$router.push({ path: `safeAuditEdit/${id}` }) : this.$router.push({ path: `safeAuditEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: 'SafeProcessAuditDetail', params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `auditAssessDetail/${id}` })
      //   : this.$router.push({ path: `safeAuditDetail/${id}` })
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
