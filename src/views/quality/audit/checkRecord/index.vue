<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.search" style="width: 220px;" placeholder="验收编号/验收名称/验收人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="验收时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
        <el-form-item label="验收类型" prop="acceptanceType">
          <SelectList v-model="pageQuery.acceptanceType" type="checkTypeList" />
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
import api from '@/api/quality/acceptance/apply'
export default {
  name: 'CheckPlan',
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
          field: 'acceptanceApplyNumber',
          title: '验收编号',
          minWidth: 100
        },
        {
          field: 'acceptanceName',
          title: '验收名称',
          minWidth: 100
        },
        {
          field: 'acceptanceType',
          title: '验收类型',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.checkTypeList, { value: row.acceptanceType }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'acceptanceManName',
          title: '验收人',
          minWidth: 100
        },
        {
          field: 'acceptanceDate',
          title: '验收日期',
          minWidth: 100
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.checkApplyStatus, { value: row.status }), 'label')}</span>
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
                row.status === 4 ? (
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
      this.$router.push({ path: 'checkRecordAuditDetail', query: { id } })
    }
  }
}
</script>

<style scoped></style>
