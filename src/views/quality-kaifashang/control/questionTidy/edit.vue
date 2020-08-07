<template>
  <div>
    <div class="info">
      <div class="content">
        <ul>
          <li>
            <span class="label">检查部位</span>
            <span class="val">{{ orderInfo.startDate }}</span>
          </li>
          <li>
            <span class="label">检查项目</span>
            <span class="val">{{ orderInfo.startDate }}</span>
          </li>
          <li>
            <span class="label">问题等级</span>
            <span class="val">{{ orderInfo.startDate }}</span>
          </li>
          <li>
            <span class="label">紧急程度</span>
            <span class="val">{{ orderInfo.startDate }}</span>
          </li>
          <li>
            <span class="label">问题描述</span>
            <span class="val">{{ orderInfo.startDate }}</span>
          </li>
          <li>
            <span class="label">整改期限</span>
            <span class="val">{{ orderInfo.startDate }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.creator }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.endDate }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.endDate }}</span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
          <li>
            <span class="label">现场照片</span>
            <div class="img-box">
              <img
                class="fileImg"
                src="http://123.57.14.79:8888/construct/images/1-1-2_%E5%90%88%E5%90%8C%E8%AF%A6%E6%83%85%EF%BC%88%E6%80%BB%E5%8C%85%EF%BC%89/u1268.png"
                :alt="item"
                width="100%"
                height="100%"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-card>
      <div slot="header" class="card-header">
        <span>整改情况</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="整改人" prop="number">
          <SelectList v-model="form.type" :hasAllOption="false" type="standardTypeList" />
        </el-form-item>
        <el-form-item label="检查时间" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="整改照片" prop="file">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      orderInfo: {},
      form: {
        number: null,
        name: null,
        type: null,
        file: null,
        remark: null
      },
      rules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
        file: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  width: 500px;
}
.img-box {
  display: inline-block;
  img {
    width: 140px;
    height: 140px;
    margin-right: 10px;
  }
}
</style>
