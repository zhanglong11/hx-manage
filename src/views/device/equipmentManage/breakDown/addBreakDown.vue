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
      <!--bug号：1026、修改人：董渊海、修改时间：2020-03-23-->
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="form.equipmentName" style="width: 400px;" disabled />
        <el-button type="text" @click="showEquipmentDialog">选择设备</el-button>
      </el-form-item>
      <!--      <el-form-item label="规格及型号" prop="modelNumber">-->
      <!--        <el-input v-model="form.modelNumber" style="width: 400px" placeholder="请输入规格及型号"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="责任人" prop="principalName">
        <el-input v-model="form.principalName" style="width: 400px;" />
        <!--        <SelectUser-->
        <!--          :id.sync="form.principal"-->
        <!--          :value="form.principal ? { id: form.principal, label: form.principalName } : null"-->
        <!--          :name.sync="form.principalName"-->
        <!--          :multiple="false"-->
        <!--          style="width:400px"-->
        <!--        />-->
      </el-form-item>
      <el-form-item label="维修人员" prop="repairManName">
        <el-input v-model="form.repairManName" style="width: 400px;" />
        <!--        <SelectUser-->
        <!--          :id.sync="form.repairMan"-->
        <!--          :value="form.repairMan ? { id: form.repairMan, label: form.repairManName } : null"-->
        <!--          :name.sync="form.repairManName"-->
        <!--          :multiple="false"-->
        <!--          style="width:400px"-->
        <!--        />-->
      </el-form-item>
      <el-form-item label="维修部门" prop="repairDeptName">
        <el-input v-model="form.repairDeptName" style="width: 400px;" />
        <!--        <SelectDepart-->
        <!--          :id.sync="form.repairDeptId"-->
        <!--          style="width:400px"-->
        <!--          :multiple="false"-->
        <!--          :value="form.repairDeptId ? { id: form.repairDeptId, label: form.repairDeptName } : null"-->
        <!--          :label.sync="form.repairDeptName"-->
        <!--        />-->
      </el-form-item>
      <el-form-item label="故障发生日期" prop="faultOccurTime">
        <el-date-picker
          v-model="form.faultOccurTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择故障发生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="维修完成日期" prop="repairTime">
        <el-date-picker
          v-model="form.repairTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择维修完成日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="故障描述" prop="faultDesc">
        <el-input
          v-model="form.faultDesc"
          style="width: 400px;"
          type="textarea"
          :rows="2"
          placeholder="请输入故障描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="故障原因" prop="faultReason">
        <el-input
          v-model="form.faultReason"
          style="width: 400px;"
          type="textarea"
          :rows="2"
          placeholder="请输入故障原因"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否外委" prop="delegateFlag">
        <el-select v-model="form.delegateFlag" placeholder="请选择" style="width: 400px;">
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
import api from '@/api/device/equipment/breakDown'
export default {
  name: 'BreakDownAddEdit',
  data() {
    return {
      form: {},
      visible: false,
      rules: {
        equipmentName: [{ required: true, message: '必填' }],
        principalName: [{ required: true, message: '必填' }],
        repairManName: [{ required: true, message: '必填' }],
        repairDeptName: [{ required: true, message: '必填' }],
        faultOccurTime: [{ required: true, message: '必填' }],
        repairTime: [{ required: true, message: '必填' }],
        faultDesc: [{ required: true, message: '必填' }],
        faultReason: [{ required: true, message: '必填' }]
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
