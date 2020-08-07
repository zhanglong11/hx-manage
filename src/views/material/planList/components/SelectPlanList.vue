<template>
  <div>
    <el-dialog title="选择甲供材计划单" :visible="visible" width="1200px" @close="$emit('update:visible', false)">
      <div class="tooltips">
        <el-form inline>
          <el-form-item>
            <el-input
              v-model="filterForm.keyword"
              style="width: 300px;"
              placeholder="甲供材计划编号/甲供材计划名称/关联合同编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="filterForm.__createTime" type="daterange"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" @click="() => $refs.table.refresh()">搜索</el-button>
              <el-button @click="() => $refs.table.reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
      <Grid
        ref="table"
        align="center"
        highlightCurrentRow
        :request="request"
        :filter-form.sync="filterForm"
        :radio-config="{ checkRowKey: checkRowKey, trigger: 'row', highlight: true }"
        @currentChange="save"
        @radioChange="handleRadioChange"
      >
        <vxe-table-column type="radio" width="60"> </vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
        <vxe-table-column field="supplyPlanCode" title="甲供材计划编号"></vxe-table-column>
        <vxe-table-column field="supplyPlanName" title="甲供材计划名称"></vxe-table-column>
        <vxe-table-column field="contractCode" title="关联合同编号"></vxe-table-column>
        <vxe-table-column
          field="supplyStatus"
          title="计划状态"
          :formatter="({ cellValue }) => $getLabel(supplyStatus, cellValue)"
        ></vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人" width="120px"></vxe-table-column>
        <vxe-table-column field="createTime" title="创建时间" formatter="ymd" width="120px"></vxe-table-column>
      </Grid>
    </el-dialog>
  </div>
</template>

<script>
import supplyStatus from '@/views/material/planList/lib/supplyStatus'
export default {
  name: 'SelectPlanList',
  props: {
    visible: {
      type: Boolean
    },
    checkRowKey: {
      type: String,
      defalut() {
        return ''
      }
    },
    //是否展示单选框
    showRadio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      supplyStatus,
      filterForm: {
        projectId: this.$store.state.project.projectId,
        supplyStatus: 1
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
  created() {
    this.$nextTick(() => {
      if (this.showRadio) return
      let xtable = this.$refs.table.$refs.xTable
      xtable.hideColumn(xtable.getColumns(0))
    })
  },
  methods: {
    save(obj) {
      this.$emit('change', obj.row)
      this.$emit('update:visible', false)
    },
    handleRadioChange(obj) {
      if (obj.row) {
        this.$emit('change', obj.row)
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
