<template>
  <div class="is-Footer">
    <div class="indexContainer">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>基本信息</strong>
          <el-button style="float: right; padding: 3px 0;" type="text" />
        </div>
        <div>
          <el-row>
            <el-form ref="form" :model="form" class="form" :rules="rules" label-width="120px">
              <el-col :span="12">
                <el-row class="rowLine">
                  <el-col :span="16">
                    <el-form-item label="工程移交名称" prop="transferName">
                      <el-input v-model="form.transferName" class="form-input" type="text" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="rowLine">
                  <el-col :span="16">
                    <el-form-item label="接管单位">
                      <el-input v-model="form.takeOverUnit" class="form-input" type="text" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="rowLine">
                  <el-col :span="16">
                    <el-form-item label="验收合格日期">
                      <el-input v-model="form.acceptancePassTime" class="form-input" type="text" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--                <el-row class="rowLine">-->
                <!--                  <el-col :span="16">-->
                <!--                    <el-form-item label="移交时间">-->
                <!--                      <el-input v-model="form.transferTime" class="form-input" type="text" />-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                </el-row>-->
              </el-col>
              <el-col :span="12">
                <el-row class="rowLine">
                  <el-col :span="16">
                    <el-form-item label="移交单位" prop="transferUnit">
                      <el-input v-model="form.transferUnit" class="form-input" type="text" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="rowLine">
                  <el-col :span="16">
                    <el-form-item label="验收范围">
                      <el-input v-model="form.transferScope" class="form-input" type="text" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--                <el-row class="rowLine">-->
                <!--                  <el-col :span="16">-->
                <!--                    <el-form-item label="移交人">-->
                <!--                      <el-input v-model="transferPersonName" class="form-input" type="text" disabled />-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                </el-row>-->
              </el-col>
              <el-col :span="24">
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="form.remark" type="textarea" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="20">
                    <el-form-item label="移交附件" prop="fileId">
                      <el-input v-model="form.fileId" style="display: none;"></el-input>
                      <US :ids="form.fileId" :multiple="true" @input="fileChange" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/views/completion-epc/api/projectOver'
export default {
  name: 'EditProjectOverEpc',
  data() {
    return {
      form: {},
      rules: {
        transferName: [{ required: true, message: '必填' }],
        transferUnit: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    const { row } = this.$route.params
    this.form = _.cloneDeep(row)
  },
  methods: {
    async save() {
      await this.$refs.form.validate()
      const { transferName, transferUnit, fileId, id, remark } = this.form
      let params = _.assign({
        transferName: transferName,
        transferUnit: transferUnit,
        fileId: fileId,
        id: id,
        remark: remark
      })
      await Api.getUpdate(params)
      this.$message.success('操作成功')
      this.goBack()
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    //上传附件
    fileChange(e, f) {
      if (e.length === 0) return (this.form.fileId = '')
      this.form.fileId = e.map(item => item.id).join(',')
    }
  }
}
</script>
<style lang="less" scoped>
@import '../style.less';
</style>
