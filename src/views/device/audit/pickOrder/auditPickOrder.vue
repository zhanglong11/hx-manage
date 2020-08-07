<template>
  <div>
    <ViewFlow :id="$route.params.id" />
    <div style="display: flex; justify-content: space-between;">
      <div style="font-weight: bold;">{{ headData.receiveBillCode }}</div>
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
          <span>领料单位</span>
          <span>{{ headData.receiveOrganName }}</span>
        </div>
        <div>
          <span>领料人</span>
          <span>{{ headData.receiverName }}</span>
        </div>
        <div>
          <span>领料时间</span>
          <span>{{ headData.receiveTime }}</span>
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
        <div>
          <span style="vertical-align: top;">附件</span>
          <span style="display: inline-block;">
            <template v-for="(item, index) of fileUrlList">
              <div :key="index + 'item'" class="fileName">
                <span>{{ item.fileName }}</span>
                <!--
                    /**
                     任务名称：1325/材料管理下载附件修改
                     开发人员：崔洛宜
                     日期：2020-03-26
                     任务类型：修改下载附件
                     **/
                -->
                <a style="margin-left: 10px;" :href="item.fileUrl">点击下载</a>
              </div>
            </template>
          </span>
        </div>
        <div style="display: flex;">
          <span style="white-space: nowrap;">备注</span>
          <span>{{ headData.remark }}</span>
        </div>
      </div>
    </div>

    <div>
      <div style="padding: 10px 0px;">领料明细</div>
      <vxe-table border resizable show-overflow :data="tableDataDetail" show-footer :footer-method="footerMethod">
        <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
        <vxe-table-column field="materialName" title="名称"></vxe-table-column>
        <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="materialAmount" title="数量"></vxe-table-column>
        <vxe-table-column field="unitPrice" title="单价(元)"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="合价(元)"> </vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </div>
    <!--
        /**
   任务名称：2729/领料单审核
   开发人员：崔洛宜
   日期：2020-03-26
   任务类型：修改逻辑
   **/
    -->
    <CheckCard
      :id="$route.params.id"
      ref="checkCard"
      :isAdd="isCheck"
      :checkFileList="checkFileList"
      :formData="formData"
      @emit="handleEmitForm"
    ></CheckCard>
    <div style="text-align: right; padding-top: 10px;">
      <el-button @click="handleBack">返回</el-button>
      <el-button v-if="isCheck" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/material/pickOrder'
import baseStatus from '@/lib/basicStatus'
import FileApi from '@/api/file'
export default {
  name: 'AuditPickOrder',
  data() {
    return {
      headData: {},
      fileUrlList: [],
      tableDataDetail: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalResult: 100,
      baseStatus,
      checkFileList: [],
      formData: {}
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.getDetail(id)
  },
  methods: {
    getDetail(id) {
      /**
       任务名称：2729/领料单审核
       开发人员：崔洛宜
       日期：2020-03-26
       任务类型：修改审核逻辑
       **/
      Api.getDetailById(id).then(res => {
        if (res.code === 200) {
          this.headData = res.data
          this.tableDataDetail = res.data.list
          let fileList = res.data.fileId.split(',')
          let auditFileId = res.data.auditFileId.split(',')
          this.checkFileList = auditFileId
          this.formData = {
            result: !(res.data.status === 2) ? 1 : 0,
            desc: res.data.auditOpinion
          }
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
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['totalPrice'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
    },
    /**
     任务名称：2729/领料单审核
     开发人员：崔洛宜
     日期：2020-03-26
     任务类型：修改逻辑
     **/
    handleBack() {
      this.$router.back()
    },
    handleSubmit() {
      this.$refs.checkCard.audit()
    },
    /**
     任务名称：2729/领料单审核
     开发人员：崔洛宜
     日期：2020-03-26
     任务类型：修改审核逻辑
     **/
    handleEmitForm(data) {
      console.log(data)
      let postData = {
        id: this.id,
        auditFileId: data.fileIds,
        auditOpinion: data.desc,
        status: !!data.result ? 3 : 2
      }
      Api.handleCheck(postData).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
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
</style>
