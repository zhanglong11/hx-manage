<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="equipmentName">
          <el-input
            v-model="pageQuery.equipmentName"
            style="width: 260px;"
            placeholder="单位工程编号/单位工程名称/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="资料类型" prop="materialType">
          <SelectList v-model="pageQuery.materialType" type="infoDataType" />
        </el-form-item>
        <el-form-item label="项目种类" prop="projectType">
          <SelectList v-model="pageQuery.projectType" type="projectTypeList" />
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
import api from '@/api/quality/acceptance/projectInfo'
export default {
  name: 'FinishProtect',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        search: '',
        time: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'engineeringNumber',
          title: '单位工程编号',
          minWidth: 100
        },
        {
          field: 'engineeringName',
          title: '单位工程名称',
          minWidth: 100
        },
        {
          field: 'materialType',
          title: '资料类型',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.infoDataType, { value: row.materialType }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'projectType',
          title: '项目种类',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.projectTypeList, { value: row.projectType }), 'label')}</span>
            ]
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
      id ? this.$router.push({ path: `projectInfoEdit/${id}` }) : this.$router.push({ path: `projectInfoEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'projectInfoDetail', query: { id } })
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
