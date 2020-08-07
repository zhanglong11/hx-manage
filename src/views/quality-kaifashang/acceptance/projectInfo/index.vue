<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 260px;" placeholder="单位工程编号/单位工程名称/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="资料类型" prop="materialType">
          <el-select v-model="filterForm.materialType" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in materialTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目种类" prop="materialType">
          <el-select v-model="filterForm.projectType" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in projectTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('QualityAcceptanceProjectInfoAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('projectInfoEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="engineeringNumber" title="单位工程编号"></vxe-table-column>
      <vxe-table-column field="engineeringName" title="单位工程名称"></vxe-table-column>
      <vxe-table-column
        field="materialType"
        title="资料类型"
        :formatter="({ cellValue }) => $getLabel(materialTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        field="projectType"
        title="项目种类"
        :formatter="({ cellValue }) => $getLabel(projectTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span v-if="$hasPower('QualityAcceptanceProjectInfoEdit')" style="margin: 0 3px;"
            ><a @click="handleEdit(row.id)">编辑</a></span
          >
          <span v-if="$hasPower('QualityAcceptanceProjectInfoDetail')" style="margin: 0 3px;">
            <a @click="handleDetail(row.id)">查看</a></span
          >
          <span v-if="$hasPower('QualityAcceptanceProjectInfoDelete')" style="margin: 0 3px;"
            ><a @click="handleDelete(row.id)">删除</a></span
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>
<script>
import materialTypeList from '../../lib/materialTypeList'
import projectTypeList from '../../lib/projectTypeList'
import Api from '../../api/index'
export default {
  name: 'CheckStandard',
  data() {
    return {
      materialTypeList,
      projectTypeList,
      filterForm: {
        search: '',
        materialType: '',
        projectType: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.projectInfo.list(body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    handleDetail(id) {
      this.$router.push({ name: `QualityAcceptanceProjectInfoDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `QualityAcceptanceProjectInfoEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该单位工程资料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.projectInfo.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
