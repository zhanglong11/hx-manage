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
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="equipmentName">
            <div style="display: flex;">
              <el-input v-model="form.equipmentName" disabled />
              <el-button type="text" @click="showEquipmentDialog">选择设备</el-button>
            </div>
          </el-form-item>
          <el-form-item label="验收单位" prop="acceptanceDeptName">
            <el-input v-model="form.acceptanceDeptName" />
            <!--            <SelectDepart-->
            <!--              :id.sync="form.acceptanceDeptId"-->
            <!--              :multiple="false"-->
            <!--              :value="form.acceptanceDeptId ? { id: form.acceptanceDeptId, label: form.acceptanceDeptName } : null"-->
            <!--              :label.sync="form.acceptanceDeptName"-->
            <!--            />-->
          </el-form-item>
          <el-form-item label="验收日期" prop="acceptTime">
            <el-date-picker
              v-model="form.acceptTime"
              value-format="yyyy-MM-dd"
              placeholder="请选择验收日期"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="验收人" prop="acceptorName">
            <el-input v-model="form.acceptorName" />
            <!--            <SelectUser-->
            <!--              :id.sync="form.acceptor"-->
            <!--              :value="form.acceptor ? { id: form.acceptor, label: form.acceptorName } : null"-->
            <!--              :name.sync="form.acceptorName"-->
            <!--              :multiple="false"-->
            <!--              style="width:400px"-->
            <!--            />-->
          </el-form-item>
          <el-form-item label="安装调试运转情况" prop="installOperationInfo">
            <el-input
              v-model="form.installOperationInfo"
              type="textarea"
              :rows="2"
              placeholder="请输入运转情况"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传" prop="fileId">
            <FileEdit v-model="form.fileId" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主要附属设备名" prop="mainAccessoryEquipmentName">
            <el-input v-model="form.mainAccessoryEquipmentName" placeholder="请输入附属设备名"></el-input>
          </el-form-item>
          <el-form-item label="保管单位" prop="safekeepingDeptName">
            <el-input v-model="form.safekeepingDeptName" />
            <!--            <SelectDepart-->
            <!--              :id.sync="form.safekeepingDeptId"-->
            <!--              :multiple="false"-->
            <!--              :value="form.safekeepingDeptId ? { id: form.safekeepingDeptId, label: form.safekeepingDeptName } : null"-->
            <!--              :label.sync="form.safekeepingDeptName"-->
            <!--            />-->
          </el-form-item>
          <el-form-item label="移交人" prop="keeperName">
            <el-input v-model="form.keeperName" />
            <!--            <SelectUser-->
            <!--              :id.sync="form.keeper"-->
            <!--              :value="form.keeper ? { id: form.keeper, label: form.keeperName } : null"-->
            <!--              :name.sync="form.keeperName"-->
            <!--              :multiple="false"-->
            <!--              style="width:400px"-->
            <!--            />-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="btn-box">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
    <SelectEquipmentDialog :visible.sync="visible" :use-status="3" @choose="choose" />
  </div>
</template>

<script>
import api from '@/api/device/equipment/checkRecord'
export default {
  name: 'CheckRecordAddEdit',
  data() {
    return {
      form: {},
      visible: false,
      rules: {
        equipmentName: [{ required: true, message: '必填' }],
        acceptanceDeptName: [{ required: true, message: '必填' }],
        acceptTime: [{ required: true, message: '必填' }],
        acceptorName: [{ required: true, message: '必填' }],
        installOperationInfo: [{ required: true, message: '必填' }],
        //bug 1393 张龙 3-31
        mainAccessoryEquipmentName: [{ required: true, message: '必填' }],
        safekeepingDeptName: [{ required: true, message: '必填' }],
        keeperName: [{ required: true, message: '必填' }]
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
