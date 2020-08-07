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
            <!--bug号：1024、修改人：董渊海、修改时间：2020-03-23-->
            <el-input
              v-model="pageQuery.keyWord"
              placeholder="编码/名称/检定人/检定单位/登记机构"
              style="width: 260px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="检定时间" prop="inspectTime">
            <DateRange
              :startTime.sync="pageQuery.inspectStartTime"
              :endTime.sync="pageQuery.inspectEndTime"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="创建时间" prop="time">
            <DateRange
              :startTime.sync="pageQuery.createStartTime"
              :endTime.sync="pageQuery.createEndTime"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <SelectList v-model="pageQuery.status" type="deviceCommonStatus" style="width: 120px;" />
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
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
import api from '@/api/device/equipment/docimasyRecord'
import paramList from '@/lib/paramList'
export default {
  name: 'DocimasyRecord',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {},
      request: api.list,
      paramList,
      checkStatus: [
        { value: 0, label: '不合格' },
        { value: 1, label: '合格' }
      ],
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
          field: 'inspectTime',
          title: '检定日期',
          minWidth: 100
        },
        {
          field: 'specialEquipmentVerifyNum',
          title: '检定单号',
          minWidth: 100
        },
        {
          field: 'inspectUnit',
          title: '检定单位',
          minWidth: 100
        },
        {
          field: 'inspectorName',
          title: '检定人',
          minWidth: 100
        },
        // bug 1389 张龙 3-31
        {
          field: 'inspectOpinion',
          title: '检定内容',
          minWidth: 100
        },
        {
          field: 'inspectResult',
          title: '检定结果',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(this.checkStatus, { value: row.inspectResult }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'registry',
          title: '登记机构',
          minWidth: 100
        },
        {
          field: 'specialEquipmentValidity',
          title: '特种设备审验有效期',
          minWidth: 160
        },
        {
          field: 'specialEquipmentVerifyNum',
          title: '特种设备审验证号',
          minWidth: 160
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
      id ? this.$router.push({ path: `addDocimasyRecord/${id}` }) : this.$router.push({ path: `addDocimasyRecord` })
    },
    toDetail(id) {
      this.$router.push({ name: 'DocimasyRecordDetail', params: { id } })
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
