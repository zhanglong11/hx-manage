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
      <el-form-item label="报废或停用日期" prop="scrapTime">
        <el-date-picker
          v-model="form.scrapTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择报废或停用日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报废或停用原因" prop="reason">
        <el-input
          v-model="form.reason"
          style="width: 400px;"
          type="textarea"
          :rows="2"
          placeholder="请输入报废或停用原因"
        ></el-input>
      </el-form-item>
      <el-form-item label="处理结果" prop="result">
        <el-input v-model="form.result" style="width: 400px;" placeholder="请输入处理结果"></el-input>
      </el-form-item>
      <el-form-item label="处理人员" prop="principalName">
        <el-input v-model="form.principalName" style="width: 400px;" />
        <!--        <SelectUser-->
        <!--          :id.sync="form.principal"-->
        <!--          :value="form.principal ? { id: form.principal, label: form.principalName } : null"-->
        <!--          :name.sync="form.principalName"-->
        <!--          :multiple="false"-->
        <!--          style="width:400px"-->
        <!--        />-->
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
import api from '@/api/device/equipment/stopUsing'
export default {
  name: 'StopUsingAddEDit',
  data() {
    return {
      form: {},
      visible: false,
      rules: {
        equipmentName: [{ required: true, message: '必填' }],
        scrapTime: [{ required: true, message: '必填' }],
        reason: [{ required: true, message: '必填' }],
        result: [{ required: true, message: '必填' }],
        principalName: [{ required: true, message: '必填' }]
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
