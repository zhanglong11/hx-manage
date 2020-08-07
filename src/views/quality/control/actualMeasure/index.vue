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
          <el-input v-model="pageQuery.search" style="width: 280px;" placeholder="实测部位/测量项目/测量内容/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="分项工程" prop="status">
          <SelectList v-model="pageQuery.status" type="standardTypeList" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
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
import api from '@/api/quality/control/actualMeasure'

export default {
  name: 'CheckStandard',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        status: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'engineeringName',
          title: '分项工程',
          minWidth: 100
        },
        {
          field: 'measureContent',
          title: '测量项目',
          minWidth: 100
        },
        {
          field: 'measureContent',
          title: '测量内容',
          minWidth: 100
        },
        {
          field: 'eyeball',
          title: '实测点',
          minWidth: 100
        },
        {
          field: 'qualifiedPoint',
          title: '合格点',
          minWidth: 100
        },
        {
          field: 'name',
          title: '合格率',
          slots: {
            default: ({ row }) => {
              return [<span>{this.getPercentFun(row.qualifiedPoint, row.eyeball)}</span>]
            }
          },
          minWidth: 100
        },
        {
          field: 'criticalPoints',
          title: '爆点数',
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
      id ? this.$router.push({ path: `actualMeasureEdit/${id}` }) : this.$router.push({ path: `actualMeasureEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'actualMeasureDetail', query: { id } })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await api.delete(row.id)
      this.$message.success('删除成功')
      this.getList()
    },
    getPercentFun(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0 + '%'
    }
  }
}
</script>

<style scoped></style>
