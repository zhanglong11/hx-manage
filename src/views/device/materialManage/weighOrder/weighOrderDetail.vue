<!--
@任务名称: 1020/过磅单调整
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，过磅单详情页样式调整，去掉无用的详情属性，修改比例(10%)
-->
<template>
  <div class="right-panel indexWrapper">
    <div class="detail-a">
      <div class="detail-a-head">
        <!--
        /**
         任务名称：BUG#1378 物资与设备管理-材料管理-所有的查看页面-应该是单据类型加编号
         开发人员：崔洛宜
         日期：2020-03-30
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
      -->
        <!-- <div>{{ headData.billCode }}</div>-->
        <div>过磅单{{ headData.billCode }}</div>
      </div>
      <!--<div class="detail-a-status">
        <span style="color: #c1c1c1; font-size: 12px;">状态</span><br />
        <span>
          {{
            headData.status !== null && headData.status !== undefined
              ? baseStatus.filter(item => item.value === headData.status)[0].label
              : ''
          }}
        </span>
      </div>-->
      <div class="detail-a-des">
        <div>
          <div>
            <span>采购单</span>
            <span>{{ headData.purchaseCode }}</span>
          </div>
          <div>
            <span>检斤人员</span>
            <span>{{ headData.inspectorName }}</span>
          </div>
          <div>
            <span>检斤日期</span>
            <span>{{ headData.inspectTime }}</span>
          </div>
          <!--<div>
            <span>车牌号</span>
            <span>{{ headData.carNum }}</span>
          </div>
          <div>
            <span>物资重量</span>
            <span>{{ headData.totalWeight }}</span>
          </div>-->
        </div>
        <div>
          <div>
            <span>创建人</span>
            <span>{{ headData.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ headData.createTime }}</span>
          </div>
          <div class="accessory">
            <div>附件</div>
            <div>
              <FileList :ids="headData.fileId" />
            </div>
          </div>
          <div class="remark">
            <span>备注</span>
            <span>{{ headData.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--
       /**
        任务名称：1256/新建采购单的问题
        开发人员：崔洛宜
        日期：2020-03-23
        BUG类型：自测bug
        **/
     -->
    <div class="detail-b">
      <div class="detail-b-head">过磅明细</div>
      <div class="detail-b-table">
        <vxe-table border resizable show-overflow :data="tableDataDetail">
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
          <vxe-table-column field="roughWeight" title="毛重"></vxe-table-column>
          <vxe-table-column field="tareWeight" title="皮重"></vxe-table-column>
          <vxe-table-column field="netWeight" title="净重"></vxe-table-column>
          <vxe-table-column field="carNum" title="车牌号"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </div>

    <div class="detail-c footerButton">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/material/weighOrder'
import baseStatus from '@/lib/basicStatus'
import FileApi from '@/api/file'
export default {
  name: 'WeighOrderDetail',
  data() {
    return {
      headData: {},
      fileUrlList: [],
      /**
        任务名称：1256/新建采购单的问题
        开发人员：崔洛宜
        日期：2020-03-23
        BUG类型：自测bug
        **/
      tableDataDetail: [],
      baseStatus
    }
  },
  created() {
    let { id } = this.$route.params
    this.id = id
    this.getDetail(id)
  },
  methods: {
    getDetail(id) {
      Api.getDetailById(id).then(res => {
        if (res.code === 200) {
          this.headData = res.data
          this.tableDataDetail = res.data.list
          let fileList = res.data.fileId.split(',')
          if (fileList.length > 0) {
            FileApi.getFileList(fileList).then(res => {
              if (res.data) {
                this.fileUrlList = res.data
              }
            })
          }
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleEdit() {
      this.$router.push({ name: 'WeighOrderEdit', params: { id: this.headData.id, isEdit: true } })
    },
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['net'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
    },
    handleBack() {
      this.$router.back()
    },

    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
    }
  }
}
</script>

<style scoped lang="less"></style>
