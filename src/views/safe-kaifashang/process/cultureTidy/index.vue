<!--
* @任务编号: 2824 || 列表页，详情页
* @开发人员:张龙
* @日期:2020-03-04
* @任务类型:修改代码
-->
<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 400px;"
            placeholder="整改编号/安全检查记录编号/检查单位/受检单位/受检方代表/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="问题等级" prop="level">
          <SelectList v-model="pageQuery.level" :hasAllOption="false" type="questionLevel" />
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgency">
          <SelectList v-model="pageQuery.urgency" :hasAllOption="false" type="urgencyDegree" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="pageQuery.status">
            <el-option :value="null" label="请选择" />
            <el-option v-for="e in isSubmit" :key="e.value" :value="e.value" :label="e.label" />
          </el-select>
          <!--          <SelectList v-model="pageQuery.status" type="riskTypeList" />-->
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
import api from '@/api/safe/process/cultureTidy'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {},
      paramList,
      request: api.list,
      isSubmit: [
        { value: 0, label: '未整改' },
        { value: 1, label: '已整改' }
      ],
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'civilizationCheckNumber',
          title: '安全文明检查编号',
          minWidth: 140
        },
        {
          field: 'safetyCivilizationNumber',
          title: '安全文明编号',
          minWidth: 140
        },
        {
          field: 'describes',
          title: '问题描述'
        },
        {
          field: 'levels',
          title: '问题等级',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.questionLevel, { value: row.levels }), 'label')}</span>
            ]
          }
        },
        {
          field: 'urgency',
          title: '紧急程度',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.urgencyDegree, { value: row.urgency }), 'label')}</span>
            ]
          }
        },
        {
          field: 'rectificationTime',
          title: '整改期限'
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
            default: ({ row }) => [<span>{_.get(_.find(this.isSubmit, { value: row.status }), 'label')}</span>]
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
                row.status !== 1 ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    安全整改
                  </el-button>
                ) : null,
                row.status === 1 ? (
                  <el-button type="text" onClick={() => this.toRecheck(row.id)}>
                    安全复检
                  </el-button>
                ) : null,
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
      this.$router.push({ path: 'cultureTidyEdit', query: { id } })
    },
    toRecheck(id) {
      this.$router.push({ path: '/safe/process/cultureRecheck', query: { id } })
    },
    toDetail(id) {
      this.$router.push({ path: 'cultureTidyDetail', query: { id } })
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
