<!--
 * @Description: 地址选择器
 * @Version:
 * @Autor:
 * @Date: 2020-02-17 11:07:54
 * @LastEditTime: 2020-02-18 09:34:29
 -->
<template>
  <div>
    <el-cascader v-model="area" :options="options" style="width: 100%;" @change="handleChange"></el-cascader>
  </div>
</template>

<script>
import addressList from './addressList'
export default {
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      options: addressList,
      area: []
    }
  },
  watch: {
    value: {
      handler: function (n, o) {
        if (n) {
          this.area = n.split('_')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('update', e.join('_'))
    }
  }
}
</script>
<style lang="less" scoped></style>
