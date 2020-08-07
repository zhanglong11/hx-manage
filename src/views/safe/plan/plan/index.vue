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
            style="width: 460px;"
            placeholder="安全计划编号/安全计划名称/检查性质/检查人/检查部门/通知人/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划日期" prop="planTime">
          <DateRange :startTime.sync="pageQuery.planStartDate" :endTime.sync="pageQuery.planEndDate" />
        </el-form-item>
        <el-form-item label="检查性质" prop="checkNature">
          <el-select v-model="pageQuery.checkNature" style="width: 100%;">
            <el-option :value="1" label="安全临检" />
            <el-option :value="2" label="一般检查" />
            <el-option :value="3" label="阶段性检查" />
            <el-option :value="4" label="专项检查" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
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
import api from '@/api/safe/plan/plan'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      selectedList: [],
      pageQuery: {},
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'planNumber',
          title: '安全计划编号',
          minWidth: 100
        },
        {
          field: 'planName',
          title: '安全计划名称',
          minWidth: 100
        },
        {
          field: 'type',
          title: '检查性质',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.checkNatureList, { value: row.checkNature }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'checkPersonName',
          title: '检查人',
          minWidth: 100
        },
        {
          field: 'checkPersonContact',
          title: '检查人联系方式',
          minWidth: 140
        },
        {
          field: 'checkDepartmentName',
          title: '检查部门',
          minWidth: 100
        },
        {
          field: 'notificationPersonNames',
          title: '通知人',
          minWidth: 100
        },
        {
          field: 'notificationPersonPhones',
          title: '通知人联系方式',
          minWidth: 140
        },
        {
          field: 'planStartDate',
          title: '计划开始日期',
          //日期格式化 张龙 3-30
          slots: {
            default: ({ row }) => [<span>{moment(row.planStartDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'planEndDate',
          title: '计划结束日期',
          //日期格式化 张龙 3-30
          slots: {
            default: ({ row }) => [<span>{moment(row.planEndDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'checkDays',
          title: '检查周期（天）',
          slots: {
            default: ({ row }) => [<span>{moment(row.planEndDate).diff(moment(row.planStartDate), 'days')}</span>]
          },
          minWidth: 120
        },
        {
          field: 'remark',
          title: '备注',
          minWidth: 100
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
      id ? this.$router.push({ path: `safePlanEdit/${id}` }) : this.$router.push({ path: `safePlanEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: 'SafePlanSafePlanDetail', params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `auditSafePlanDetail/${id}` })
      //   : this.$router.push({ path: `safePlanDetail/${id}` })
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
