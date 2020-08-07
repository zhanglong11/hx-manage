<template>
  <el-dialog title="支付阶段" :visible="visible" width="400px" @close="$emit('close')">
    <el-form ref="form" :model="form" :rules="rule">
      <el-form-item prop="argText">
        <el-input v-model="form.argText" placeholder="支付阶段名称"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/***
 * 功能:自定义添加支付阶段
 * ***/

export default {
  name: 'PaymentStageDialog',
  components: {},
  props: ['visible'],
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {},
      rule: {
        argText: [
          {
            required: true,
            message: '请输入'
          }
        ]
      }
    }
  },

  methods: {
    async handleSubmit() {
      await this.$refs.form.validate()
      let params = {
        module: 'construction-2.0',
        argGroup: 'paymentStage',
        argText: this.form.argText
      }
      let result = await this.axios.global.post(`/cim6d/arg/general/add`, params)
      if (result.code === 200) {
        this.$emit('submit', {
          argGroup: 'paymentStage',
          argText: this.form.argText
        })
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
