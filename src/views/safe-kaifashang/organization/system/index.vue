<!--
* @任务编号: 2824 || 列表页显示问题
* @开发人员:张龙
* @日期:2020-03-05
* @任务类型:修改代码
-->
<!--
* @任务编号:实现table初始化功能
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 修改代码
-->
<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input v-model="pageQuery.keyWords" placeholder="制度名称/制度编号/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
        </el-form-item>
        <el-form-item label="创建日期" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="btn-add">
      <el-button v-if="$hasPower('SafeOrganizationSystemAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
        >新建</el-button
      >
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
import api from '@/api/safe/organization/system'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {},
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'regimeNumber',
          title: '制度编号'
        },
        {
          field: 'regimeName',
          title: '制度名称'
        },
        {
          field: 'regimeContent',
          title: '制度内容'
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
              <span>{_.get(_.find(paramList.manageSystemStatus, { value: row.status }), 'label')}</span>
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
                this.$hasPower('SafeOrganizationSystemEdit') && row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                this.$hasPower('SafeOrganizationSystemDelete') && row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                this.$hasPower('SafeOrganizationSystemDetail') && row.status !== 1 ? (
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
      id ? this.$router.push({ path: `systemEdit/${id}` }) : this.$router.push({ path: `systemEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: `SafeOrganizationSystemDetail`, params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `manageSystemDetail/${id}` })
      //   : this.$router.push({ path: `systemDetail/${id}` })
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
