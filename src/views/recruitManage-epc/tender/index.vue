<template>
  <div class="outContainer">
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="" prop="keyword">
          <el-input v-model="filterForm.keyword" placeholder="招标公告名称/招标项目编号/填报人" style="width: 250px;">
            <i slot="suffix" class="el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="招标类型" prop="type">
          <el-select v-model="filterForm.type">
            <el-option v-for="item of tenderTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="招标方式" prop="mode">
          <el-select v-model="filterForm.mode">
            <el-option v-for="item of tenderModeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="auditStatus">
          <el-select v-model="filterForm.auditStatus">
            <el-option v-for="item of statusList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" prop="publishStatus">
          <el-select v-model="filterForm.publishStatus">
            <el-option v-for="item of publicStatusList" :key="item.value" :value="item.value" :label="item.label" />
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
        <el-button v-if="$hasPower('AddTenderEpc')" type="primary" @click="addNew">新建招标公告</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;">
      <Grid ref="table" :filter-form.sync="filterForm" :request="request">
        <vxe-table-column type="index" title="序号" width="80" />
        <vxe-table-column field="name" title="招标公告名称" />
        <vxe-table-column field="code" title="招标公告编码" />
        <vxe-table-column
          field="type"
          title="招标类型"
          :formatter="({ cellValue }) => $getLabel(tenderTypeList, cellValue)"
        />
        <vxe-table-column
          field="mode"
          title="招标方式"
          :formatter="({ cellValue }) => $getLabel(tenderModeList, cellValue)"
        />
        <vxe-table-column field="publishDate" title="公告发布日期" formatter="ymd" />
        <vxe-table-column field="endDate" title="投标截止日期" formatter="ymd" />
        <vxe-table-column field="remark" title="备注" />
        <vxe-table-column
          field="publishStatus"
          title="发布状态"
          :formatter="({ cellValue }) => $getLabel(publicStatusList, cellValue)"
        />
        <vxe-table-column field="creatorName" title="创建人" />
        <vxe-table-column field="createTime" title="创建时间" width="150" />
        <vxe-table-column
          field="auditStatus"
          title="状态"
          :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
        />
        <vxe-table-column title="操作" width="150">
          <template slot-scope="{ row }">
            <el-button v-if="$hasPower('TenderDetailEpc')" type="text" @click="toDetail(row)">查看</el-button>
            <template v-if="row.auditStatus === 0">
              <el-button v-if="$hasPower('EditTenderEpc')" type="text" @click="toEdit(row)">编辑</el-button>
              <el-button v-if="$hasPower('DeleteTenderEpc')" type="text" @click="handleDelete(row)">删除</el-button>
            </template>
            <!-- <template v-if="row.auditStatus === 1">
              <el-button type="text" @click="handleAudit(row)">审核</el-button>
            </template>-->
            <template v-if="row.auditStatus === 2 && [0, 2].includes(row.publishStatus)">
              <el-button v-if="$hasPower('PublishTenderEpc')" type="text" @click="handlePublish(row)">发布</el-button>
            </template>
            <template v-if="row.auditStatus === 2 && row.publishStatus === 1">
              <el-button v-if="$hasPower('WithdrawTenderEpc')" type="text" @click="handleWithdraw(row)">撤回</el-button>
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
  name: 'TenderList',
  components: {},
  props: {},
  data() {
    return {
      statusList,
      publicStatusList,
      filterForm: {},
      request: body => {
        return Api.getTenderList({ ...body, projectId: localStorage.getItem('projectId') })
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
      this.$router.push({ name: 'AddTenderEpc', params: { id: '' } })
    },
    toEdit(row) {
      this.$router.push({ name: 'EditTenderEpc', params: { id: row.id } })
    },
    // 查看任务
    toDetail(row) {
      this.$router.push({ name: 'TenderDetailEpc', params: { id: row.id, isCheck: false } })
    },
    async handleAudit(row) {
      await Api.audit(row.id)
      this.refresh()
    },
    //发布
    async handlePublish(row) {
      await Api.publish(row.id)
      this.refresh()
    },
    //撤回
    async handleWithdraw(row) {
      await Api.withdraw(row.id)
      this.refresh()
    },
    //删除
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
      let res = await Api.deleteTender(row.id)
      if (res) this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
