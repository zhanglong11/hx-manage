<!--
@bug名称: 1364/原材料检验计划标题居中
@开发人员: 董渊海
@修改日期: 2020-03-30
@任务类型: 修改代码，修改比例(1%)

@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(2%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 6600fc69b57e504075ed3574a7619696fc484db0
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，完成 原材料检验计划 查询列表、新增(编辑)、删除接口对接；总物资计划模态框添加物资类别参数控制
@补加代码注释日期: 2020-04-11
-->
<template>
  <div>
    <div style="display: flex; justify-content: space-between; padding-bottom: 10px;">
      <div style="margin: auto;">原材料检验计划</div>
      <el-button type="primary" icon="el-icon-plus" @click="showModalTotalMaterial">新增</el-button>
    </div>

    <vxe-table
      ref="xTable"
      border
      resizable
      show-overflow
      :data="tableData"
      :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
      :loading="loading"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
      <vxe-table-column field="materialName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="materialType" title="类别">
        <template v-slot="{ row }">
          <span v-if="row.materialType === 1">材料</span>
          <span v-else-if="row.materialType === 2">机械</span>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="inspectStandard"
        title="执行标准"
        min-width="70"
        :edit-render="{ name: 'ElInput' }"
      ></vxe-table-column>
      <vxe-table-column
        field="sampleContent"
        title="样本量"
        :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: changeSampleContent } }"
      ></vxe-table-column>
      <vxe-table-column
        field="samplingSize"
        title="采样量"
        :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: changeSamplingSize } }"
      ></vxe-table-column>
      <vxe-table-column
        field="desp"
        title="详细描述"
        min-width="120"
        :edit-render="{ name: 'ElInput' }"
      ></vxe-table-column>
      <vxe-table-column
        field="inspectContent"
        title="检验内容"
        min-width="100"
        :edit-render="{ name: 'ElInput' }"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="100">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <a @click="saveRowEvent(row)">保存</a>
            <a @click="cancelRowEvent(row)">取消</a>
          </template>
          <template v-else>
            <a @click="editRowEvent(row)">编辑</a>
            <a @click="deleteRowEvent(row)">删除</a>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>

    <ModalTotalMaterial
      :visible.sync="visibleTotalMaterial"
      :validList="tableData"
      @disposeSelectRecord="disposeSelectRecord"
    ></ModalTotalMaterial>
  </div>
</template>

<script>
import ModalTotalMaterial from '@/views/device/goodsPlan/components/modalTotalMaterial'
import Api from '@/api/device/goodsPlan/materialCheck'
export default {
  name: 'MaterialCheck',
  components: { ModalTotalMaterial },
  data() {
    return {
      visibleTotalMaterial: false,
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.loading = true
      Api.getMaterialCheckList({}).then(res => {
        //console.log(res)
        this.tableData = res.data.records
        this.loading = false
      })
    },
    showModalTotalMaterial() {
      if (this.validSaveStatus()) {
        return
      }
      this.visibleTotalMaterial = true
    },
    disposeSelectRecord(record) {
      let obj = {
        id: '',
        materialId: record.id,
        materialCode: record.materialCode,
        materialName: record.materialName,
        specification: record.specification,
        unit: record.unit,
        materialType: record.materialType,
        inspectStandard: '',
        sampleContent: '0',
        samplingSize: '0',
        desp: '',
        inspectContent: ''
      }
      this.tableData.push(obj)
      this.$refs.xTable.setActiveRow(obj)
    },

    changeSampleContent({ row }, e) {
      row.sampleContent = e.target.value
    },
    changeSamplingSize({ row }, e) {
      row.samplingSize = e.target.value
    },
    validSaveStatus() {
      let indexActive = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.$refs.xTable.isActiveByRow(this.tableData[i])) {
          indexActive = i + 1
          break
        }
      }
      if (indexActive) {
        this.$message.error(`请保存 第${indexActive}行记录，再做该操作`)
        return true
      } else {
        return false
      }
    },
    saveRowEvent(row) {
      if (row.inspectStandard === '') {
        this.$message.error('执行标准不能为空')
        return
      }
      if (row.sampleContent === '0') {
        this.$message.error('样本量不能为0')
        return
      }
      if (row.samplingSize === '0') {
        this.$message.error('采样量不能为0')
        return
      }
      if (row.desp === '') {
        this.$message.error('详细描述不能为空')
        return
      }
      if (row.inspectContent === '') {
        this.$message.error('检验内容不能为空')
        return
      }
      Api.addMaterialCheck({
        id: row.id,
        projectId: localStorage.getItem('projectId'),
        materialId: row.materialId,
        inspectStandard: row.inspectStandard,
        sampleContent: row.sampleContent,
        samplingSize: row.samplingSize,
        desp: row.desp,
        inspectContent: row.inspectContent
      }).then(res => {
        this.$message.success('保存成功')
        this.$refs.xTable.clearActived().then(() => {
          this.refresh()
        })
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    editRowEvent(row) {
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.xTable.setActiveRow(row)
    },
    deleteRowEvent(row) {
      if (row.id !== '') {
        this.$confirm(`确定移除 ${row.materialName} 记录吗？`).then(res => {
          Api.deleteMaterialCheck(row.id).then(res => {
            this.$message.success('删除成功')
            this.refresh()
          })
        })
      } else {
        let index = null
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].materialId === row.materialId) {
            index = i
            break
          }
        }
        if (index !== null) {
          this.tableData.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
