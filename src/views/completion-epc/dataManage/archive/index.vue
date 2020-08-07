<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="申报文件名称">
          <el-input v-model="filterForm.name" />
        </el-form-item>
        <el-form-item label="执行人">
          <SelectUser v-model="filterForm.executorId" :multiple="false" value-format="id" />
        </el-form-item>
        <el-form-item label="审批状态">
          <SelectList v-model="filterForm.auditStatus" :self-list="auditStatus" />
        </el-form-item>
        <el-form-item label="签署时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate" />
        </el-form-item>
        <el-form-item>
          <el-button-group v-if="$hasPower('EquipmentListView')">
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <Grid
      ref="table"
      :request="request"
      :columns="tableColumn"
      :filter-form.sync="filterForm"
      @checkboxChange="selection => (selectedList = selection)"
    />
  </div>
</template>

<script>
import Api from '../../api/executor'
import auditStatus from '@/views/earlyManage-epc/executor/lib/auditStatus'
export default {
  name: 'Trouble',
  data() {
    return {
      filterForm: {
        archiveFlag: 1
      },
      auditStatus,
      selectedList: [],
      request: body => {
        return Api.list(body)
      },
      // 表格表头
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'name',
          title: '申报文件名称',
          minWidth: 120
        },
        {
          field: 'confirmTime',
          title: '签署时间',
          minWidth: 120
        },
        {
          field: 'executorName',
          title: '执行人',
          minWidth: 120
        },
        {
          field: 'reportingUnit',
          title: '报审单位',
          minWidth: 120
        },
        {
          field: 'unit',
          title: '审批状态',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(auditStatus, row.auditStatus)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'faultTime',
          title: '操作',
          width: 240,
          fixed: 'right',
          align: 'left',
          slots: {
            default: ({ row }) => [
              //执行人
              this.$hasPower('EditArchive') && row.userType.includes(1) && row.auditStatus === 0 ? (
                <el-button type="text" onClick={() => this.toEdit(row.id, 1)}>
                  编辑
                </el-button>
              ) : null,
              this.$hasPower('EditArchive') && row.userType.includes(1) && row.auditStatus === 3 ? (
                <el-button type="text" onClick={() => this.toEdit(row.id, 1)}>
                  修改
                </el-button>
              ) : null,
              // this.$hasPower('DetailArchive') &&
              // row.userType.includes(1) &&
              // (row.auditStatus === 1 || row.auditStatus !== 3) ? (
              //   <el-button type="text" onClick={() => this.toEdit(row.id, 3)}>
              //     查看
              //   </el-button>
              // ) : null,
              //负责人
              this.$hasPower('AuditArchive') && row.userType.includes(2) && row.auditStatus === 1 ? (
                <el-button type="text" onClick={() => this.toEdit(row.id, 2)}>
                  审批
                </el-button>
              ) : null,
              // this.$hasPower('DetailArchive') && row.userType.includes(2) && row.auditStatus !== 1 ? (
              //   <el-button type="text" onClick={() => this.toEdit(row.id, 3)}>
              //     查看
              //   </el-button>
              // ) : null,
              //游客
              (this.$hasPower('DetailArchive') && row.auditStatus === 1) || row.auditStatus !== 3 ? (
                <el-button type="text" onClick={() => this.toEdit(row.id, 3)}>
                  查看
                </el-button>
              ) : null
            ]
          }
        }
      ]
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    toEdit(id, status) {
      if (status === 1) {
        this.$router.push({ name: `EditArchive`, params: { id, isEdit: true } })
      } else if (status === 2) {
        this.$router.push({ name: `EditArchive`, params: { id, isAudit: true } })
      } else if (status === 3) {
        this.$router.push({ name: `DetailArchive`, params: { id, isDetail: true } })
      }
    },
    toDetail(id) {
      this.$router.push({ name: `EquipmentDetail`, params: { id } })
    },
    async showCode(row) {
      const res = await Api.code(row)
      await saveAs(res.data, 'code.png')
    },
    showImport() {
      this.importVisible = true
    },
    async remove(rows) {
      await this.$tipRemove(rows)
      await Api.delete(rows[0].id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>
