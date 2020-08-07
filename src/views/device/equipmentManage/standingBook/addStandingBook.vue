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
          <el-row>
            <!--            -->
            <el-col :span="20">
              <el-form-item label="名称" prop="equipmentName">
                <el-input v-model="form.equipmentName" placeholder="请选择" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label-width="20px">
                <el-button type="text" @click="showEquipmentDialog">选择设备</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="编码" prop="equipmentNum">
            <el-input v-model="form.equipmentNum" placeholder="请输入编码" disabled />
          </el-form-item>
          <!--          <el-form-item label="设备状态" prop="useStatus">-->
          <!--            <el-select v-model="form.useStatus" placeholder="请选择设备状态" style="width: 100%;">-->
          <!--              <el-option label="在用" :value="1" />-->
          <!--              <el-option label="进场" :value="2" />-->
          <!--              <el-option label="退场" :value="3" />-->
          <!--              <el-option label="故障维修" :value="4" />-->
          <!--              <el-option label="设备保养" :value="5" />-->
          <!--              <el-option label="报废停用" :value="6" />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="存放地点" prop="depositLocation">
            <el-input v-model="form.depositLocation" placeholder="请输入存放地点" />
          </el-form-item>
          <el-form-item label="技术状况" prop="technologyLevel">
            <el-select v-model="form.technologyLevel" placeholder="请选择技术状况" style="width: 100%;">
              <el-option
                v-for="item in paramList.technologyLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否为特种装备" prop="specialFlag">
            <el-select v-model="form.specialFlag" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in paramList.specialFlag"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="累计折旧" prop="accumulativeDepreciationAmount">
            <InputNumber v-model="form.accumulativeDepreciationAmount" placeholder="请输入累计折旧" />
          </el-form-item>
          <el-form-item label="净残值" prop="netSalvage">
            <InputNumber v-model="form.netSalvage" placeholder="请输入净残值" />
          </el-form-item>
          <!--          bug 1397 张龙 3-31-->
          <el-form-item label="使用月限">
            <el-input :value="getMonth()" disabled />
          </el-form-item>
          <el-form-item label="累计工作量" prop="accumulativeWorkload">
            <InputNumber v-model="form.accumulativeWorkload" placeholder="请输入累计工作量" />
          </el-form-item>
          <el-form-item label="净残值率%" prop="netSalvageRate">
            <InputNumber v-model="form.netSalvageRate" placeholder="请输入净残值率" />
          </el-form-item>
          <el-form-item label="计量单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入计量单位" />
          </el-form-item>
          <el-form-item label="电机功率" prop="motorPower">
            <InputNumber v-model="form.motorPower" placeholder="请输入电机功率" />
          </el-form-item>
          <el-form-item label="特种设备审验证号" prop="specialEquipmentVerifyNum">
            <el-input v-model="form.specialEquipmentVerifyNum" placeholder="请输入审验证号" />
          </el-form-item>
          <el-form-item label="进口/国产" prop="importFlag">
            <el-select v-model="form.importFlag" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in paramList.importFlag"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上传" prop="fileId">
            <FileEdit v-model="form.fileId" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格及型号" prop="specification">
            <el-input v-model="form.specification" placeholder="规格及型号" disabled />
          </el-form-item>
          <el-form-item label="设备属性" prop="equipmentType">
            <el-select v-model="form.equipmentType" placeholder="请选择设备属性" style="width: 100%;">
              <el-option
                v-for="item in paramList.equipmentType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="折旧方式" prop="depreciationMode">
            <el-select v-model="form.depreciationMode" placeholder="请选择折旧方式" style="width: 100%;">
              <el-option
                v-for="item in paramList.depreciationMode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="使用人" prop="principal">
            <SelectUser
              :id.sync="form.principal"
              :value="form.principal ? { id: form.principal, label: form.principalName } : null"
              :name.sync="form.principalName"
              :multiple="false"
            />
          </el-form-item>
          <el-form-item label="原值" prop="originalValue">
            <InputNumber v-model="form.originalValue" placeholder="请输入原值"></InputNumber>
          </el-form-item>
          <el-form-item label="净值" prop="netValue">
            <InputNumber v-model="form.netValue" placeholder="请输入净值"></InputNumber>
          </el-form-item>
          <el-form-item label="使用开始日期" prop="useStartTime">
            <el-date-picker v-model="form.useStartTime" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="使用结束日期" prop="useEndTime">
            <el-date-picker v-model="form.useEndTime" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="工作总量" prop="totalWorkload">
            <InputNumber v-model="form.totalWorkload" placeholder="请输入工作总量"></InputNumber>
          </el-form-item>
          <el-form-item label="月折旧率" prop="monthDepreciationRate">
            <InputNumber v-model="form.monthDepreciationRate" placeholder="请输入月折旧率" />
          </el-form-item>
          <el-form-item label="月折旧额" prop="monthDepreciationAmount">
            <InputNumber v-model="form.monthDepreciationAmount" placeholder="请输入月折旧额"></InputNumber>
          </el-form-item>
          <el-form-item label="资金来源" prop="capitalSource">
            <el-select v-model="form.capitalSource" placeholder="请选择资金来源" style="width: 100%;">
              <el-option
                v-for="item in paramList.capitalSource"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车牌号" prop="identificationCode">
            <el-input v-model="form.identificationCode" placeholder="请输入车牌号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-box">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <SelectEquipmentDialog :visible.sync="equipmentVisible" @choose="choose" />
  </div>
</template>

<script>
import api from '@/api/device/equipment/standingBook'
import paramList from './selectList'
import SelectEquipmentDialog from './components/SelectEquipmentDialog'
export default {
  name: 'AddStandingBook',
  components: { SelectEquipmentDialog },
  data() {
    return {
      form: {
        useStatus: 1
      },
      paramList,
      equipmentVisible: false,
      rules: {
        equipmentName: [{ required: true, message: '必填' }],
        useEndTime: [{ required: true, message: '必填' }],
        useStartTime: [{ required: true, message: '必填' }],
        equipmentType: [{ required: true, message: '必填' }],
        depositLocation: [{ required: true, message: '必填' }],
        principal: [{ required: true, message: '必填' }],
        specialFlag: [{ required: true, message: '必填' }],
        technologyLevel: [{ required: true, message: '必填' }]
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
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id
            ? await api.update({ ...this.form, ...{ id: this.$route.params.id } })
            : await api.add({ ...this.form })
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    showEquipmentDialog() {
      this.equipmentVisible = true
    },
    choose(row) {
      this.form = {
        ...this.form,
        ...{ equipmentName: row.materialName, equipmentNum: row.materialCode, specification: row.specification }
      }
    },
    getMonth() {
      let start = moment(this.form.useStartTime)
      let end = moment(this.form.useEndTime)
      return end.diff(start, 'months')
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less"></style>
