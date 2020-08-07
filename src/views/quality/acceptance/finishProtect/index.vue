<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input
            v-model="pageQuery.search"
            style="width: 280px;"
            placeholder="保护部位/保护方法/责任部门/责任人/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="保护日期" prop="saveTime">
          <DateRange :startTime.sync="pageQuery.protectionBeginTime" :endTime.sync="pageQuery.protectionEndTime" />
        </el-form-item>
        <el-form-item label="拆除日期" prop="dismantTime">
          <DateRange :startTime.sync="pageQuery.dismantleBeginTime" :endTime.sync="pageQuery.dismantleEndTime" />
        </el-form-item>
        <el-form-item label="创建日期" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
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
      ref="table"
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
import api from '@/api/quality/acceptance/finishProtect'
export default {
  name: 'FinishProtect',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        search: '',
        time: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'protectionNumber',
          title: '成品保护编号',
          minWidth: 100
        },
        {
          field: 'protectionPlace',
          title: '保护部位',
          minWidth: 100
        },
        {
          field: 'protectionDate',
          title: '保护日期',
          minWidth: 100
        },
        {
          field: 'dismantleDate',
          title: '拆除日期',
          minWidth: 100
        },
        {
          field: 'protectionMethod',
          title: '保护方法',
          minWidth: 100
        },
        {
          field: 'responsibleDepartmentName',
          title: '责任部门',
          minWidth: 100
        },
        {
          field: 'principalName',
          title: '责任人',
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
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                  编辑
                </el-button>,
                <el-button type="text" onClick={() => this.remove(row)}>
                  删除
                </el-button>,
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  查看
                </el-button>
              ]
            }
          }
        }
      ]
    }
  },
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `finishProtectEdit/${id}` }) : this.$router.push({ path: `finishProtectEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'finishProtectDetail', query: { id } })
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
