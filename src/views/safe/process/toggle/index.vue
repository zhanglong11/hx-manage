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
            placeholder="安全奖惩编号/单位名称/奖惩事由/主要记事/创建人"
            style="width: 380px;"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="奖惩日期" prop="rewardsTime">
          <DateRange
            :startTime.sync="pageQuery.rewardsPunishmentsStartDate"
            :endTime.sync="pageQuery.rewardsPunishmentsEndDate"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
        <el-form-item label="奖惩状态" prop="type">
          <SelectList v-model="pageQuery.type" type="safeToggle" />
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
import api from '@/api/safe/process/toggle'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      time: null,
      toggleTime: null,
      pageQuery: {
        keyWords: '',
        status: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'rewardsPunishmentsNumber',
          title: '安全奖惩编号',
          minWidth: 100
        },
        {
          field: 'organizationName',
          title: '单位名称',
          minWidth: 100
        },
        {
          field: 'rewardsPunishmentsDate',
          title: '奖惩日期',
          //日期格式化问题 张龙 3-30
          slots: {
            default: ({ row }) => [<span>{moment(row.rewardsPunishmentsDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'type',
          title: '奖惩状态',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(paramList.safeToggle, { value: row.type }), 'label')}</span>]
          },
          minWidth: 100
        },
        {
          field: 'reason',
          title: '奖惩事由',
          minWidth: 100
        },
        {
          field: 'money',
          title: '奖惩金额',
          minWidth: 100
        },
        {
          field: 'mainEvent',
          title: '主要记事',
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
      id ? this.$router.push({ path: `safeToggleEdit/${id}` }) : this.$router.push({ path: `safeToggleEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: `SafeProcessToggleDetail`, params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `auditToggleDetail/${id}` })
      //   : this.$router.push({ path: `safeToggleDetail/${id}` })
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
