<template>
  <div class="empty-list">
    <span class="el-icon-hot-water icon"></span>
    <p v-text="desc"></p>
  </div>
</template>

<script>
/**
  任务名称：增加通用空载页组件
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 描述内容
    desc: {
      type: String,
      default: '暂无内容...'
    }
  },
  data() {
    //这里存放数据
    return {}
  },
  mounted() {},
  //方法集合
  methods: {} //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.empty-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 16px;
  .icon {
    margin-bottom: 15px;
    font-size: 120px;
    color: #f0f2f5;
  }
}
</style>
