<template>
  <div>
    <div @click="visible = true">
      <slot>
        <el-button type="primary">添加耗材</el-button>
      </slot>
    </div>
    <el-dialog title="甲供材计划单" :visible.sync="visible" width="1000px">
      <div class="tooltips">
        <div>
          <el-input v-model="filterForm.keyword" type="text" placeholder="搜索材料名称" />
        </div>
      </div>
      <Grid
        :request="request"
        :tree-config="false"
        :filter-form.sync="filterForm"
        row-id="code"
        auto-search
        :check-row-keys="checkedKeys"
        :checkbox-config="{
          highlight: true,
          range: true,
          reserve: true,
          checkMethod
        }"
        @checkboxChange="handleCheckChange"
      >
        <vxe-table-column type="checkbox" width="55" align="center" />
        <vxe-table-column type="seq" width="55" align="center" title="序号" />
        <vxe-table-column field="code" title="材料编码" width="160" />
        <vxe-table-column field="name" title="材料名称"> </vxe-table-column>
        <vxe-table-column field="specification" title="规格型号" width="180"> </vxe-table-column>
        <vxe-table-column field="unit" title="单位" width="60"> </vxe-table-column>
        <vxe-table-column field="brand" title="品牌" width="180" />
        <vxe-table-column field="inventoryNumber" title="库存量" width="100" />
      </Grid>
      <footer slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SelectMaterial',
  props: {
    checkedKeys: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      visible: false,
      request: body => {
        return this.axios.material.post('/material/list', body).then(res => {
          res.data.records.forEach(e => {
            e.materialId = e.id
            e.materialName = e.name
            e.materialCode = e.code
            e.materialAmount = e.inventoryNumber
            e.specification = e.models
            delete e.id
          })
          return res
        })
      }
    }
  },
  watch: {
    checkedKeys() {}
  },
  methods: {
    refresh() {},
    submit() {
      this.$emit('change', _.cloneDeep(this.checkedRows))
      this.visible = false
    },
    remove() {},
    handleCheckChange(rows) {
      this.checkedRows = rows
    },
    checkMethod({ row }) {
      return !this.checkedKeys.includes(row.code)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
