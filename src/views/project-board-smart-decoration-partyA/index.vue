<template>
  <div class="container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="进度" name="first">
        <ProgressModule></ProgressModule>
      </el-tab-pane>
      <el-tab-pane label="工序" name="second">
        <ProcedureModule></ProcedureModule>
      </el-tab-pane>
      <el-tab-pane label="实测测量" name="third">
        <MeasureQuantityModule></MeasureQuantityModule>
      </el-tab-pane>
      <el-tab-pane label="质量安全" name="fourth">
        <QuantitySafetyModule v-if="activeName == 'fourth'"></QuantitySafetyModule>
      </el-tab-pane>
      <el-tab-pane label="材料" name="five">
        <MaterialModule></MaterialModule>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ProcedureModule from './components/ProcedureModule'
import ProgressModule from './components/ProgressModule'
import MeasureQuantityModule from './components/MeasureQuantityModule'
import QuantitySafetyModule from './components/QuantitySafetyModule'
import MaterialModule from './components/MaterialModule'
export default {
  name: 'Index',
  components: {
    ProgressModule,
    ProcedureModule,
    MeasureQuantityModule,
    QuantitySafetyModule,
    MaterialModule
  },
  data() {
    return {
      activeName: 'five'
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.container {
  /deep/ .el-tabs--card {
    .el-tabs__header {
      border-bottom: 0px solid #e4e7ed;
    }
    .el-tabs__nav {
      border: 1px solid #e4e7ed;
      width: 600px;
      margin: 0 auto;
      float: inherit;
    }
    .el-tabs__item {
      width: 120px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      &.is-active {
        background: #0079fe;
        color: #fff;
      }
    }
  }
}
</style>
