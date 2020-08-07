<template>
  <div>
    <div><el-button plain @click="handleExport">导出</el-button></div>
    <div class="tableWrapper">
      <vxe-table ref="xTable" v-loading="loading" border :data="tableData" auto-resize>
        <!--<vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>-->
        <vxe-table-column field="serialNumber" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="itemName" title="名称" />
        <vxe-table-column field="model" title="型号" />
        <vxe-table-column field="specifications" title="规格" />
        <vxe-table-column field="unit" title="单位" />
        <vxe-table-column field="quantity" title="数量" />
        <vxe-table-column field="unitPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="combinedPrice" title="合价"></vxe-table-column>
      </vxe-table>
    </div>
    <div style="margin-top: 10px;">
      <div class="toolbar" style="display: flex; justify-content: space-between;">
        <div class="num">
          共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
          <el-button
            type="text primary"
            class="el-icon-refresh"
            style="transform: scale(1.4);"
            @click="getData"
          ></el-button>
        </div>
        <el-pagination
          class="pagination"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="prev,pager,next,sizes,jumper"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api/contract/contractManage/merchants'
export default {
  name: 'ContractOrderList',
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.contractId) {
        this.loading = true
        Api.getContractInventoryPurchase({
          rows: this.pageSize,
          page: this.currentPage,
          contractId: this.contractId
        })
          .then(res => {
            this.total = res.data.total
            this.tableData = res.data.records
          })
          .finally(() => (this.loading = false))
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.getData()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    handleExport() {
      Api.exportContractInventoryPurchase({
        contractId: this.contractId
      }).then(res => {
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName = '项目清单.xls'
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
