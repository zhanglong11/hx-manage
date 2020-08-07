<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="人工指标" name="first" lazy
        ><PeopleBudgetIndex
          :key="listId"
          :showSelect="showSelect"
          :showBtn="showOperateBtn"
          :showChangedColumn="showChanged"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        ></PeopleBudgetIndex
      ></el-tab-pane>
      <el-tab-pane label="材料指标" name="second" lazy
        ><MaterialIndexWithTab
          :key="listId"
          :showSelect="showSelect"
          :showBtn="showOperateBtn"
          :showChangedColumn="showChanged"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        ></MaterialIndexWithTab
      ></el-tab-pane>
      <el-tab-pane label="机械指标" name="third" lazy
        ><MachineBudgetIndex
          :key="listId"
          :showSelect="showSelect"
          :showBtn="showOperateBtn"
          :showChangedColumn="showChanged"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('tabSave')"
        ></MachineBudgetIndex
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PeopleBudgetIndex from './components/PeopleBudgetIndex'
import MaterialIndexWithTab from '@/views/cost/components/components/MaterialIndexWithTab'
import MachineBudgetIndex from './components/MachineBudgetIndex'

export default {
  name: 'BudgetTabList',
  components: {
    PeopleBudgetIndex,
    MaterialIndexWithTab,
    MachineBudgetIndex
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    showOperateBtn: {
      type: Boolean,
      default: true
    },
    showChanged: {
      type: Boolean,
      default: false
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
