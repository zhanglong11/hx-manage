<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 200px;" placeholder="规范名称/规范编号/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.beginTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="filterForm.category" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in standardList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <template v-if="$hasPower('QualityAcceptanceSpecificationCommentPCDetail')">
          <el-form-item label="批注状态">
            <el-select v-model="filterForm.commentStatus">
              <el-option value="" label="全部"></el-option>
              <el-option :value="1" label="已批注"></el-option>
              <el-option :value="0" label="未批注"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('QualityPlanCheckStandardAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('checkStandardEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="specificationNumber" title="规范编号"></vxe-table-column>
      <vxe-table-column field="specificationName" title="规范名称"></vxe-table-column>
      <vxe-table-column
        field="category"
        title="类别"
        :formatter="({ cellValue }) => $getLabel(standardList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column
        v-if="$hasPower('QualityAcceptanceSpecificationCommentPCDetail')"
        field="commentStatus"
        title="批注状态"
        width="120px"
      >
        <template slot-scope="scope">
          <span class="comment-status" :class="{ active: scope.row.commentStatus }">{{
            scope.row.commentStatus ? '已批注' : '未批注'
          }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span v-if="$hasPower('QualityPlanCheckStandardEdit')" style="margin: 0 3px;"
            ><a @click="handleEdit(row.id)">编辑</a></span
          >
          <span v-if="$hasPower('QualityPlanCheckStandardDetail')" style="margin: 0 3px;">
            <a @click="handleDetail(row.id)">查看</a></span
          >
          <span v-if="$hasPower('QualityPlanCheckStandardDelete')" style="margin: 0 3px;"
            ><a @click="handleDelete(row.id)">删除</a></span
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import standardList from '../../lib/standardList'
import Api from '../../api/index'
export default {
  name: 'CheckStandard',
  data() {
    return {
      standardList,
      filterForm: {
        search: '',
        category: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.standard.list(body)
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
      this.$router.push({ name: `QualityPlanCheckStandardDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `QualityPlanCheckStandardEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该规范, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.standard.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
