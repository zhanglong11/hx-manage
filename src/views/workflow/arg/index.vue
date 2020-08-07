<template>
  <div>
    <el-tabs v-model="name">
      <el-tab-pane label="流程分类" name="processCategory">
        <ProcessCategory valueKey="id" argGroup="processCategory"></ProcessCategory>
      </el-tab-pane>
      <el-tab-pane label="其它" name="2"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ProcessCategory from './components/ProcessCategory'
export default {
  name: 'Arg',
  components: { ProcessCategory },
  data() {
    return {
      name: 'processCategory'
    }
  }
}
</script>

<style lang="less" scoped></style>
