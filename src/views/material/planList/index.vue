<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyword"
            style="width: 300px;"
            placeholder="甲供材计划编号/甲供材计划名称/关联合同编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="filterForm.auditStatus">
            <el-option
              v-for="item in auditStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="filterForm.__createTime" style="width: 240px;" type="daterange"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button icon="el-icon-search" type="primary" @click="() => $refs.table.refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="() => $refs.table.reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button
          v-if="$hasPower('MaterialPlanListAdd')"
          class="el-icon-plus"
          type="primary"
          @click="$router.push('planList/add')"
        >
          新建
        </el-button>
      </el-form>
    </div>
    <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="supplyPlanCode" title="甲供材计划编号"></vxe-table-column>
      <vxe-table-column field="supplyPlanName" title="甲供材计划名称"></vxe-table-column>
      <vxe-table-column field="contractCode" title="关联合同编号"></vxe-table-column>
      <vxe-table-column title="材料确认单数量" width="140px">
        <template v-slot="{ row }">
          <router-link
            v-if="$hasPower('MaterialConfirmCodeDetail')"
            :to="`confirmCode?supplyPlanId=${row.id}&status=2`"
          >
            {{ row.confirmBillNum }}
          </router-link>
          <span v-else>{{ row.confirmBillNum }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" width="120px"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" formatter="ymd" width="120px"></vxe-table-column>
      <vxe-table-column
        field="auditStatus"
        title="审核状态"
        width="100px"
        :formatter="({ cellValue }) => $getLabel(auditStatusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        field="supplyStatus"
        title="计划状态"
        width="200px"
        :formatter="({ cellValue }) => $getLabel(supplyStatus, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="160px">
        <template v-slot="{ row }">
          <el-button
            v-if="$hasPower('MaterialPlanListView')"
            type="text"
            @click="$router.push('planList/' + row.id + '/view')"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('MaterialPlanListEdit') && row.auditStatus === 0"
            type="text"
            @click="$router.push('planList/' + row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="$hasPower('MaterialPlanListEdit') && row.auditStatus === 2 && row.supplyStatus === 1"
            type="text"
            @click="finishSupply(row)"
            >供货完成</el-button
          >
          <el-button
            v-if="$hasPower('MaterialPlanListDelete') && row.auditStatus === 0"
            type="text"
            @click="remove(row)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import auditStatusList from './lib/auditStatus'
import supplyStatus from './lib/supplyStatus'
export default {
  name: 'MaterialPlanList',
  data() {
    return {
      auditStatusList,
      supplyStatus,
      filterForm: {
        projectId: this.$store.state.project.projectId,
        contractId: this.$route.query.contractId,
        auditStatus: +this.$route.query.auditStatus || null
      },
      request(body) {
        if (_.size(body.__createTime) === 2) {
          body.createStartTime = moment(body.__createTime[0]).format('YYYY-MM-DD 00:00:00')
          body.createEndTime = moment(body.__createTime[1]).format('YYYY-MM-DD 23:59:59')
          delete body.__createTime
        }
        return this.axios.construction.post('materialSupplyPlan/list', body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    finishSupply(row) {
      this.$confirm('确认供货完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.construction.get(`materialSupplyPlan/${row.id}/finishSupply`).then(res => {
          this.$message.success('操作成功')
          this.refresh()
        })
      })
    },
    remove(row) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.construction.post('materialSupplyPlan/delete/' + row.id).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
