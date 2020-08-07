<template>
  <div class="indexWrapper">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div style="display: flex; justify-content: space-between;">
      <div style="font-weight: bold;">领料单{{ headData.stockCode }}</div>
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
                <a style="margin-left: 10px" :href="item.fileUrl">点击下载</a>
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
     任务名称：2709/取样单修改
     开发人员：崔洛宜
     日期：2020-03-25
     任务类型：修改逻辑
     **/
-->
    <!-- <div>
      <div style="padding: 10px 0px;">操作记录</div>
      <vxe-table border resizable show-overflow :data="tableDataRecord">
        <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
        <vxe-table-column field="operator" title="操作人"></vxe-table-column>
        <vxe-table-column field="time" title="操作时间"></vxe-table-column>
        <vxe-table-column field="type" title="操作类型"></vxe-table-column>
        <vxe-table-column field="content" title="操作内容"></vxe-table-column>
        <vxe-table-column title="附件">
          <template v-slot="{ row }">
            <a>{{ row.accessory }}</a>
          </template>
        </vxe-table-column>
      </vxe-table>
      <vxe-pager
        border
        size="medium"
        :loading="loading"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </div>

    <div>
      <div style="padding: 10px 0px;">操作记录</div>
      <vxe-table border resizable show-overflow :data="tableDataRecord">
        <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
        <vxe-table-column field="operator" title="操作人"></vxe-table-column>
        <vxe-table-column field="time" title="操作时间"></vxe-table-column>
        <vxe-table-column field="type" title="操作类型"></vxe-table-column>
        <vxe-table-column field="content" title="操作内容"></vxe-table-column>
        <vxe-table-column title="附件">
          <template v-slot="{ row }">
            <a>{{ row.accessory }}</a>
          </template>
        </vxe-table-column>
      </vxe-table>
      <vxe-pager
        border
        size="medium"
        :loading="loading"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </div>-->

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/material/pickOrder'
import baseStatus from '@/lib/basicStatus'
import FileApi from '@/api/file'
export default {
  name: 'PickOrderDetail',
  data() {
    return {
      headData: {},
      fileUrlList: [],
      tableDataDetail: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalResult: 100,
      baseStatus
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
      this.$router.push({ name: 'PickOrderEdit', params: { id: this.headData.id, isEdit: true } })
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
    handleBack() {
      this.$router.back()
    },

    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
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
