<!--
* @任务编号:2824||质量管理添加搜索图标，日期组件替换
* @开发人员:张龙
* @日期:2020-03-01
* @任务类型: 全新代码
-->
<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.search" style="width: 260px;" placeholder="检查部位/检查项目/验收要求/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="计划时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
        <el-form-item label="检查性质" prop="checkNature">
          <el-select v-model="pageQuery.checkNature" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in natureCheckList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
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
import api from '@/api/quality/control/checkPlan'

export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      time: null,
      pageQuery: {
        search: ''
      },
      request: api.list,
      natureCheckList: [
        { label: '质量临检', value: 1 },
        { label: '一般检查', value: 2 },
        { label: '阶段性检查', value: 3 },
        { label: '专项检查', value: 4 }
      ],
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkPlanNumber',
          title: '检查计划编号',
          minWidth: 100
        },
        {
          field: 'checkPlanName',
          title: '检查计划名称',
          minWidth: 100
        },
        {
          field: 'checkPoint',
          title: '检查部位',
          minWidth: 100
        },
        {
          field: 'checkItem',
          title: '检查项目',
          minWidth: 100
        },
        {
          field: 'checkNature',
          title: '检查性质',
          minWidth: 100,
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(this.natureCheckList, { value: row.checkNature }), 'label')}</span>
            ]
          }
        },
        {
          field: 'checkAmount',
          title: '检查数量',
          minWidth: 100
        },
        {
          field: 'planTime',
          title: '计划时间',
          minWidth: 100
        },
        {
          field: 'acceptanceRequire',
          title: '验收要求',
          minWidth: 100
        },
        {
          field: 'creatorName',
          title: '创建人',
          width: 100
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: 100
        },
        {
          field: 'status',
          title: '状态',
          width: 100,
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.safeCommonStatus, { value: row.status }), 'label')}</span>
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
      id ? this.$router.push({ path: `checkPlanEdit/${id}` }) : this.$router.push({ path: `checkPlanEdit` })
    },
    toDetail(id) {
      this.isAudit
        ? this.$router.push({ path: `checkPlanAuditDetail/${id}` })
        : this.$router.push({ path: `checkPlanDetail/${id}` })
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
