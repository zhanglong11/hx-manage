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
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 400px;"
            placeholder="标准编号/法律法规及其他要求/颁布部门/使用部门/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="takeTime">
          <DateRange :startTime.sync="pageQuery.takeEffectStartDate" :endTime.sync="pageQuery.takeEffectEndDate" />
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
      <el-button v-if="$hasPower('SafeEducationLibraryAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
        >新建</el-button
      >
    </div>
    <div>
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
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/safe/education/library'

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
          field: 'code',
          title: '标准编号'
        },
        {
          field: 'lawsRegulations',
          title: '法律法规及其他要求',
          minWidth: 140
        },
        {
          field: 'issueDepartmentName',
          title: '颁布部门'
        },
        {
          field: 'evolveDate',
          title: '制（修）订日期',
          slots: {
            default: ({ row }) => [<span>{moment(row.evolveDate).format('YYYY-MM-DD')}</span>]
          },
          minWidth: 120
        },
        {
          field: 'takeEffectDate',
          title: '生效日期',
          slots: {
            default: ({ row }) => [<span>{moment(row.takeEffectDate).format('YYYY-MM-DD')}</span>]
          }
        },
        {
          field: 'useDepartmentName',
          title: '使用部门'
        },
        {
          field: 'remark',
          title: '备注'
        },
        {
          field: 'creatorName',
          title: '创建人'
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
                this.$hasPower('SafeEducationLibraryEdit') ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                this.$hasPower('SafeEducationLibraryDelete') ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                this.$hasPower('SafeEducationLibraryDetail') ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                    查看
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
      id ? this.$router.push({ path: `libraryEdit/${id}` }) : this.$router.push({ path: `libraryEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'libraryDetail', query: { id } })
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
