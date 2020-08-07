<template>
  <div class="outContainer">
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="整改状态" prop="rectifyStatus">
          <el-select v-model="filterForm.rectifyStatus">
            <el-option v-for="item of rectifyStatus" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="复验合格日期">
          <DateRange :start-time.sync="filterForm.passBeginTime" :end-time.sync="filterForm.passEndTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 10px;">
      <Grid ref="table" :filter-form.sync="filterForm" :request="request">
        <vxe-table-column type="index" title="序号" width="80" />
        <vxe-table-column field="name" title="验收名称" />
        <vxe-table-column field="issueDesctiption" title="问题描述" />
        <vxe-table-column field="rectifyPrincipalName" title="整改人" />
        <vxe-table-column field="acceptancePassTime" title="整改完成时间" formatter="ymd" />
        <vxe-table-column
          field="rectifyStatus"
          title="整改状态"
          :formatter="({ cellValue }) => $getLabel(rectifyStatus, cellValue)"
        />
        <vxe-table-column field="remark" title="备注" />
        <vxe-table-column title="操作" width="180">
          <template slot-scope="{ row }">
            <!--待整改-->
            <template v-if="row.rectifyStatus === 2">
              <el-button
                v-if="$hasPower('OverInspectDetailWriteNoticeEpc') && row.principalId === userId"
                type="text"
                @click="handleNoticeRectify(row)"
                >通知整改</el-button
              >
            </template>
            <!--整改中-->
            <template v-if="row.rectifyStatus === 3">
              <el-button
                v-if="$hasPower('OverInspectDetailWriteFillEpc') && row.rectifyPrincipal === userId"
                type="text"
                @click="toWriteRectify(row)"
                >填写整改结果</el-button
              >
            </template>
            <!--待复检-->
            <template v-if="row.rectifyStatus === 4">
              <el-button
                v-if="$hasPower('OverInspectDetailWriteCheckEpc') && row.principalId === userId"
                type="text"
                @click="toDetail(row, true)"
                >填写验收结果</el-button
              >
            </template>
            <!--复检不合格-->
            <template v-if="row.rectifyStatus === 6">
              <el-button
                v-if="$hasPower('OverInspectDetailWriteEpc') && row.rectifyPrincipal === userId"
                type="text"
                @click="toWriteRectify(row)"
                >填写整改结果</el-button
              >
            </template>
            <el-button v-if="$hasPower('OverInspectDetailWriteEpc')" type="text" @click="toDetail(row, false)"
              >查看</el-button
            >
          </template>
        </vxe-table-column>
      </Grid>
    </div>
    <NoticeRectify
      v-if="noticeRectifyVisible"
      :visible.sync="noticeRectifyVisible"
      @submit="handleNoticeRectifySubmit"
    ></NoticeRectify>
  </div>
</template>

<script>
import rectifyStatus from '../lib/rectifyStatus'
import NoticeRectify from '../component/NoticeRectify'
import Api from '../api/rectify.js'
export default {
  name: 'OverInspectRectifyList',
  components: {
    NoticeRectify
  },
  props: {},
  data() {
    return {
      userId: localStorage.getItem('id'),
      rectifyStatus,
      filterForm: {},
      noticeRectifyVisible: false, //通知整改弹窗
      selectRow: {},
      request: body => {
        return Api.getList({ ...body, projectId: localStorage.getItem('projectId'), type: 2 })
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    //填写整改结果
    toWriteRectify(row) {
      this.$router.push({ name: 'OverInspectRectifyWriteResultEpc', params: { id: row.id } })
    },
    //填写验收结果
    toWriteInspect(row) {
      this.$router.push({ name: 'OverInspectDetailWriteEpc', params: { id: row.id, isCheck: true } })
    },
    // 查看任务
    toDetail(row, isCheck) {
      this.$router.push({
        name: 'OverInspectRectifyDetailEpc',
        params: { id: row.id, isCheck },
        query: {
          type: 'rectifier',
          isOver: true
        }
      })
    },
    //通知整改
    handleNoticeRectify(row) {
      this.selectRow = row
      this.noticeRectifyVisible = true
    },
    //通知整改提交
    async handleNoticeRectifySubmit(data) {
      console.log(data)
      await Api.noticeRectify({ ...data, id: this.selectRow.id })
      this.$message.success('通知成功')
      this.noticeRectifyVisible = false
      await this.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
