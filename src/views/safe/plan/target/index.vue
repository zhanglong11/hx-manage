<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 340px;"
            placeholder="项目安全指标/危险发生概率/指标完成情况/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
        </el-form-item>
        <el-form-item label="创建日期" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
        <el-form-item label="年度" prop="year">
          <el-date-picker
            v-model="pageQuery.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
            style="width: 100%;"
          />
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
    <div>
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
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/safe/plan/target'
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
          field: 'year',
          title: '年度',
          minWidth: 100
        },
        {
          field: 'safetyIndicatorName',
          title: '项目安全指标',
          minWidth: 100
        },
        {
          field: 'riskIncidence',
          title: '危险发生率（%）',
          minWidth: 140
        },
        {
          field: 'ndicatorAchievingStatus',
          title: '指标完成情况',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.isFinishedList, { value: row.ndicatorAchievingStatus }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'planTime',
          title: '是否达标',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.isStandardList, { value: row.isReachStandard }), 'label')}</span>
            ]
          },
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
          //日期显示问题 张龙 3-30
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
                // row.status === 1 && this.isAudit ? (
                //   <el-button type="text" onClick={() => this.toDetail(row.id)}>
                //     审核
                //   </el-button>
                // ) : null,
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
      id ? this.$router.push({ path: `targetEdit/${id}` }) : this.$router.push({ path: `targetEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: `SafePlanTargetDetail`, params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `targetManageDetail/${id}` })
      //   : this.$router.push({ path: `targetDetail/${id}` })
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
