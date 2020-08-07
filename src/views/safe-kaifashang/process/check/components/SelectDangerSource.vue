<template>
  <el-dialog width="1100px" :modal="true" top="10vh" title="选择危险源" :visible="visible" @close="close">
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="" prop="keyWords">
          <el-input v-model="filterForm.keyWords" style="width: 160px;" placeholder="危险源/关键部位">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="伤害类别" prop="category">
          <SelectList v-model="filterForm.category" :multiple="true" :hasAllOption="false" type="harmTypeList" />
        </el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="() => $refs.table.reset()">重置</el-button>
        </el-button-group>
      </el-form>
    </div>
    <Grid ref="table" :filter-form="filterForm" :request="request" @currentChange="change">
      <vxe-table-column title="危险源" field="dangerSource"></vxe-table-column>
      <vxe-table-column title="关键部位" field="placeName"></vxe-table-column>
      <vxe-table-column title="伤害类别" field="harmCategoryNames"></vxe-table-column>
      <vxe-table-column title="防范措施" field="precautionaryMeasure"></vxe-table-column>
    </Grid>
  </el-dialog>
</template>

<script>
import api from '@/api/safe/plan/dangerous'
export default {
  name: 'SelectDangerSource',
  props: {
    visible: {}
  },
  data() {
    return {
      filterForm: {},
      request(body) {
        return api.list(body)
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    change({ row }) {
      this.$emit('change', row)
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
