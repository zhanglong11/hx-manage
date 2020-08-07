<template>
  <el-dialog
    width="1080px"
    :title="'选择原材料检验计划'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" @radio-change="radioChangeEvent">
      <vxe-table-column type="radio" width="50">
        <template v-slot:header>
          <vxe-button type="text" :disabled="!selectRow" @click="clearRadioRowEvent">取消</vxe-button>
        </template>
      </vxe-table-column>
      <!--
          /**
           任务名称：2700/原材料检验单修改
           开发人员：崔洛宜
           日期：2020-03-24
           任务类型：修改逻辑结构
           **/
      -->
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
      <vxe-table-column field="materialName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="materialAmount" title="合同数量"></vxe-table-column>
      <vxe-table-column field="type" title="类别">材</vxe-table-column>
      <vxe-table-column field="inspectStandard" title="执行标准" min-width="70"></vxe-table-column>
      <vxe-table-column field="sampleContent" title="样本量"></vxe-table-column>
      <vxe-table-column field="samplingSize" title="采样量"></vxe-table-column>
      <vxe-table-column field="desp" title="详细描述" min-width="120"></vxe-table-column>
      <vxe-table-column field="inspectContent" title="检验内容" min-width="50"></vxe-table-column>
    </vxe-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/material/checkOrder'
export default {
  name: 'ModalMaterial',
  props: {
    visible: Boolean
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      selectRow: null,
      tableData: []
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      Api.getMaterialList({
        projectId: this.projectId
      }).then(res => {
        if (res.code === 200) {
          /**
           任务名称：2700/原材料检验单修改
           开发人员：崔洛宜
           日期：2020-03-24
           任务类型：修改逻辑结构
           **/
          this.tableData = res.data.records
          /*this.tableData = [
            {
              id: 1,
              code: '010112341',
              name: '螺纹钢筋1',
              modelNumber: 'φ16',
              unit: 'kg',
              number: '3000',
              type: '材',
              norm: 'GB1499.1-2008',
              normId: 456,
              sample: '每3吨',
              sampling: '0.2吨',
              description: '应以在施工现场堆放的同产地，同规格分批验收',
              content: '强度检测'
            },
            {
              id: 2,
              code: '010112342',
              name: '螺纹钢筋2',
              modelNumber: 'φ16',
              unit: 'kg',
              number: '3000',
              type: '材',
              norm: 'GB1499.1-2008',
              normId: 123,
              sample: '每3吨',
              sampling: '0.2吨',
              description: '应以在施工现场堆放的同产地，同规格分批验收',
              content: '强度检测'
            }
          ]*/
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    clearRadioRowEvent() {
      this.selectRow = null
      this.$refs.xTable.clearRadioRow()
    },
    onOk() {
      if (this.selectRow) {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRow)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
