<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑工序' : '添加工序' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="form-con">
        <el-form-item label="施工阶段" prop="constructStage">
          <el-input v-model="formData.constructStage" class="form-input" placeholder="请输入施工阶段" />
        </el-form-item>
        <el-form-item label="工序名称" prop="mainProcedure">
          <el-input v-model="formData.mainProcedure" class="form-input" placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="工序规则" prop="floorRule">
          <el-input v-model="formData.floorRule" disabled class="form-input" placeholder="请输入工序规则" />
        </el-form-item>
        <el-form-item label="工序周期(天)" prop="duration">
          <el-input-number
            v-model="formData.duration"
            :controls="false"
            :min="1"
            class="form-input"
            placeholder="请输入工序周期"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            class="form-input"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <header slot="header">
        <span>耗材清单</span>
        <SelectMaterial
          :checkedKeys="_.map(formData.addDTOList, 'materialCode')"
          @change="handleMaterialListChange"
        ></SelectMaterial>
      </header>
      <vxe-table
        ref="table"
        max-height="800px"
        :data="formData.addDTOList"
        :edit-rules="validRules"
        :edit-config="{ trigger: 'click', mode: 'row' }"
        row-id="materialId"
      >
        <vxe-table-column type="seq" width="55" align="center" title="序号" />
        <vxe-table-column field="materialCode" title="材料编码" width="180" />
        <vxe-table-column field="materialName" title="材料名称"> </vxe-table-column>
        <vxe-table-column field="specification" title="规格型号" width="180"> </vxe-table-column>
        <vxe-table-column field="materialAmount" title="库存量" width="140" />
        <vxe-table-column
          field="planConsumeNum"
          title="计划用量"
          width="160"
          :edit-render="{ name: '$input', props: { type: 'number', min: 0 } }"
        />
        <vxe-table-column field="unit" title="单位" width="100"> </vxe-table-column>
        <vxe-table-column title="操作" width="80">
          <template v-slot="{ row, $rowIndex }">
            <el-button type="text" @click="formData.addDTOList.splice($rowIndex, 1)">删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" @click="save()">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import SelectMaterial from '../components/SelectMaterial'
import { processProgressApi } from '../api/process-progress'
import upsert from 'upsert-many'
export default {
  name: 'ProcessProgressAddInterleavingSmartDecoration',
  components: { SelectMaterial },
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      formData: {
        constructStage: '',
        floorRule: this.$route.query.floorRule || '',
        templateId: this.$route.query.templateId || '',
        mainProcedure: '',
        duration: null,
        remark: '',
        milestoneFlag: this.$route.query.milestone ? 1 : 0,
        addDTOList: []
      },
      formRules: {
        constructStage: [{ required: true, message: '请输入施工阶段', trigger: 'blur' }],
        mainProcedure: [{ required: true, message: '请输入主要施工工序', trigger: 'change' }],
        floorRule: [{ required: true, message: '请输入工序规则', trigger: 'blur' }],
        duration: [{ required: true, message: '请输入工序周期', trigger: 'blur' }]
      },
      validRules: {
        planConsumeNum: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    this.getDetailsWorking()
  },
  methods: {
    async getDetailsWorking() {
      if (this.id) {
        const result = await processProgressApi.getDetailsWorking(this.id)
        const data = result.data
        this.formData = Object.assign({}, data)
        this.formData.addDTOList = data.consumeDTOList
      }
    },
    async save() {
      await this.$refs['formRef'].validate()
      await this.$refs.table.validate()
      this.isLoading = true
      if (this.id) {
        await processProgressApi.updateWorking(this.formData).finally(() => (this.isLoading = false))
      } else {
        await processProgressApi.addWorking(this.formData).finally(() => (this.isLoading = false))
      }
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      this.goBack()
    },
    handleMaterialListChange(list) {
      list.forEach(e => {
        e.planConsumeNum = null
      })
      this.formData.addDTOList = upsert(this.formData.addDTOList, list, 'materialId', false)
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/color.less');
.el-tag + .el-tag {
  margin-left: 10px;
}
.el-form {
  width: 800px;
}
.el-card {
  /deep/ .el-card__header header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
