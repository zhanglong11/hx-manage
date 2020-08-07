<!--
* @任务编号: 2824 || 设备添加，修改接口对接
* @开发人员:张龙
* @日期:2020-03-03
* @任务类型:修改代码
-->
<!--
* @任务编号: 2711 || 设备管理功能完善
* @开发人员:张龙
* @日期:2020-03-26
* @任务类型: 新代码
-->
<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-positon="left" label-width="180px">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="form.equipmentName" style="width: 400px;" disabled />
        <el-button type="text" @click="showEquipmentDialog">选择设备</el-button>
      </el-form-item>
      <!--      <el-form-item label="规格及型号" prop="modelNumber">-->
      <!--        <el-input v-model="form.modelNumber" style="width: 400px" placeholder="请输入规格及型号"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="进场日期" prop="enterTime">
        <el-date-picker
          v-model="form.enterTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择进场日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="退场日期" prop="actualLeaveTime">
        <el-date-picker
          v-model="form.actualLeaveTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择退场日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="退场负责人" prop="principalName">
        <el-input v-model="form.principalName" style="width: 400px;" />
        <!--        <SelectUser-->
        <!--          :id.sync="form.principal"-->
        <!--          :value="form.principal ? { id: form.principal, label: form.principalName } : null"-->
        <!--          :name.sync="form.principalName"-->
        <!--          :multiple="false"-->
        <!--          style="width:400px"-->
        <!--        />-->
      </el-form-item>
      <el-form-item label="是否结算" prop="settlementFlag">
        <el-select v-model="form.settlementFlag" placeholder="请选择资金来源" style="width: 400px;">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传" prop="fileId">
        <FileEdit v-model="form.fileId" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          style="width: 400px;"
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
    <SelectEquipmentDialog :visible.sync="visible" @choose="choose" />
  </div>
</template>

<script>
import api from '@/api/device/equipment/outArena'
export default {
  name: 'OutArenaAddEdit',
  data() {
    return {
      form: {},
      visible: false,
      rules: {
        equipmentName: [{ required: true, message: '必填' }],
        enterTime: [{ required: true, message: '必填' }],
        actualLeaveTime: [{ required: true, message: '必填' }],
        principalName: [{ required: true, message: '必填' }],
        settlementFlag: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
    },
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = isAudit ? await api.submitAudit({ ...this.form }) : await api.add({ ...this.form })
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    choose(row) {
      this.form = {
        ...this.form,
        ...{
          equipmentId: row.id,
          equipmentName: row.equipmentName
        }
      }
    },
    showEquipmentDialog() {
      this.visible = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less"></style>
