<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 420px;"
            placeholder="危险源/关键部位/项目责任领导/责任人/责任人联系方式/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划日期" prop="planTime">
          <DateRange :startTime.sync="pageQuery.planStartDate" :endTime.sync="pageQuery.planEndDate" />
        </el-form-item>
        <!--        无数据-->
        <el-form-item label="伤害类别" prop="status">
          <SelectList v-model="pageQuery.status" type="harmTypeList" />
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
import api from '@/api/safe/plan/dangerous'
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
          field: 'dangerSource',
          title: '危险源',
          minWidth: 100
        },
        {
          field: 'placeName',
          title: '关键部位',
          minWidth: 100
        },
        {
          field: 'count',
          title: '伤害类别',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.harmTypeList, { value: row.harmCategory }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'precautionaryMeasure',
          title: '防范措施',
          minWidth: 100
        },
        {
          field: 'principalLeaderName',
          title: '项目责任领导',
          minWidth: 100
        },
        {
          field: 'principalName',
          title: '责任人',
          minWidth: 100
        },
        {
          field: 'principalContact',
          title: '责任人联系方式',
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
              <span>{_.get(_.find(paramList.safeCommonStatus, { value: row.status }), 'label')}</span>
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
      ]
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push({ path: 'auditDangerousDetail', query: { id } })
    }
  }
}
</script>

<style scoped></style>
