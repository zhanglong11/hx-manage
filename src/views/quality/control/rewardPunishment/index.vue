<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input
            v-model="pageQuery.search"
            style="width: 350px;"
            placeholder="奖惩编号/奖惩名称/奖惩人员/所属部门/事由/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="奖惩日期" prop="happenTime">
          <DateRange :startTime.sync="pageQuery.happenBeginTime" :endTime.sync="pageQuery.happenEndTime" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
        <el-form-item label="奖惩" prop="type">
          <SelectList v-model="pageQuery.type" type="rewardPunishType" />
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
import api from '@/api/quality/control/rewardPunishment'
export default {
  name: 'RewardPunishment',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        search: '',
        status: null,
        type: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '奖惩编号',
          minWidth: 100
        },
        {
          field: 'name',
          title: '奖惩名称',
          minWidth: 100
        },
        {
          field: 'personnelName',
          title: '奖惩人员',
          minWidth: 100
        },
        {
          field: 'departmentName',
          title: '所属部门',
          minWidth: 100
        },
        {
          field: 'reason',
          title: '事由',
          minWidth: 100
        },
        {
          field: 'happenDate',
          title: '奖惩日期',
          minWidth: 100
        },
        {
          field: 'toggle',
          title: '奖惩',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.rewardPunishType, { value: row.type }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'money',
          title: '金额(元)',
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
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                  编辑
                </el-button>,
                <el-button type="text" onClick={() => this.remove(row)}>
                  删除
                </el-button>,
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
      id
        ? this.$router.push({ path: `rewardPunishmentEdit/${id}` })
        : this.$router.push({ path: `rewardPunishmentEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'rewardPunishmentDetail', query: { id } })
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
