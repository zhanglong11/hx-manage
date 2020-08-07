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
              placeholder="编码/名称/规格及型号/使用人/安装地点/创建人"
              style="width: 314px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <!--          <el-form-item label="创建时间" prop="createTime">-->
          <!--            <el-date-picker-->
          <!--              v-model="pageQuery.createTime"-->
          <!--              type="daterange"-->
          <!--              range-separator="至"-->
          <!--              start-placeholder="请选择"-->
          <!--              end-placeholder="请选择"-->
          <!--              style="width: 220px"-->
          <!--            ></el-date-picker>-->
          <!--          </el-form-item>-->
          <el-form-item label="创建时间" prop="time">
            <DateRange
              :startTime.sync="pageQuery.createStartTime"
              :endTime.sync="pageQuery.createEndTime"
              style="width: 220px;"
            />
          </el-form-item>
          <!--          <el-form-item label="状态" prop="status">-->
          <!--            <el-select v-model="pageQuery.status" placeholder="请选择状态" style="width: 120px;">-->
          <!--              <el-option label="草稿" value="1"></el-option>-->
          <!--              <el-option label="待审核" value="2"></el-option>-->
          <!--              <el-option label="已通过" value="3"></el-option>-->
          <!--              <el-option label="已驳回" value="4"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="设备状态" prop="useStatus">
            <el-select v-model="pageQuery.useStatus" placeholder="请选择状态" style="width: 120px;">
              <el-option
                v-for="item in paramList.equipmentStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
import api from '@/api/device/equipment/standingBook'
import paramList from './selectList'
export default {
  name: 'StandingBook',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        search: '',
        category: ''
      },
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
        {
          field: 'useStatus',
          title: '设备状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.equipmentStatus, { value: row.useStatus }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'equipmentType',
          title: '设备属性',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.equipmentType, { value: row.equipmentType }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'principalName',
          title: '使用人',
          minWidth: 100
        },
        {
          field: 'depositLocation',
          title: '安装地点',
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
      id ? this.$router.push({ path: `addStandingBook/${id}` }) : this.$router.push({ path: `addStandingBook` })
    },
    toDetail(id) {
      this.$router.push({ path: 'standingBookDetail', query: { id } })
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
