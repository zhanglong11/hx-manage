<!--
* @任务编号: 2824 || 跳转功能调整
* @开发人员:张龙
* @日期:2020-03-09
* @任务类型:修改代码
-->
<template>
  <div>
    <el-form ref="pageQuery" :inline="true" :model="pageQuery">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="keyWord">
            <el-input
              v-model="pageQuery.keyWord"
              placeholder="设备保养单号/编码/名称"
              style="width: 190px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="保养日期" prop="maintenanceTime">
            <DateRange :startTime.sync="pageQuery.maintenanceStartTime" :endTime.sync="pageQuery.maintenanceEndTime" />
          </el-form-item>
          <el-form-item label="设备状态" prop="equipmentStatus">
            <el-select v-model="pageQuery.useStatus" placeholder="请选择状态" style="width: 120px;">
              <el-option
                v-for="item in paramList.equipmentStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
import api from '@/api/device/equipment/upKeep'
import paramList from '@/lib/paramList'
export default {
  name: 'UpKeep',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {},
      request: api.list,
      paramList,
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
        {
          field: 'maintenanceCode',
          title: '设备保养单号',
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
          field: 'principalName',
          title: '保养日期',
          minWidth: 100
        },
        {
          field: 'reason',
          title: '保养原因',
          minWidth: 100
        },
        {
          field: 'maintenanceMaterial',
          title: '保养所需材料',
          minWidth: 100
        },
        {
          field: 'principalName',
          title: '保养负责人',
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
      this.$router.push({ path: 'auditUpKeepDetail', query: { id } })
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
