<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.keyWords" style="width: 240px;" placeholder="安全事故编号/事故地点/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="事故日期">
          <DateRange :startTime.sync="filterForm.accidentStartDate" :endTime.sync="filterForm.accidentEndDate" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.createTimeStart" :endTime.sync="filterForm.createTimeEnd" />
        </el-form-item>
        <el-form-item label="事故类型">
          <el-select v-model="filterForm.accidentType" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in accidentTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="事故等级">
          <el-select v-model="filterForm.accidentLevel" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in accidentLevelList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="事故性质">
          <el-select v-model="filterForm.accidentNature" style="width: 100%;">
            <el-option :value="null" label="全部" />
            <el-option v-for="item in accidentNatureList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <template v-if="$hasPower('SafeProcessAccidentCommentPCDetail')">
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
          v-if="$hasPower('SafeProcessAccidentAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('accidentEdit')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="accidentNumber" title="安全事故编号"></vxe-table-column>
      <vxe-table-column
        field="accidentType"
        title="事故类型"
        :formatter="({ cellValue }) => $getLabel(accidentTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        field="accidentLevel"
        title="事故等级"
        :formatter="({ cellValue }) => $getLabel(accidentLevelList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        field="accidentNature"
        title="事故性质"
        :formatter="({ cellValue }) => $getLabel(accidentNatureList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="deathNumber" title="死亡人数"></vxe-table-column>
      <vxe-table-column field="seriousInjuryNumber" title="重伤人数"></vxe-table-column>
      <vxe-table-column field="minorWoundNumber" title="轻伤人数"></vxe-table-column>
      <vxe-table-column field="accidentDate" title="事故日期" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="accidentPosition" title="事故地点"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="150"></vxe-table-column>
      <vxe-table-column
        v-if="$hasPower('SafeProcessAccidentCommentPCDetail')"
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
          <span style="margin: 0 3px;">
            <a v-if="$hasPower('SafeProcessAccidentDetail')" @click="handleDetail(row.id)">查看</a></span
          >
          <span style="margin: 0 3px;"
            ><a v-if="$hasPower('SafeProcessAccidentEdit')" @click="handleEdit(row.id)">编辑</a></span
          >
          <span style="margin: 0 3px;"
            ><a v-if="$hasPower('SafeProcessAccidentDelete')" @click="handleDelete(row.id)">删除</a></span
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import accidentTypeList from '../../lib/accidentTypeList'
import accidentLevelList from '../../lib/accidentLevelList'
import accidentNatureList from '../../lib/accidentNatureList'
import Api from '../../api/index'
export default {
  name: 'AccidentResolve',
  data() {
    return {
      accidentTypeList,
      accidentLevelList,
      accidentNatureList,
      filterForm: {
        keyWords: '',
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.accidentResolve.list(body)
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
      this.$router.push({ name: `SafeProcessAccidentDetail`, params: { id: id, isCheck: false } })
    },
    handleEdit(id) {
      this.$router.push({ name: `SafeProcessAccidentEdit`, params: { id: id } })
    },
    async handleDelete(id) {
      await this.$confirm('此操作将删除该事故, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      await Api.accidentResolve.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
