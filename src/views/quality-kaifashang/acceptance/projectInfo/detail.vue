<template>
  <div class="is-Footer white">
    <div class="info">
      <div class="content">
        <div class="infoWrapper">
          <el-row>
            <el-col :span="16">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">单位编号</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">单位名称</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">资料类型</div>
                    <div class="lrCellValue">{{ $getLabel(materialTypeList, orderInfo.materialType) }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">项目种类</div>
                    <div class="lrCellValue">{{ $getLabel(projectTypeList, orderInfo.projectType) }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <VXTable
      ref="table"
      :columns="type === 2 ? recordColumn : infoColumn"
      :tableData="detailList"
      :pageShow="false"
      :show-footer="true"
      :footer-method="footerMethod"
    />
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import materialTypeList from '../../lib/materialTypeList'
import projectTypeList from '../../lib/projectTypeList'
import Api from '../../api/index'
import XEUtils from 'xe-utils'
export default {
  name: 'Detail',
  data() {
    return {
      materialTypeList,
      projectTypeList,
      orderInfo: {},
      detailList: [],
      type: 1,
      requestFlag: false,
      // 表格表头
      infoColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'materialName',
          title: '资料名称  '
        },
        {
          field: 'materialCopies',
          title: '份数',
          width: 140
        },
        {
          field: 'remark',
          title: '备注'
        },
        {
          field: 'fileIds',
          title: '操作',
          slots: {
            default: ({ row }) => [<FileList ids={row.fileIds} />]
          }
        }
      ],
      recordColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkItem',
          title: '资料名称  '
        },
        {
          field: 'checkPointNum',
          title: '检查点'
        },
        {
          field: 'better',
          title: '好点'
        },
        {
          field: 'generalNum',
          title: '一般点'
        },
        {
          field: 'almostNum',
          title: '差点'
        },
        {
          field: 'remark',
          title: '备注'
        }
      ],
      footerMethod({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '合计'
            }
            if (['materialCopies'].includes(column.property)) {
              return XEUtils.sum(data, column.property)
            }
            if (['checkPointNum'].includes(column.property)) {
              return XEUtils.sum(data, column.property)
            }
            if (['better'].includes(column.property)) {
              return XEUtils.sum(data, column.property)
            }
            if (['generalNum'].includes(column.property)) {
              return XEUtils.sum(data, column.property)
            }
            if (['almostNum'].includes(column.property)) {
              return XEUtils.sum(data, column.property)
            }
            return null
          })
        ]
      }
    }
  },
  watch: {
    'orderInfo.materialType'(v) {
      this.type = v === 2 ? 2 : 1
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.projectInfo.detail(this.$route.params.id)
      this.orderInfo = res.data
      this.detailList = res.data.detailList
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../style.less';
</style>
