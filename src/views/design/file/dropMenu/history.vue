<!--
 * @Description: 审批状态
 * @Author:
 * @Date: 2020-01-20 17:22:47
 -->
<template>
  <div>
    <el-dialog title="审批状态" :visible.sync="flowFlag" width="60%" @close="flowClose">
      <div class="content-body">
        <template>
          <p class="title">测试</p>
          <el-table :data="flowData" style="width: 100%;" max-height="250" header-align="center">
            <el-table-column prop="stageName" label="阶段" align="center"> </el-table-column>
            <el-table-column prop="auditorList" label="审批人" align="center">
              <template slot-scope="scope">
                <span v-for="item in scope.row.auditorList" :key="item.userId">{{ item.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="审批意见" align="center"> </el-table-column>
            <el-table-column prop="date" label="审批结果" align="center"> </el-table-column>
          </el-table>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      flowFlag: false,
      flowData: []
    }
  },
  methods: {
    flowClose() {},
    show(data) {
      this.flowFlag = true
      // this.flowData = data
    }
  }
}
</script>
<style lang="less" scoped>
.content-body {
  max-height: 400px;
}
</style>
