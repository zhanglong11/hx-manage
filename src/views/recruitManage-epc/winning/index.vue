<template>
  <div>
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="" prop="keyword">
          <el-input v-model="filterForm.keyword" placeholder="招标公告名称/中标单位" />
        </el-form-item>
        <el-form-item label="中标类型" prop="type">
          <el-select v-model="filterForm.type">
            <el-option v-for="item of tenderTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="中标方式" prop="mode">
          <el-select v-model="filterForm.mode">
            <el-option v-for="item of tenderModeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status">
            <el-option v-for="item of statusList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :start-time.sync="filterForm.startDate" :end-time.sync="filterForm.endDate" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <el-row>
      <el-col>
        <el-button v-if="$hasPower('AddWinningEpc')" type="primary" @click="addNew">新建中标资料</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;">
      <Grid ref="table" :filter-form.sync="filterForm" :request="request">
        <vxe-table-column type="index" title="序号" width="80" />
        <vxe-table-column field="invitationBidName" title="招标公告名称" />
        <vxe-table-column
          field="type"
          title="中标类型"
          :formatter="({ cellValue }) => $getLabel(tenderTypeList, cellValue)"
        />
        <vxe-table-column
          field="mode"
          title="中标方式"
          :formatter="({ cellValue }) => $getLabel(tenderModeList, cellValue)"
        />
        <vxe-table-column field="tenderCompany" title="中标单位" />
        <vxe-table-column field="publicityDate" title="公示日期" formatter="ymd" />
        <vxe-table-column field="tenderMoney" title="中标金额(元)" />
        <vxe-table-column field="remark" title="备注" />
        <vxe-table-column field="creatorName" title="创建人" />
        <vxe-table-column field="createTime" title="创建时间" width="150" />
        <vxe-table-column
          field="status"
          title="状态"
          :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
        />
        <vxe-table-column title="操作" width="150">
          <template slot-scope="{ row }">
            <el-button v-if="$hasPower('WinningDetailEpc')" type="text" @click="toDetail(row)">查看</el-button>
            <template v-if="row.status === 0">
              <el-button v-if="$hasPower('EditWinningEpc')" type="text" @click="toEdit(row)">编辑</el-button>
              <el-button v-if="$hasPower('DeleteWinningEpc')" type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </template>
        </vxe-table-column>
      </Grid>
    </div>
  </div>
</template>

<script>
import statusList from '../lib/status'
import publicStatusList from '../lib/publicStatus'
import Api from '../api'
export default {
  name: 'WinningList',
  components: {},
  props: {},
  data() {
    return {
      statusList,
      publicStatusList,
      filterForm: {},
      request: body => {
        return Api.getWinningList({ ...body, projectId: localStorage.getItem('projectId') })
      }
    }
  },
  computed: {
    tenderTypeList() {
      return this.$getArgList('tenderType')
    },
    tenderModeList() {
      return this.$getArgList('tenderMode')
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    addNew() {
      this.$router.push({ name: 'AddWinningEpc', params: { id: '' } })
    },
    toEdit(row) {
      this.$router.push({ name: 'EditWinningEpc', params: { id: row.id } })
    },
    // 查看任务
    toDetail(row) {
      this.$router.push({ name: 'WinningDetailEpc', params: { id: row.id, isCheck: false } })
    },
    async handleDelete(row) {
      await this.$confirm('此操作将删除该招标公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      let res = await Api.deleteWinning(row.id)
      if (res) this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
