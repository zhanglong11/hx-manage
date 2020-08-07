<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑工序' : '添加工序' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="施工阶段" prop="constructStage">
              <el-select v-model="formData.constructStage" clearable placeholder="请选择" class="form-input">
                <el-option
                  v-for="item in constructStageList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <AddArg group="constructStage" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="主要施工工序" prop="mainProcedure">
              <el-input v-model="formData.mainProcedure" class="form-input" placeholder="请输入主要施工工序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="是否为最初工序" required>
              <el-switch v-model="firstFlag" @change="changeFirstFlag"> </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="周期/d" prop="duration">
              <el-input-number
                v-model="formData.duration"
                :controls="false"
                :min="1"
                class="form-input"
                placeholder="请输入非标准楼层工期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="楼层规则" prop="floorRule">
              <el-input v-model="formData.floorRule" disabled class="form-input" placeholder="请输入楼层规则" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="关联类型" required>
              <el-select v-model="formData.associatedType" clearable placeholder="请选择" class="form-input">
                <el-option
                  v-for="item in associatedTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <AddArg group="associatedType" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="备注">
              <el-input
                v-model="formData.remark"
                class="form-input"
                type="textarea"
                :rows="4"
                placeholder="请输入备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" @click="save()">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-31
 * @Last Modified by: gengweigang
 */
/**
  任务名称：task#2867 【智慧工地2.0-前端】工序进度模块功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/
import { processProgressApi } from './api/process-progress'
export default {
  name: 'ProcessProgressAddInterleaving',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      firstFlag: false, // 是否为最初工序
      formData: {
        constructStage: '',
        associatedType: '',
        floorRule: this.$route.query.floorRule || '',
        templateId: this.$route.query.templateId || '',
        mainProcedure: '',
        duration: 1,
        remark: '',
        firstFlag: 0
      },
      formRules: {
        constructStage: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        mainProcedure: [{ required: true, message: '请输入主要施工工序', trigger: 'change' }],
        floorRule: [{ required: true, message: '请输入楼层规则', trigger: 'blur' }],
        duration: [{ required: true, message: '请输入周期', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 施工阶段下拉框数据
    constructStageList() {
      return this.$getArgList('constructStage') || []
    },
    // 工序关联类型下拉框数据
    associatedTypeList() {
      return this.$getArgList('associatedType') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDetailsWorking()
  },
  // 方法集合
  methods: {
    // 新增分类
    addArg() {
      this.$router.push({ path: '/system-config' })
    },
    // 是否为最初工序
    changeFirstFlag(val) {
      this.formData.firstFlag = val ? 1 : 0
    },
    // 工序详情
    async getDetailsWorking() {
      if (!this.id) {
        return
      }
      const result = await processProgressApi.getDetailsWorking(this.id)
      const datas = result.data
      datas.firstFlag = datas.sort === 0 ? 1 : 0
      this.firstFlag = datas.sort === 0
      this.formData = Object.assign({}, datas)
      this.formData.floorRule = this.$route.query.floorRule
    },
    // 保存并提交
    save() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.saveSuccess()
        } else {
          this.$message({
            type: 'error',
            message: '请完善表单!'
          })
          return false
        }
      })
    },
    // 保存 - 异步
    async saveSuccess() {
      try {
        this.isLoading = true
        if (this.id) {
          await processProgressApi.updateWorking(this.formData)
        } else {
          await processProgressApi.addWorking(this.formData)
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.goBack()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.form-con {
  padding-right: 15%;
}
.form-input {
  width: 100%;
  /deep/.el-input__inner {
    text-align: left;
  }
}
.inline-input {
  width: 30%;
  display: inline-block;
}
</style>
