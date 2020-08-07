<!--
 * @Description: 审核详情
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-20 10:57:21
 * @LastEditTime: 2020-02-20 11:54:57
 -->
<template>
  <div class="step">
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">审核详情</div>
        <el-steps align-center class="card-body">
          <el-step status="finish">
            <div slot="title">
              <p class="step-title">张静茹</p>
            </div>
            <div slot="description" class="description">
              <el-form label-width="78px">
                <el-form-item label="审核结果">
                  已通过
                </el-form-item>
                <el-form-item label="审核时间">
                  2020-01-01 12:00
                </el-form-item>
                <el-form-item label="审核意见">
                  超长的审核意见超长的审核意见超长的审核意见超长的审核意见超长的审核意见超长的审核意见超长的审核意见超长的审核意见
                </el-form-item>
                <el-form-item label="附件">
                  <ul>
                    <li>意见.doc <el-button type="text">下载</el-button></li>
                    <li>意见.doc <el-button type="text">下载</el-button></li>
                  </ul>
                </el-form-item>
              </el-form>
            </div>
          </el-step>
          <el-step status="finish">
            <div slot="title">
              <p class="step-title">肖战</p>
            </div>
            <div slot="description" class="description">
              <el-form label-width="78px">
                <el-form-item label="审核结果">
                  已通过
                </el-form-item>
                <el-form-item label="审核时间">
                  2020-01-01 12:00
                </el-form-item>
                <el-form-item label="审核意见">
                  无
                </el-form-item>
                <el-form-item label="附件">
                  <ul>
                    <li>意见.doc <el-button type="text">下载</el-button></li>
                    <li>意见.doc <el-button type="text">下载</el-button></li>
                  </ul>
                </el-form-item>
              </el-form>
            </div>
          </el-step>
          <el-step title="王五">
            <div slot="description" class="description">
              <el-form label-width="78px">
                <el-form-item label="审核结果">
                  待审核
                </el-form-item>
              </el-form>
            </div>
          </el-step>
        </el-steps>
      </el-card>
    </section>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.description {
  text-align: left;
  color: #606266;
  p {
    padding-top: 4px;
  }
}
.point {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: inherit;
}
.step {
  /deep/ .el-step__title {
    position: relative;
    top: -64px;
  }
  /deep/ .el-step__description {
    position: relative;
    top: -30px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
}

.card-body {
  margin-top: 30px;
}
.step-title {
  color: #606266;
}
</style>
