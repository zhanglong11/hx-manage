<template>
  <div>
    <el-tabs v-model="activeName">
      <!--
          /**
         任务名称：TASK#2829 3月9日注释
         开发人员：崔洛宜
         日期：2020-04-03
         任务类型：注释(修改组件传参)
         **/
      -->
      <!--
          /**
         任务名称：TASK#2831 3月11号注释
         开发人员：崔洛宜
         日期：2020-03-11
         任务类型：注释(修改参数传递)(25)
         **/
      -->
      <el-tab-pane label="人工指标" name="first" lazy>
        <PeopleIndex
          :id="id"
          :showBtn="showOperateBtn"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        >
        </PeopleIndex>
      </el-tab-pane>
      <el-tab-pane label="材料指标" name="second" lazy>
        <MaterialIndex
          :id="id"
          :showBtn="showOperateBtn"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        ></MaterialIndex>
      </el-tab-pane>
      <el-tab-pane label="机械指标" name="third" lazy
        ><MachineIndex
          :id="id"
          :showBtn="showOperateBtn"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        ></MachineIndex
      ></el-tab-pane>
      <el-tab-pane label="管理费指标" name="forth" lazy
        ><ManagementCostIndex
          :id="id"
          :showBtn="showOperateBtn"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        ></ManagementCostIndex
      ></el-tab-pane>
      <el-tab-pane label="利润指标" name="fifth" lazy>
        <ProfitIndex
          :id="id"
          :showBtn="showOperateBtn"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        ></ProfitIndex>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PeopleIndex from './components/PeopleIndex'
import MaterialIndex from './components/MaterialIndex'
import MachineIndex from './components/MachineIndex'
import ManagementCostIndex from './components/ManagementCostIndex'
import ProfitIndex from './components/ProfitIndex'
export default {
  name: 'TabList',
  components: {
    PeopleIndex,
    MaterialIndex,
    MachineIndex,
    ManagementCostIndex,
    ProfitIndex
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    showOperateBtn: {
      type: Boolean,
      default: true
    },
    listId: {
      type: [Number, String],
      default: ''
    },
    meteringUnitId: {
      type: [Number, String],
      default: ''
    },
    costId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped></style>
