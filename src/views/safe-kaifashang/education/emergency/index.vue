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
          <el-input v-model="pageQuery.keyWords" placeholder="预案编号/预案名称/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="批准日期" prop="approveTime">
          <DateRange :startTime.sync="pageQuery.approveStartDate" :endTime.sync="pageQuery.approveEndDate" />
        </el-form-item>
        <el-form-item label="最后一次演练日期" prop="lastTime">
          <DateRange
            :startTime.sync="pageQuery.lastManoeuvreStartDate"
            :endTime.sync="pageQuery.lastManoeuvreEndDate"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
        <el-form-item label="预案类别" prop="planCategory">
          <SelectList v-model="pageQuery.planCategory" type="emergencyType" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="btn-add">
      <el-button v-if="$hasPower('SafeEducationEmergencyAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
        >新建</el-button
      >
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
import api from '@/api/safe/education/emergency'

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
          field: 'planNumber',
          title: '预案编号'
        },
        {
          field: 'planName',
          title: '预案名称'
        },
        {
          field: 'planCategory',
          title: '预案类别',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.emergencyType, { value: row.planCategory }), 'label')}</span>
            ]
          }
        },
        {
          field: 'approveDate',
          title: '批准日期',
          slots: {
            default: ({ row }) => [<span>{moment(row.approveDate).format('YYYY-MM-DD')}</span>]
          }
        },
        {
          field: 'approverName',
          title: '批准人'
        },
        {
          field: 'lastManoeuvreDate',
          title: '最后一次演练日期',
          slots: {
            default: ({ row }) => [<span>{moment(row.lastManoeuvreDate).format('YYYY-MM-DD')}</span>]
          }
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
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                this.$hasPower('SafeEducationEmergencyEdit') ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                this.$hasPower('SafeEducationEmergencyDelete') ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                this.$hasPower('SafeEducationEmergencyDetail') ? (
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
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `emergencyEdit/${id}` }) : this.$router.push({ path: `emergencyEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'emergencyDetail', query: { id } })
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
