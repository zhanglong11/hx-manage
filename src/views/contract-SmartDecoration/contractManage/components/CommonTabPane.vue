<!--
    /**
                 任务名称：TASK#2790 3月2号注释
                 开发人员：崔洛宜
                 日期：2020-03-02
                 任务类型：注释(全新代码)
                 **/
-->
<template>
  <div>
    <div><el-button plain @click="handleExport">导出</el-button></div>
    <div class="tableWrapper">
      <!--    <vxe-table ref="xTable" border :data="tableData" auto-resize>
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="itemName" title="名称" />
        <vxe-table-column field="specifications" title="规格型号" />
        <vxe-table-column field="unit" title="单位" />
        <vxe-table-column field="quantity" title="数量" />
        <vxe-table-column field="unitPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="combinedPrice" title="合价"></vxe-table-column>
      </vxe-table>-->
      <Grid ref="table" pageUseQuery :request="request" :filter-form.sync="filterForm">
        <vxe-table-column field="serialNumber" width="100" title="序号"></vxe-table-column>
        <vxe-table-column field="name" title="材料名称" />
        <vxe-table-column field="models" title="规格型号" />
        <vxe-table-column field="unit" title="单位" />
        <vxe-table-column field="brand" title="品牌" />
        <vxe-table-column field="supplier" title="供应商" />
        <vxe-table-column field="remark" title="备注" />
      </Grid>
    </div>
  </div>
</template>
<script>
import Api from '../../api/contractManage'
export default {
  name: 'CommonTabPane',
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    },
    module: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      filterForm: {
        contractId: this.contractId,
        module: this.module,
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        return Api.getContractOrderList(body)
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.contractId) {
        Api.getContractOrderList({
          contractId: this.contractId,
          module: this.module
        }).then(res => {
          this.tableData = res.data.records
        })
      }
    },
    handleExport() {
      Api.exportContractOrderList({
        contractId: this.contractId,
        module: this.module
      }).then(res => {
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let nameList = [
        { value: 11, label: '甲供材材料单.xls' },
        { value: 12, label: 'BIM模型关联材料单.xls' },
        { value: 13, label: '精装修采购清单.xls' }
      ]
      let fileName = this.$getLabel(nameList, this.module)
      if ('download' in document.createElement('a')) {
        // 不是IE浏览器
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      } else {
        // IE 10+
        window.navigator.msSaveBlob(blob, fileName)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tableWrapper {
  margin-top: 20px;
}
/deep/ .vxe-table--header-wrapper table {
  width: 100% !important;
}
/deep/ .vxe-table--body-wrapper table {
  width: 100% !important;
}
</style>
