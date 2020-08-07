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
          <el-input v-model="pageQuery.keyWords" style="width: 240px;" placeholder="安全事故编号/事故地点/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="事故日期" prop="accidentTime">
          <DateRange :startTime.sync="pageQuery.accidentStartDate" :endTime.sync="pageQuery.accidentEndDate" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
        </el-form-item>
        <el-form-item label="事故类别" prop="accidentType">
          <SelectList v-model="pageQuery.accidentType" type="accidentType" />
        </el-form-item>
        <el-form-item label="事故等级" prop="accidentLevel">
          <SelectList v-model="pageQuery.accidentLevel" type="accidentLevel" />
        </el-form-item>
        <el-form-item label="事故性质" prop="accidentNature">
          <SelectList v-model="pageQuery.accidentNature" type="accidentNature" />
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
import api from '@/api/safe/process/accident'
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
          field: 'accidentNumber',
          title: '安全事故编号',
          minWidth: 100
        },
        {
          field: 'accidentType',
          title: '事故类型',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.accidentType, { value: row.accidentType }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'accidentLevel',
          title: '事故等级',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.accidentLevel, { value: row.accidentLevel }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'count',
          title: '事故性质',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.accidentNature, { value: row.accidentNature }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'deathNumber',
          title: '死亡人数',
          minWidth: 100
        },
        {
          field: 'seriousInjuryNumber',
          title: '重伤人数',
          minWidth: 100
        },
        {
          field: 'minorWoundNumber',
          title: '轻伤人数',
          minWidth: 100
        },
        {
          field: 'accidentDate',
          title: '事故日期',
          minWidth: 100
        },
        {
          field: 'accidentPosition',
          title: '事故地点',
          minWidth: 100
        },
        {
          field: 'remark',
          title: '备注',
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
      id ? this.$router.push({ path: `accidentEdit/${id}` }) : this.$router.push({ path: `accidentEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'accidentDetail', query: { id } })
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
