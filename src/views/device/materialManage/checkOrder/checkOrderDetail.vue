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
      <!-- <div style="font-weight: bold">{{ headData.inspectRecordCode }}</div>-->
      <div style="font-weight: bold;">原材料检验单{{ headData.inspectRecordCode }}</div>
    </div>
    <div class="description">
      <div>
        <div>
          <span>材料名称</span>
          <span>{{ headData.materialName }}</span>
        </div>
        <div>
          <!--
            /**
         任务名称：2700/原材料检验单修改
         开发人员：崔洛宜
         日期：2020-03-25
         任务类型：字段修改
         **/
          -->
          <span>规格型号</span>
          <span>{{ headData.specification }}</span>
        </div>
        <div>
          <span>检验内容</span>
          <span>{{ headData.inspectContent }}</span>
        </div>
        <div>
          <span>实际采样量</span>
          <span>{{ headData.actualSamplingSize }}</span>
        </div>
        <div>
          <span>检验机构</span>
          <span>{{ headData.inspectOrgan }}</span>
        </div>
        <div>
          <span>检验时间</span>
          <span>{{ headData.inspectTime }}</span>
        </div>
        <div>
          <span>检验结果</span>
          <span>{{ !!headData.inspectResult ? '不合格' : '合格' }}</span>
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
    <div style="text-align: right; padding-top: 10px;" class="footerButton">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/device/material/checkOrder'
import FileApi from '@/api/file'
export default {
  name: 'CheckOrderDetail',
  data() {
    return {
      headData: {},
      fileUrlList: [],
      tableDataDetial: [
        {
          id: 1,
          code: '01011234',
          name: '螺纹钢',
          modelNumber: 'φ16',
          unit: 'kg',
          rough: 12,
          tare: 1.5,
          net: 10.5,
          remark: ''
        },
        {
          id: 2,
          code: '01011234',
          name: '螺纹钢筋',
          modelNumber: 'φ12',
          unit: 'kg',
          rough: 12,
          tare: 1.5,
          net: 10.5,
          remark: ''
        }
      ],
      tableDataRecord: [
        {
          id: 1,
          operator: '张静茹',
          time: '2020-01-01 12：00',
          type: '',
          content: '',
          accessory: '附件'
        },
        {
          id: 2,
          operator: '张静茹',
          time: '2020-01-01 12：00',
          type: '',
          content: '',
          accessory: '附件'
        }
      ],

      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalResult: 100
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
      this.$router.push({ name: 'CheckOrderEdit', params: { id: this.headData.id, isEdit: true } })
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
