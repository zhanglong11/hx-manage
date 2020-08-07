<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="耗材指标" name="child-first"
        ><ConsumeMaterialIndex
          :showSelect="showSelect"
          :showBtn="showBtn"
          :showChangedColumn="showChangedColumn"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('GLJTabSave')"
        ></ConsumeMaterialIndex
      ></el-tab-pane>
      <el-tab-pane label="周材指标" name="child-second" :showSelect="true"
        ><WeekMaterialIndex
          :showSelect="showSelect"
          :showBtn="showBtn"
          :showChangedColumn="showChangedColumn"
          :listId="listId"
          :meteringUnitId="meteringUnitId"
          :costId="costId"
          @GLJTabSave="$emit('GLJTabSave')"
        ></WeekMaterialIndex
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ConsumeMaterialIndex from './ConsumeMaterialIndex'
import WeekMaterialIndex from './WeekMaterialIndex'
export default {
  name: 'MaterialIndexWithTab',
  components: { ConsumeMaterialIndex, WeekMaterialIndex },
  props: {
    showSelect: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    showChangedColumn: {
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
    return { activeName: 'child-first' }
  },
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.container {
  padding: 5px;
}
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
</style>
