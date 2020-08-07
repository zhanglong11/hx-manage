<!--
* @任务编号: 2824 || 成本核算页面开发
* @开发人员:张龙
* @日期:2020-03-06
* @任务类型:修改代码
-->
<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.keyword" style="width: 280px;" placeholder="成本核算编号/成本核算名称/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
        </el-form-item>
        <el-form-item label="创建日期" prop="time">
          <DateRange :startTime.sync="pageQuery.startDate" :endTime.sync="pageQuery.endDate" />
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
import api from '@/api/cost/costAccount'
import paramList from '@/lib/paramList'
export default {
  name: 'ContractCostAccount',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        search: ''
      },
      curId: null,
      costId: null,
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'code',
          title: '成本核算编号',
          minWidth: 100
        },
        {
          field: 'name',
          title: '成本核算名称',
          minWidth: 100
        },
        {
          field: 'remark',
          title: '备注',
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
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.manageSystemStatus, { value: row.status }), 'label')}</span>
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
      ],
      addVisible: false
    }
  },

  methods: {
    toDetail(id) {
      this.$router.push({ path: `contractCostAccountCheckDetail`, query: { id } })
    }
  }
}
</script>
