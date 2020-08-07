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
import api from '@/api/safe/process/toggle'
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
          field: 'rewardsPunishmentsNumber',
          title: '安全奖惩编号'
        },
        {
          field: 'organizationName',
          title: '单位名称'
        },
        {
          field: 'rewardsPunishmentsDate',
          title: '奖惩日期',
          slots: {
            default: ({ row }) => [<span>{moment(row.rewardsPunishmentsDate).format('YYYY-MM-DD')}</span>]
          }
        },
        {
          field: 'type',
          title: '奖惩状态',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(paramList.safeToggle, { value: row.type }), 'label')}</span>]
          }
        },
        {
          field: 'reason',
          title: '奖惩事由'
        },
        {
          field: 'money',
          title: '奖惩金额'
        },
        {
          field: 'mainEvent',
          title: '主要记事'
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
      this.$router.push({ path: 'auditToggleDetail', query: { id } })
    }
  }
}
</script>

<style scoped></style>
