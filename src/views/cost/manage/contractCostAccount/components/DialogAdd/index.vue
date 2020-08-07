<!--
* @任务编号: 2824 || 成本核算页面开发
* @开发人员:张龙
* @日期:2020-03-06
* @任务类型:全新代码
-->
<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    :title="curId ? '编辑' : '添加'"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
      <el-form-item label="成本核算名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button v-if="curId" type="primary" @click="save()">保存</el-button>
      <el-button type="primary" @click="toStep()">下一步</el-button>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/api/cost/costAccount'
export default {
  name: 'DialogAdd',
  props: {
    visible: {},
    curId: {},
    costId: {}
  },
  data() {
    return {
      form: {},
      info: {
        model: 'measure_calculate',
        version: 0
      },
      rules: {
        name: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {
    curId(v) {
      if (v) {
        this.refresh()
      }
    }
  },
  created() {
    if (this.curId) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.stepDetail(this.curId)
      this.form = res.data
    },
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await api.updateStep({ ...this.form, ...this.info, ...{ id: this.curId } })
          this.$message.success('操作成功')
        }
      })
    },
    async toStep() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let curId = null
          if (!this.curId) {
            let res = await api.addStep({ ...this.form, ...this.info })
            curId = res.data
            this.$message.success('操作成功')
          } else {
            curId = this.curId
          }
          let res = await api.getCostId({ costId: this.curId ? this.curId : curId })
          this.$emit('update:visible', false)
          this.form = {}
          this.$parent.$router.push({ name: `ContractCostAccountCheckDetail`, params: { id: curId, isEdit: true } })
        }
      })
    },
    cancelDialog() {
      this.$emit('update:visible', false)
      this.form = {}
    }
  }
}
</script>

<style scoped></style>
