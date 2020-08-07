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
            placeholder="检查计划编号/检查计划名称/验收要求/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <!--        无数据-->
        <el-form-item label="检查日期">
          <DateRange
            valueFormatter="YYYY-MM-DD HH:MM:SS"
            :startTime.sync="pageQuery.createTimeStart"
            :endTime.sync="pageQuery.createTimeEnd"
          />
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
import api from '@/api/safe/process/cultrueRecheck'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {},
      paramList,
      request: api.list,
      tidyStatusList: [
        { label: '待复查', value: 0 },
        { label: '已复查', value: 1 }
      ],
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'recheckNumber',
          title: '安全文明复检编号',
          minWidth: 140
        },
        {
          field: 'rectificationNumber',
          title: '安全文明整改编号',
          minWidth: 140
        },
        {
          field: 'describes',
          title: '整改描述'
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
          field: 'rectificationerName',
          title: '整改人'
        },
        {
          field: 'rectificationTime',
          title: '整改时间'
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(this.tidyStatusList, { value: row.status }), 'label')}</span>]
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
                    编辑
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
      this.$router.push({ path: 'cultureRecheckEdit', query: { id } })
    },
    toDetail(id) {
      this.$router.push({ path: 'cultureRecheckDetail', query: { id } })
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
