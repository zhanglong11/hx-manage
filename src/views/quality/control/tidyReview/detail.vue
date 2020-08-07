<template>
  <div>
    <el-card>
      <div slot="header" class="card-header">
        <span>检查情况</span>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="submit">编辑</el-button>
      </div>
      <ul class="detail-list">
        <li>
          <span class="label">检查部位</span>
          <span class="val"></span>
        </li>
        <li>
          <span class="label">检查项目</span>
          <span class="val"></span>
        </li>
        <li>
          <span class="label">问题等级</span>
          <span class="val"></span>
        </li>
        <li>
          <span class="label">紧急程度</span>
          <span class="val">123</span>
        </li>
        <li>
          <span class="label">问题描述</span>
          <span class="val">123</span>
        </li>
        <li>
          <span class="label">整改期限</span>
          <span class="val"></span>
        </li>
        <li>
          <span class="label">整改要求</span>
          <span class="val"></span>
        </li>
        <li>
          <span class="label">创建人</span>
          <span class="val"></span>
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
            <img
              class="fileImg"
              src="http://123.57.14.79:8888/construct/images/1-1-2_%E5%90%88%E5%90%8C%E8%AF%A6%E6%83%85%EF%BC%88%E6%80%BB%E5%8C%85%EF%BC%89/u1268.png"
              :alt="item"
              width="100%"
              height="100%"
            />
            <img
              class="fileImg"
              src="http://123.57.14.79:8888/construct/images/1-1-2_%E5%90%88%E5%90%8C%E8%AF%A6%E6%83%85%EF%BC%88%E6%80%BB%E5%8C%85%EF%BC%89/u1268.png"
              :alt="item"
              width="100%"
              height="100%"
            />
            <img
              class="fileImg"
              src="http://123.57.14.79:8888/construct/images/1-1-2_%E5%90%88%E5%90%8C%E8%AF%A6%E6%83%85%EF%BC%88%E6%80%BB%E5%8C%85%EF%BC%89/u1268.png"
              :alt="item"
              width="100%"
              height="100%"
            />
          </div>
        </li>
        <li>
          <span class="label">备注</span>
          <span class="val"
            >这是一段备注。Blah blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
            bibendum laoreet. Proin gravida dolor sit amet lacus accumsan</span
          >
        </li>
      </ul>
    </el-card>
    <el-card>
      <div slot="header" class="card-header">
        <span>整改情况</span>
      </div>
      <ul class="detail-list">
        <li>
          <span class="label">整改人</span>
          <span class="val"></span>
        </li>
        <li>
          <span class="label">整改时间</span>
          <span class="val"></span>
        </li>
        <li>
          <span class="label">备注</span>
          <span class="val"
            >这是一段备注。Blah blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
            bibendum laoreet. Proin gravida dolor sit amet lacus accumsan</span
          >
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
            <img
              class="fileImg"
              src="http://123.57.14.79:8888/construct/images/1-1-2_%E5%90%88%E5%90%8C%E8%AF%A6%E6%83%85%EF%BC%88%E6%80%BB%E5%8C%85%EF%BC%89/u1268.png"
              :alt="item"
              width="100%"
              height="100%"
            />
            <img
              class="fileImg"
              src="http://123.57.14.79:8888/construct/images/1-1-2_%E5%90%88%E5%90%8C%E8%AF%A6%E6%83%85%EF%BC%88%E6%80%BB%E5%8C%85%EF%BC%89/u1268.png"
              :alt="item"
              width="100%"
              height="100%"
            />
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
    </el-card>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div> </template
>el

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
.detail-list {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 50%;
    display: inline-flex;
    .label {
      flex: 0 0 110px;
      margin-right: 10px;
      padding-bottom: 10px;
      text-align: right;
      color: #7f7f7f;
    }
    .val {
    }
  }
  .img-box {
    display: inline-block;
    img {
      width: 140px;
      height: 140px;
      margin-right: 10px;
    }
  }
}
</style>
