<!--
* @任务编号:2824||设备管理组件替换，列表接口对接
* @开发人员:张龙
* @日期:2020-03-03
* @任务类型: 修改代码
-->
<!--
* @任务编号: 2711 || 设备管理功能完善
* @开发人员:张龙
* @日期:2020-03-26
* @任务类型: 新代码
-->
<template>
  <div>
    <el-form ref="pageQuery" :inline="true" :model="pageQuery">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="keyWord">
            <el-input
              v-model="pageQuery.keyWord"
              placeholder="编码/名称/规格及型号/退场负责人/创建人"
              style="width: 284px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="进场日期" prop="enterTime">
            <DateRange :startTime.sync="pageQuery.enterStartTime" :endTime.sync="pageQuery.enterEndTime" />
          </el-form-item>
          <el-form-item label="退场日期" prop="leaveTime">
            <DateRange :startTime.sync="pageQuery.leaveStartTime" :endTime.sync="pageQuery.leaveEndTime" />
          </el-form-item>
          <el-form-item label="设备状态" prop="useStatus">
            <SelectList v-model="pageQuery.useStatus" type="equipmentStatus" style="width: 120px;" />
          </el-form-item>
          <el-form-item label="创建时间" prop="time">
            <DateRange :startTime.sync="pageQuery.createStartTime" :endTime.sync="pageQuery.createEndTime" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <SelectList v-model="pageQuery.status" type="deviceCommonStatus" style="width: 120px;" />
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </li>
      </ul>
    </el-form>

    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="toEdit(null)">新增</el-button>
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
import api from '@/api/device/equipment/outArena'
import paramList from '@/lib/paramList'
export default {
  name: 'OutArena',
  mixins: [PageMixin],
  data() {
    return {
      isOut: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      pageQuery: {},
      paramList,
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'equipmentNum',
          title: '编码',
          minWidth: 100
        },
        {
          field: 'equipmentName',
          title: '名称',
          minWidth: 100
        },
        {
          field: 'specification',
          title: '规格及型号',
          minWidth: 100
        },
        // {
        //   field: 'useStatus',
        //   title: '设备状态',
        //   slots: {
        //     default: ({ row }) => [
        //       <span>{_.get(_.find(paramList.equipmentStatus, { value: row.useStatus }), 'label')}</span>
        //     ]
        //   },
        //   minWidth: 100
        // },
        {
          field: 'leaveCode',
          title: '设备退场单号',
          minWidth: 100
        },
        {
          field: 'enterTime',
          title: '进场日期',
          minWidth: 100
        },
        {
          field: 'actualLeaveTime',
          title: '退场日期',
          minWidth: 100
        },
        {
          field: 'principalName',
          title: '退场负责人',
          minWidth: 100
        },
        {
          field: 'settlementFlag',
          title: '是否结算',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(this.isOut, { value: row.settlementFlag }), 'label')}</span>]
          },
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
              <span>{_.get(_.find(paramList.deviceCommonStatus, { value: row.status }), 'label')}</span>
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
                row.status === 0 ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                row.status === 0 ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
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
      id ? this.$router.push({ path: `addOutArena/${id}` }) : this.$router.push({ path: `addOutArena` })
    },
    toDetail(id) {
      this.$router.push({ name: 'OutArenaDetail', params: { id } })
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

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
