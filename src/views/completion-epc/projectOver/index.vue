<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="filterForm" inline>
        <el-form-item label="">
          <el-input v-model="filterForm.search" placeholder="工程移交名称/验收范围" />
        </el-form-item>
        <el-form-item label="移交状态">
          <SelectList v-model="filterForm.status" :self-list="overStatus" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
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
import Api from '@/views/completion-epc/api/projectOver'
import overStatus from '../lib/overStatus'
export default {
  name: 'ProjectOverEpc',
  data() {
    return {
      filterForm: {},
      overStatus,
      selectedList: [],
      request: body => {
        return Api.getList(body)
      },
      // 表格表头
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'transferName',
          title: '工程移交名称',
          minWidth: 120
        },
        {
          field: 'transferUnit',
          title: '移交单位',
          minWidth: 120
        },
        {
          field: 'takeOverUnit',
          title: '接管单位',
          minWidth: 120
        },
        {
          field: 'transferScope',
          title: '验收范围',
          minWidth: 120
        },
        {
          field: 'acceptancePassTime',
          title: '验收合格日期',
          minWidth: 120,
          slots: {
            default: ({ row }) => {
              return [<span>{row.acceptancePassTime ? moment(row.acceptancePassTime).format('YYYY-MM-DD') : ''}</span>]
            }
          }
        },
        {
          field: 'transferTime',
          title: '移交时间',
          minWidth: 120
        },
        {
          field: 'transferPersonName',
          title: '移交人',
          minWidth: 120
        },
        {
          field: 'status',
          title: '移交状态',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(overStatus, row.status)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'remark',
          title: '备注',
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
              this.$hasPower('DetailProjectOverEpc') ? (
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  查看
                </el-button>
              ) : null,
              //待移交
              this.$hasPower('EditProjectOverEpc') && row.status === 0 ? (
                <el-button type="text" onClick={() => this.toEdit(row)}>
                  编辑
                </el-button>
              ) : null,

              this.$hasPower('TurnProjectOverEpc') && row.status === 0 && row.transferName && row.transferUnit ? (
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  移交
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
    toEdit(row) {
      this.$router.push({ name: `EditProjectOverEpc`, params: { row } })
    },
    toDetail(id) {
      this.$router.push({ name: `DetailProjectOverEpc`, params: { id } })
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
