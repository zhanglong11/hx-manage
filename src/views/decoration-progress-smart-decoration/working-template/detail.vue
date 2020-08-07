<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>模板信息</span>
      </div>
      <el-form ref="formRef" :model="formData" label-width="100px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="模板名称">
              {{ formData.name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="模板分类">
              {{ $getLabel(cateogryList, formData.cateogry) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="备注">
              {{ formData.remark }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
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
import { processProgressApi } from '../api/process-progress'
export default {
  name: 'DecorationProgressTemplateDetailSmartDecoration',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      formData: {
        cateogry: '',
        id: this.$route.query.id || '',
        name: '',
        projectId: this.$store.state.project.projectId,
        remark: ''
      }
    }
  },
  computed: {
    // 模板分类下拉框数据
    cateogryList() {
      return this.$getArgList('templateCategory') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDetailsTemplateWorking()
  },
  // 方法集合
  methods: {
    // 工序模板详情
    async getDetailsTemplateWorking() {
      if (!this.id) {
        return
      }
      const result = await processProgressApi.getDetailsTemplateWorking(this.id)
      const datas = result.data
      datas.cateogry = datas.cateogry + ''
      this.formData = Object.assign({}, datas)
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
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
</style>
