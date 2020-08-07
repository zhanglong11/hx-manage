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
      <el-form-item label="检定日期" prop="inspectTime">
        <el-date-picker
          v-model="form.inspectTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择检定日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="检定单位" prop="inspectUnit">
        <el-input v-model="form.inspectUnit" style="width: 400px;" placeholder="请输入检定单位"></el-input>
      </el-form-item>
      <el-form-item label="检定人" prop="inspectorName">
        <el-input v-model="form.inspectorName" style="width: 400px;" />
        <!--        <SelectUser-->
        <!--          :id.sync="form.inspector"-->
        <!--          :value="form.inspector ? { id: form.inspector, label: form.inspectorName } : null"-->
        <!--          :name.sync="form.inspectorName"-->
        <!--          :multiple="false"-->
        <!--          style="width:400px"-->
        <!--        />-->
      </el-form-item>
      <el-form-item label="检定结果" prop="inspectResult">
        <el-select v-model="form.inspectResult" style="width: 400px;">
          <el-option label="不合格" :value="0" />
          <el-option label="合格" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="检定内容" prop="inspectOpinion">
        <el-input
          v-model="form.inspectOpinion"
          style="width: 400px;"
          type="textarea"
          :rows="2"
          placeholder="请输入检定内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="登记机构" prop="registry">
        <el-input v-model="form.registry" style="width: 400px;" placeholder="请输入登记机构"></el-input>
      </el-form-item>
      <el-form-item label="特种设备审验有效期" prop="specialEquipmentValidity">
        <el-date-picker
          v-model="form.specialEquipmentValidity"
          style="width: 400px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择审验有效期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="特种设备审验证号" prop="specialEquipmentVerifyNum">
        <el-input
          v-model="form.specialEquipmentVerifyNum"
          style="width: 400px;"
          placeholder="请输入审验证号"
        ></el-input>
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
    <SelectEquipmentDialog :visible.sync="visible" :use-status="1" @choose="choose" />
  </div>
</template>

<script>
import api from '@/api/device/equipment/docimasyRecord'
export default {
  name: 'AddDocimasyRecord',
  data() {
    return {
      form: {},
      rules: {
        equipmentName: [{ required: true, message: '必填' }],
        inspectTime: [{ required: true, message: '必填' }],
        inspectUnit: [{ required: true, message: '必填' }],
        inspectorName: [{ required: true, message: '必填' }],
        inspectResult: [{ required: true, message: '必填' }],
        inspectOpinion: [{ required: true, message: '必填' }],
        registry: [{ required: true, message: '必填' }],
        specialEquipmentValidity: [{ required: true, message: '必填' }],
        specialEquipmentVerifyNum: [{ required: true, message: '必填' }]
      },
      visible: false
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
    onCancel() {
      this.$router.back()
    },
    showEquipmentDialog() {
      this.visible = true
    },
    choose(row) {
      this.form = {
        ...this.form,
        ...{
          equipmentId: row.id,
          equipmentName: row.equipmentName
        }
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
