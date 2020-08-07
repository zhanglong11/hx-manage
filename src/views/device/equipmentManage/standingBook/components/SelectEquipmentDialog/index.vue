<!--
* @任务编号: 2711 || 设备管理根据原型修改添加选择设备组件
* @开发人员:张龙
* @日期:2020-03-25
* @任务类型: 新代码
-->
<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="选择设备"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <VXTable
      ref="table"
      :pageQuery="pageQuery"
      :total="total"
      :tableData="tableData"
      :columns="tableColumn"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      @radioChange="radioChange"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/device/equipment/standingBook'
export default {
  name: 'SelectEquipmentDialog',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  mixins: [PageMixin],
  props: {
    visible: {}
  },
  data() {
    // 这里存放数据
    return {
      request: api.materialList,
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'materialCode',
          title: '设备编码'
        },
        {
          field: 'materialName',
          title: '设备名称'
        },
        {
          field: 'specification',
          title: '规格及型号'
        },
        {
          field: 'creatorName',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间'
        }
      ]
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新列表
    refresh() {},
    // 提交
    submit() {
      this.$emit('update:visible', false)
      this.$emit('choose', this.radioRow)
    },
    // 删除
    remove() {},
    cancelDialog() {
      this.$emit('update:visible', false)
      this.radioRow = {}
    }
  }
}
</script>

<style scoped lang="less"></style>
