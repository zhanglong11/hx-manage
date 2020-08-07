<!--    /**
任务名称：2868/添加3月注释
开发人员：李建敏
日期：2020-3月-6日
任务类型：2、复制修改代码 （20行）
**/-->
<template>
  <div class="main">
    <h1><img src="/img/u1234.png" />施工影响名称20200202</h1>
    <ul class="description">
      <li>
        <span class="title">影响范围</span>
        <span class="content">{{ form.effectScope }}</span>
      </li>
      <li>
        <span class="title">创建人</span>
        <span class="content">{{ form.creatorName }}</span>
      </li>
      <li>
        <span class="title">影响值</span>
        <span class="content">{{ form.effectValue }} </span>
      </li>
      <li>
        <span class="title">创建时间</span>
        <span class="content">{{ form.createTime }}</span>
      </li>
      <li>
        <span class="title">单位</span>
        <span class="content">{{ form.unit }}</span>
      </li>
      <li>
        <span class="title">附件</span>
        <span class="content">现场照片.jpg</span>
        <a download style="margin-left: 15px;">点击下载</a>
      </li>
      <li>
        <span class="title">影响开始时间</span>
        <span class="content">{{ form.beginDate }}</span>
      </li>
      <li>
        <span class="title">施工影响类型</span>
        <span class="content">{{ ['计划调整', '实际填报'][form.type - 1] }}</span>
      </li>
      <li>
        <span class="title">影响结束时间</span>
        <span class="content">{{ form.endDate }}</span>
      </li>
      <li>
        <span class="title">备注</span>
        <span class="content">{{ form.remark }}</span>
      </li>
      <li>
        <span class="title">影响工期(天)</span>
        <span class="content">{{ form.effectDuration }}</span>
      </li>
    </ul>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      form: {}
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.axios.schedule.get('construct/effect/detail/' + this.$route.params.id).then(res => (this.form = res.data))
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
#app .main {
  padding: 30px 90px;
}
h1 {
  font-size: 20px;
  position: relative;
  img {
    width: 24px;
    position: absolute;
    top: 3px;
    left: -35px;
    vertical-align: middle;
  }
}
.description {
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;
  li {
    width: 50%;
    padding: 15px 0;
    .title {
      color: #bbb;
      &::after {
        display: inline;
        content: '：';
      }
    }
    .content {
      color: #666;
    }
  }
}
</style>
