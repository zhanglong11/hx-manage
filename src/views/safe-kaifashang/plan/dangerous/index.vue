<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyWords"
            style="width: 400px;"
            placeholder="危险源/关键部位/项目责任领导/责任人/责任人联系方式/创建人"
          ></el-input>
        </el-form-item>
        <el-form-item label="伤害类别">
          <el-select v-model="filterForm.harmCategory" :multiple="true" style="width: 100%;">
            <el-option v-for="item in harmTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in baseStatusList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险类别">
          <el-select v-model="filterForm.riskCategory" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in riskCategoryList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="filterForm.beginTime" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="filterForm.endTime" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('SafePlanDangerousAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('dangerousEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="dangerSource" title="危险源"></vxe-table-column>
      <vxe-table-column field="placeName" title="关键部位"></vxe-table-column>
      <vxe-table-column field="harmCategoryNames" title="伤害类别" min-width="120"></vxe-table-column>
      <vxe-table-column
        field="riskCategory"
        title="风险类别"
        :formatter="({ cellValue }) => $getLabel(riskCategoryList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="precautionaryMeasure" title="防范措施" min-width="120"></vxe-table-column>
      <vxe-table-column field="principalLeaderName" title="项目责任领导"></vxe-table-column>
      <vxe-table-column field="principalName" title="责任人"></vxe-table-column>
      <vxe-table-column field="principalContact" title="责任人联系方式" width="120"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" width="100"></vxe-table-column>
      <vxe-table-column
        field="beginTime"
        title="开始时间"
        width="140"
        :formatter="({ cellValue }) => (cellValue ? moment(cellValue).format('YYYY-MM-DD') : '')"
      />
      <vxe-table-column
        field="endTime"
        title="结束时间"
        width="140"
        :formatter="({ cellValue }) => (cellValue ? moment(cellValue).format('YYYY-MM-DD') : '')"
      />
      <vxe-table-column field="createTime" title="创建时间" width="140"></vxe-table-column>
      <!-- <vxe-table-column
        field="status"
        title="状态"
        :formatter="({ cellValue }) => $getLabel(baseStatusList, cellValue)"
      ></vxe-table-column> -->
      <vxe-table-column title="操作" width="160px">
        <template slot-scope="{ row }">
          <span style="margin: 0 3px;">
            <a v-if="$hasPower('SafePlanDangerousDetail')" @click="handleDetail(row.id)">查看</a></span
          >
          <template>
            <span style="margin: 0 3px;"
              ><a v-if="$hasPower('SafePlanDangerousEdit')" @click="handleEdit(row.id)">编辑</a></span
            >
            <span style="margin: 0 3px;"
              ><a v-if="$hasPower('SafePlanDangerousDelete')" @click="handleDelete(row.id)">删除</a></span
            >
          </template>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import harmTypeList from '../../lib/harmTypeList'
import baseStatusList from '../../lib/baseStatusList'
import riskCategoryList from '../../lib/riskCategoryList'
import Api from '../../api/index'
export default {
  name: 'DangerousList',
  data() {
    return {
      harmTypeList,
      baseStatusList,
      riskCategoryList,
      filterForm: {
        projectId: this.$store.state.project.projectId,
        keyWords: '',
        harmCategory: [],
        status: '',
        riskCategory: ''
      },
      request(body) {
        return Api.dangerous.getDangerousList(body)
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
      this.$router.push({ name: `SafePlanDangerousDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `SafePlanDangerousEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该危险源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.dangerous.deleteDangerousById(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
