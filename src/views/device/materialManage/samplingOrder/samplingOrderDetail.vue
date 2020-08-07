<template>
  <div class="indexWrapper">
    <div style="display: flex; justify-content: space-between;">
      <!--
        /**
         任务名称：BUG#1378 物资与设备管理-材料管理-所有的查看页面-应该是单据类型加编号
         开发人员：崔洛宜
         日期：2020-03-30
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
      -->
      <!--<div style="font-weight: bold">{{ headData.billCode }}</div>-->
      <div style="font-weight: bold;">取样单{{ headData.billCode }}</div>
    </div>
    <div style="text-align: right; padding-top: 20px;">
      <span style="color: #c1c1c1; font-size: 12px;">状态</span><br />
      <span>
        {{
          headData.status !== null && headData.status !== undefined
            ? baseStatus.filter(item => item.value === headData.status)[0].label
            : ''
        }}
      </span>
    </div>

    <div class="description">
      <div>
        <div>
          <span>取样单</span>
          <span>{{ headData.purchaseCode }}</span>
        </div>
        <div>
          <span>取样人员</span>
          <span>{{ headData.inspectorName }}</span>
        </div>
        <div>
          <span>取样日期</span>
          <span>{{ headData.inspectTime }}</span>
        </div>
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
        <div class="item">
          <span style="vertical-align: top;">附件</span>
          <span style="display: inline-block;">
            <!--
                /**
                 任务名称：BUG#1379 物资与设备管理-材料管理-所有的查看页面-下载附件-下载的文件名是乱码
                 开发人员：崔洛宜
                 日期：2020-03-31
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
            -->
            <FileList :ids="headData.fileId" />
            <!--<template v-for="(item, index) of fileUrlList">
              <div :key="index + 'item'" class="fileName">
                <span>{{ item.fileName }}</span>
                &lt;!&ndash;
                    /**
                     任务名称：1325/材料管理下载附件修改
                     开发人员：崔洛宜
                     日期：2020-03-26
                     任务类型：修改下载附件
                     **/
                &ndash;&gt;
                <a style="margin-left: 10px" :href="item.fileUrl" :download="item.fileName">点击下载</a>
              </div>
            </template>-->
          </span>
        </div>
        <div style="display: flex;">
          <span style="white-space: nowrap;">备注</span>
          <span>{{ headData.remark }}</span>
        </div>
      </div>
    </div>

    <div>
      <!-- /**
      任务名称：2698/取样单修改
      开发人员：崔洛宜
      日期：2020-03-24
      任务类型：修改逻辑结构
      **/-->
      <div style="padding: 10px 0px;">取样明细</div>
      <vxe-table border resizable show-overflow :data="tableDataDetail">
        <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
        <vxe-table-column field="materialName" title="名称"></vxe-table-column>
        <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
        <vxe-table-column field="batchNum" title="批号"></vxe-table-column>
        <vxe-table-column field="manufactureTime" title="生产时间" width="204"></vxe-table-column>
        <vxe-table-column field="samplingAmount" title="取样数量"></vxe-table-column>
        <vxe-table-column field="inspectContent" title="检验项目"></vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </div>
    <div style="text-align: right; padding-top: 10px;" class="footerButton">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/material/samplingOrder'
import baseStatus from '@/lib/basicStatus'
import FileApi from '@/api/file'
export default {
  name: 'SamplingOrderDetail',
  data() {
    return {
      headData: {},
      fileUrlList: [],
      /**
       任务名称：2698/取样单修改
       开发人员：崔洛宜
       日期：2020-03-24
       任务类型：修改逻辑结构
       **/
      tableDataDetail: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalResult: 100,
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
          /**
           任务名称：2698/取样单修改
           开发人员：崔洛宜
           日期：2020-03-24
           任务类型：修改逻辑结构
           **/
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
      this.$router.push({ name: 'SamplingOrderEdit', params: { id: this.headData.id, isEdit: true } })
    },
    /**
      任务名称：2698/取样单修改
      开发人员：崔洛宜
      日期：2020-03-24
      任务类型：修改逻辑结构
    **/
    /*    footerMethod({ columns, data }) {
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
    },*/
    handleBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.description {
  display: flex;
  > div {
    flex: 1;
    font-size: 14px;
    > div {
      padding: 10px 0px;
      > span:nth-child(1) {
        color: #c1c1c1;
        padding-right: 10px;
      }
    }
  }
}
.fileName {
  span,
  a {
    display: inline-block;
    vertical-align: middle;
  }
  span {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.item {
  display: flex;
  align-items: baseline;
}
</style>
