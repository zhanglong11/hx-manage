<template>
  <div class="no-padding is-footer">
    <el-card>
      <div slot="header" class="clearfix">
        <span>施工日志详情（项目经理版）</span>
      </div>

      <div class="content">
        <el-row class="row">
          <el-col :span="12">
            编制日期: <span>{{ details.diaryDate }}</span>
          </el-col>
          <el-col :span="12">
            今日天气: <span>{{ details.todayWeather }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            日志编号: <span>{{ details.code }}</span>
          </el-col>
          <el-col :span="12">
            温度 ℃:
            <span v-if="details.lowTemperature"
              >{{ details.lowTemperature + '℃' }} ~ {{ details.highTemperature + '℃' }}</span
            >
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            记录人员: <span>{{ $store.state.user.name }}</span>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            午间温度 ℃: <span>{{ details.noonWeather }}</span>-->
          <!--          </el-col>-->
          <!--        </el-row>-->
          <!--        <el-row class="row">-->
          <!--          <el-col :span="12" :offset="12">-->
          <!--            下午温度 ℃: <span>{{ details.afternoonWeather }}</span>-->
          <!--          </el-col>-->
        </el-row>

        <vxe-table ref="xTree" :span-method="rowspanMethod" border resizable show-overflow :data="persons">
          <!--                  <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>-->
          <vxe-table-column field="workTypeName" title="施工工种"></vxe-table-column>
          <vxe-table-column field="workTypeName" title="施工人数">
            <template v-slot="{ row }">{{ row.personNum }}</template>
          </vxe-table-column>
          <vxe-table-column field="constructionPersonName" title="施工人员"> </vxe-table-column>
          <!--          <vxe-table-column field="areaResponsible" title="负责区域"></vxe-table-column>-->
        </vxe-table>
        <el-row class="row">
          <el-col :span="12">
            今日早会内容: <span>{{ details.morningMeetingContent }}</span>
          </el-col>
          <el-col :span="12">
            今日晚会内容: <span>{{ details.eveningMeetingContent }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            今日早场巡查情况: <span>{{ details.morningShowCondition }}</span>
          </el-col>
          <el-col :span="12">
            今日晚场巡查情况: <span>{{ details.eveningShowCondition }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            今日施工完成进度: <span>{{ details.floorScheduleNames }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            发现问题: <span>{{ details.findProblem || '无' }}</span>
          </el-col>
          <el-col :span="12">
            解决方案: <span>{{ details.solution || '无' }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            解决时间: <span>{{ details.solveTime || '无' }}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          发送到人: <span>{{ details.copyToPersonNames }}</span>
        </el-row>
        <el-row class="row">
          备注: <span>{{ details.remark || '无' }}</span>
        </el-row>
        <el-row class="row">
          附件:
          <AttachmentDialog style="display: inline-block; margin-left: 10px;" :ids="details.fileIds"></AttachmentDialog>
        </el-row>
      </div>
    </el-card>
    <!-- 批注组件 start -->
    <template v-if="$hasPower('ConstructionLogSmartDecorationCommentPCDetail')">
      <AddComments
        :id="logId"
        type="ConstructionLogSmartDecoration"
        :canAdd="$hasPower('ConstructionLogSmartDecorationCommentPCAdd')"
      />
    </template>
    <!-- 批注组件 end -->
    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api/constructionLog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ConstructionLogDetail',
  components: {},
  data() {
    return {
      logId: '',
      details: {},
      persons: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.logId = this.$route.query.id
    this.getData()
  },
  // 方法集合
  methods: {
    getData() {
      Api.getLogDetail(this.logId).then(res => {
        if (res.code === 200) {
          this.details = res.data
          let personList = res.data.personList.map((item, index) => {
            return item.persons.map(subItem => {
              return {
                workTypeName: item.workTypeName,
                personNum: item.personNum,
                constructionPersonName: subItem.constructionPersonName
              }
            })
          })
          this.persons = personList.reduce((total, cur) => {
            return [...total, ...cur]
          }, [])
        }
      })
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod({ row, $rowIndex, column, data }) {
      let fields = ['workTypeName', 'personNum']
      let cellValue = row[column.property]
      if (cellValue && fields.includes(column.property)) {
        let prevRow = data[$rowIndex - 1]
        let nextRow = data[$rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = data[++countRowspan + $rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  border-bottom: 1px solid #ddd;
}
.content {
  font-size: 14px;
  margin-left: 40px;
  .row {
    margin: 20px 0;
    .el-col-12 {
      span {
        color: #999;
      }
    }
  }
}
.back {
  float: right;
  margin-right: 50px;
}
</style>
