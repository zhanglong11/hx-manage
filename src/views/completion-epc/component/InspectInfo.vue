<template>
  <div v-if="show">
    <template v-if="type === 'inspect'">
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">验收结果</div>
          <div class="lrCellValue">{{ ['不合格', '合格'][itemInfo.result] }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">总体意见</div>
          <div class="lrCellValue">{{ itemInfo.opinion }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">验收日期</div>
          <div class="lrCellValue">{{ itemInfo.inspectTime | ymd }}</div>
        </div>
      </el-row>
      <el-row v-if="itemInfo.result === 0" class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">问题记录</div>
          <div class="lrCellValue">{{ itemInfo.issueDesctiption }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">附件</div>
          <div class="lrCellValue"><FileList :ids="itemInfo.fileIds" /></div>
        </div>
      </el-row>
    </template>
    <template v-if="type === 'rectify'">
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">验收名称</div>
          <div class="lrCellValue">{{ itemInfo.name }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">问题描述</div>
          <div class="lrCellValue">{{ itemInfo.issueDesctiption }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">整改人</div>
          <div class="lrCellValue">{{ itemInfo.operator }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">整改日期</div>
          <div class="lrCellValue">{{ itemInfo.rectifyTime | ymd }}</div>
        </div>
      </el-row>
      <el-row>
        <div class="lrCellInfo">
          <div class="lrCellLabel">整改結果</div>
          <div class="lrCellValue">{{ '合格' }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">整改附件</div>
          <div class="lrCellValue"><FileList :ids="itemInfo.fileIds" /></div>
        </div>
      </el-row>
    </template>
    <template v-if="type === 'review'">
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">复验结果</div>
          <div class="lrCellValue">{{ ['不合格', '合格'][itemInfo.result] }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">总体意见</div>
          <div class="lrCellValue">{{ itemInfo.opinion }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">复验日期</div>
          <div class="lrCellValue">{{ itemInfo.reviewTime | ymd }}</div>
        </div>
      </el-row>
      <el-row class="rowLine">
        <div class="lrCellInfo">
          <div class="lrCellLabel">复验附件</div>
          <div class="lrCellValue"><FileList :ids="itemInfo.fileIds" /></div>
        </div>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  name: 'InspectInfo',
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'inspect'
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    itemInfo: {
      immediate: false,
      handler(val) {
        this.show = true
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
@import '../style.less';
</style>
