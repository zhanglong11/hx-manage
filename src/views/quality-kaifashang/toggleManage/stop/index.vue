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
          <el-input v-model="pageQuery.search" style="width: 260px;" placeholder="停工编号/停工部位/停工原因/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="stopCheckStatus" />
        </el-form-item>
        <el-form-item label="创建日期" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-add">
      <el-button v-if="$hasPower('QualityToggleStopAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
        >新建</el-button
      >
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
    <StopHandleDialog :visible.sync="stopDialogVisible" :curId="curId" />
    <ResetApplyDialog :visible.sync="resetDialogVisible" :curId="curId" />
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/quality/toggleManage/stop'
import StopHandleDialog from './components/StopHandleDialog'
import ResetApplyDialog from './components/ResetApplyDialog'
export default {
  name: 'Stop',
  components: { StopHandleDialog, ResetApplyDialog },
  mixins: [PageMixin],
  data() {
    return {
      stopDialogVisible: false,
      resetDialogVisible: false,
      curId: null,
      pageQuery: {
        search: '',
        status: null,
        time: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'engineeringName',
          title: '工程名称'
        },
        {
          field: 'stopWorkPlace',
          title: '停工部位'
        },
        {
          field: 'stopWorkReason',
          title: '停工原因'
        },
        {
          field: 'stopWorkDate',
          title: '停工时间'
        },
        {
          field: 'rectificationRequire',
          title: '整改要求'
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
              <span>{_.get(_.find(paramList.stopCheckStatus, { value: row.status }), 'label')}</span>
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
                this.$hasPower('QualityToggleStopEdit') && row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                this.$hasPower('QualityToggleStopDelete') && row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                this.$hasPower('QualityToggleStopManage') && row.status === 4 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.showStopDialog(row.id, row)}>
                    停工处理
                  </el-button>
                ) : null,
                this.$hasPower('QualityToggleStopApply') && row.status === 5 ? (
                  <el-button type="text" onClick={() => this.showResetDialog(row.id, row)}>
                    申请复工
                  </el-button>
                ) : null,
                this.$hasPower('QualityToggleStopAudit') && row.status === 1 && this.isAudit ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id)}>
                    审核
                  </el-button>
                ) : null,
                this.$hasPower('QualityToggleStopDetail') && (row.status !== 1 || !this.isAudit) ? (
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
      id ? this.$router.push({ path: `stopEdit/${id}` }) : this.$router.push({ path: `stopEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: 'QualityToggleStopDetail', params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `resetApplyDetail/${id}` })
      //   : this.$router.push({ path: `stopDetail/${id}` })
    },
    showStopDialog(id) {
      this.curId = id
      this.stopDialogVisible = true
    },
    showResetDialog(id) {
      this.curId = id
      this.resetDialogVisible = true
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
