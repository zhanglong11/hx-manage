<!--
* @任务编号: 2824 || 接口调用以及echarts图配置
* @开发人员:张龙
* @日期:2020-03-12
* @任务类型:修改代码
-->
<!--
* @任务编号: 2824 || 列表页显示问题
* @开发人员:张龙
* @日期:2020-03-05
* @任务类型:修改代码
-->
<!--
* @任务编号: 2824 || 逻辑修改
* @开发人员:张龙
* @日期:2020-03-11
* @任务类型:修改代码
-->
<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 400px;"
            placeholder="安全文明计划编号/安全文明检查编号/检查部位/检查单位/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="检查日期" prop="checkTime">
          <DateRange :startTime.sync="pageQuery.checkStartDate" :endTime.sync="pageQuery.checkEndDate" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
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
import api from '@/api/safe/process/cultureCheck'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        status: null
      },
      request: api.list,
      checkResult: [
        { value: 0, label: '未整改' },
        {
          value: 1,
          label: '已整改'
        }
      ],
      isSubmit: [
        { value: 0, label: '草稿' },
        { value: 1, label: '已提交' }
      ],
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'civilizationCheckNumber',
          title: '安全文明检查编号',
          minWidth: 140
        },
        {
          field: 'safetyCivilizationNumber',
          title: '安全文明计划编号',
          minWidth: 140
        },
        {
          field: 'placeName',
          title: '检查部位',
          minWidth: 100
        },
        {
          field: 'checkCompanyName',
          title: '检查单位',
          minWidth: 100
        },
        {
          field: 'checkedCompanyName',
          title: '受检单位',
          minWidth: 100
        },
        {
          field: 'checkedRepresentativeName',
          title: '受检方代表',
          minWidth: 100
        },
        {
          field: 'checkDate',
          title: '检查日期',
          minWidth: 100
        },
        {
          field: 'checkPersonName',
          title: '检查人员',
          minWidth: 100
        },
        {
          field: 'checkResult',
          title: '检查结果',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.safeCheckStandard, { value: row.status }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'draftFlag',
          title: '状态',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(this.isSubmit, { value: row.draftFlag }), 'label')}</span>]
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
          //日期显示问题 张龙 3-30
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
                !row.draftFlag ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                !row.draftFlag ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  查看
                </el-button>,
                row.draftFlag && row.checkResult === 0 ? (
                  <el-button type="text" onClick={() => this.toTidy(row.id)}>
                    安全整改
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
      this.$router.push({ path: 'cultureCheckEdit', query: { id } })
    },
    toDetail(id) {
      this.$router.push({ path: 'cultureCheckDetail', query: { id } })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await api.delete(row.id)
      this.$message.success('删除成功')
      this.getList()
    },
    toTidy(id) {
      this.$router.push({ path: '/safe/process/cultureTidy', query: { id } })
    }
  }
}
</script>

<style scoped></style>
