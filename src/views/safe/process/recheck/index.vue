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
            style="width: 400px;"
            placeholder="检查计划编号/检查计划名称/验收要求/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="严重程度">
          <SelectList type="urgencyDegree" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
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
import api from '@/api/safe/process/recheck'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        status: null
      },
      request: api.list,
      recheckStatusList: [
        { label: '待复检', value: 0 },
        { label: '复检完', value: 1 }
      ],
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'recheckNumber',
          title: '复检编号',
          minWidth: 100
        },
        {
          field: 'rectificationNumber',
          title: '整改编号',
          minWidth: 100
        },
        {
          field: 'describe',
          title: '整改描述',
          minWidth: 100
        },
        {
          field: 'levels',
          title: '问题等级',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(paramList.questionLevel, { value: row.level }), 'label')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'urgency',
          title: '紧急程度',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.urgencyDegree, { value: row.urgency }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'rectificationerName',
          title: '整改人',
          minWidth: 100
        },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(this.recheckStatusList, { value: row.status }), 'label')}</span>]
          }
        },
        {
          field: 'rectificationTime',
          title: '整改时间',
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
      this.$router.push({ path: 'recheckEdit', query: { id } })
    },
    toDetail(id) {
      this.$router.push({ path: 'recheckDetail', query: { id } })
    }
  }
}
</script>

<style scoped></style>
