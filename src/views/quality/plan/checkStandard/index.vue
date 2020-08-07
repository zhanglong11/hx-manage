<!--
* @任务编号:2824||质量管理添加搜索图标，日期组件替换
* @开发人员:张龙
* @日期:2020-03-01
* @任务类型: 全新代码
-->
<!--
* @任务编号:实现table初始化功能
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 修改代码
-->
<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.search" placeholder="规范名称/规范编号/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <SelectList v-model="pageQuery.category" type="standardTypeList" />
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
      ref="table"
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
import api from '@/api/quality/plan/checkStandard'
export default {
  name: 'CheckStandard',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        search: '',
        category: ''
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'specificationNumber',
          title: '规范编号'
        },
        {
          field: 'specificationName',
          title: '规范名称'
        },
        {
          field: 'category',
          title: '类别',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.standardTypeList, { value: row.category }), 'label')}</span>
            ]
          }
        },
        {
          field: 'creatorName',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间'
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
      id ? this.$router.push({ path: `checkStandardEdit/${id}` }) : this.$router.push({ path: `checkStandardEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'checkStandardDetail', query: { id } })
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
