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
                row.status === 2 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toAccept(row.id)}>
                    验收记录
                  </el-button>
                ) : null,
                row.status === 1 && this.isAudit ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id)}>
                    审核
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
      id ? this.$router.push({ path: `qualityApplyEdit/${id}` }) : this.$router.push({ path: `qualityApplyEdit` })
    },
    toDetail(id) {
      this.isAudit
        ? this.$router.push({ path: `checkApplyAuditDetail/${id}`, params: { isAudit: true } })
        : this.$router.push({ path: `qualityApplyDetail/${id}` })
    },
    toAccept(id) {
      //张龙 3-24 验收申请跳转
      this.$router.push({ path: 'qualityAcceptDetail', query: { id } })
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
