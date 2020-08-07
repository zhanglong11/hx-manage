<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑大事记' : '新建大事记' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="事件时间" prop="occurTime">
              <el-date-picker
                v-model="formData.occurTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="选择项目" prop="projectId">
              <el-select v-model="formData.projectId" placeholder="请选择" class="form-input">
                <el-option v-for="item in projectDataList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="24">
            <el-form-item label="内容" prop="content">
              <el-input v-model="formData.content" type="textarea" :rows="15" :maxlength="500" class="form-input" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 */
import { workBenchApi } from '../api/work-bench'
export default {
  name: 'AddWorkBenchEvents',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      formData: {
        content: '',
        occurTime: '',
        projectId: '',
        title: ''
      },
      formRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        occurTime: [{ required: true, message: '请选择事件时间', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      projectDataList: [] // 项目列表
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDetailsEvent()
    this.queryProjectList()
  },
  // 方法集合
  methods: {
    // 获取大事记详情
    async getDetailsEvent() {
      if (!this.id) {
        return
      }
      const result = await workBenchApi.getDetailsEvent(this.id)
      let datas = result.data
      this.formData = Object.assign({}, datas)
    },
    // 获取项目列表
    async queryProjectList() {
      const result = await workBenchApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      let list = []
      datas.map(item => {
        list.push({
          label: item.name,
          value: item.id
        })
      })
      this.projectDataList = list
    },
    // 保存
    save() {
      this.$refs['formRef'].validate(async valid => {
        if (valid) {
          this.saveSuccess()
        } else {
          this.$message.error('请完善表单')
          return false
        }
      })
    },
    // 保存 - 异步
    async saveSuccess() {
      let result = ''
      if (this.id) {
        result = await workBenchApi.updateEvent(this.formData)
      } else {
        result = await workBenchApi.addEvent(this.formData)
      }
      this.$message.success('提交成功')
      this.goBack()
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
}
.inline-input {
  width: 30%;
  display: inline-block;
}
</style>
