<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.search" style="width: 260px;" placeholder="检查部位/检查项目/验收要求/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
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
import api from '@/api/quality/control/checkPlan'
export default {
  name: 'CheckPlanAudit',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        search: ''
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkPlanNumber',
          title: '检查计划编号',
          minWidth: 100
        },
        {
          field: 'checkPlanName',
          title: '检查计划名称',
          minWidth: 100
        },
        {
          field: 'checkPoint',
          title: '检查部位',
          minWidth: 100
        },
        {
          field: 'checkItem',
          title: '检查项目',
          minWidth: 100
        },
        {
          field: 'checkAmount',
          title: '检查数量',
          minWidth: 100
        },
        {
          field: 'planTime',
          title: '计划时间',
          minWidth: 100
        },
        {
          field: 'acceptanceRequire',
          title: '验收要求',
          minWidth: 100
        },
        {
          field: 'creatorName',
          title: '创建人',
          width: 100
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: 100
        },
        {
          field: 'status',
          title: '状态',
          width: 100,
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
      this.$router.push({ path: 'checkPlanAuditDetail', query: { id } })
    }
  }
}
</script>

<style scoped></style>
