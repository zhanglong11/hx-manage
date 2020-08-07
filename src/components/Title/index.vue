<template>
  <div class="title">{{ title }}</div>
</template>

<script>
export default {
  props: {
    title: {}
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 20px;
  color: rgb(156, 153, 153);
  border-left: 6px solid rgb(24, 144, 255);
  text-indent: 12px;
  margin-bottom: 20px;
}
</style>
