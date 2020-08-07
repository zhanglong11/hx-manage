<template>
  <div class="outContainer">
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="filterForm.search" placeholder="验收范围" style="width: 200px;">
            <i slot="suffix" class="el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="验收状态" prop="acceptanceStatus">
          <el-select v-model="filterForm.acceptanceStatus">
            <el-option v-for="item of inspectStatus" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="整改状态" prop="rectifyStatus">
          <el-select v-model="filterForm.rectifyStatus">
            <el-option v-for="item of rectifyStatus" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划验收时间">
          <DateRange :start-time.sync="filterForm.beginTime" :end-time.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-row>
      <el-col>
        <el-button v-if="true || $hasPower('AddOverInspectEpc')" icon="el-icon-plus" type="primary" @click="addNew"
          >新建</el-button
        >
      </el-col>
    </el-row>-->
    <div style="margin-top: 10px;">
      <Grid ref="table" :filter-form.sync="filterForm" :request="request">
        <vxe-table-column type="index" title="序号" width="80" />
        <vxe-table-column field="name" title="验收名称" />
        <vxe-table-column field="acceptanceScope" title="验收范围" />
        <vxe-table-column field="planAcceptanceTime" title="计划验收日期" formatter="ymd" />
        <vxe-table-column field="organizer" title="组织单位" />
        <vxe-table-column field="participant" title="参加单位" />
        <vxe-table-column field="actualAcceptanceTime" title="填报时间" formatter="ymd" />
        <vxe-table-column field="fillPersonName" title="填报人" />
        <vxe-table-column field="principalName" title="负责人" />
        <vxe-table-column field="createTime" title="创建时间" width="150" />
        <vxe-table-column
          field="acceptanceStatus"
          title="验收状态"
          :formatter="({ cellValue }) => $getLabel(inspectStatus, cellValue)"
        />
        <vxe-table-column
          field="rectifyStatus"
          title="整改状态"
          :formatter="({ cellValue }) => $getLabel(rectifyStatus, cellValue)"
        />
        <vxe-table-column title="操作" width="200">
          <template slot-scope="{ row }">
            <template v-if="row.acceptanceStatus === 0">
              <el-button v-if="$hasPower('OverInspectDetailEpc')" type="text" @click="toDetail(row)">查看</el-button>
              <el-button v-if="$hasPower('EditOverInspectEpc')" type="text" @click="toEdit(row)">编辑</el-button>
              <el-button v-if="$hasPower('DeleteOverInspectEpc')" type="text" @click="handleDelete(row)"
                >删除</el-button
              >
            </template>
            <template v-else-if="row.acceptanceStatus === 1">
              <el-button v-if="$hasPower('OverInspectDetailEpc')" type="text" @click="toDetail(row, '')"
                >查看</el-button
              >
            </template>
            <!--已通过-->
            <template v-else-if="row.acceptanceStatus === 2">
              <el-button
                v-if="$hasPower('FillOverInspectEpc') && row.principalId === userId"
                type="text"
                @click="toDetail(row, 'inspector')"
                >填报验收结果</el-button
              >
            </template>
            <!--已驳回-->
            <template v-else-if="row.acceptanceStatus === 3">
              <el-button v-if="$hasPower('EditOverInspectEpc')" type="text" @click="toEdit(row)">修改</el-button>
            </template>
            <template v-else>
              <el-button v-if="$hasPower('OverInspectDetailEpc')" type="text" @click="toDetail(row, 'inspector')"
                >查看</el-button
              >
            </template>
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
import inspectStatus from '../lib/inspectStatus'
import rectifyStatus from '../lib/rectifyStatus'
import NoticeRectify from '../component/NoticeRectify'
import Api from '../api/inspect.js'
export default {
  name: 'OverInspectList',
  components: {
    NoticeRectify
  },
  props: {},
  data() {
    return {
      userId: localStorage.getItem('id'),
      inspectStatus,
      rectifyStatus,
      filterForm: {},
      noticeRectifyVisible: false, //通知整改弹窗
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
    addNew() {
      this.$router.push({ name: 'AddOverInspectEpc', params: { id: '' } })
    },
    toEdit(row) {
      this.$router.push({ name: 'EditOverInspectEpc', params: { id: row.id } })
    },
    // 查看任务
    toDetail(row, type) {
      this.$router.push({
        name: 'OverInspectDetailEpc',
        params: { id: row.id, isCheck: false },
        query: {
          type: type,
          isOver: true
        }
      })
    },
    //驳回修改
    toRejectEdit(row) {
      this.$router.push({ name: 'EditRejectProjectFirstInspectEpc', params: { id: row.id, isReject: true } })
    },
    //删除
    async handleDelete(row) {
      await this.$confirm('此操作将删除该竣工验收, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      let res = await Api.delete(row.id)
      if (res) this.$message.success('删除成功')
      this.refresh()
    },
    //通知整改
    handleNoticeRectify() {
      this.noticeRectifyVisible = true
    },
    //通知整改提交
    async handleNoticeRectifySubmit(data) {
      console.log(data)
      this.noticeRectifyVisible = false
    }
  }
}
</script>

<style lang="less" scoped></style>
