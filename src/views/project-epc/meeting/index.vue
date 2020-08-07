<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyword"
            style="width: 260px;"
            placeholder="会议名称/会议地点/发起人/参与人"
          ></el-input>
        </el-form-item>
        <el-form-item label="会议状态">
          <el-select v-model="filterForm.status">
            <el-option v-for="e in meetingStatusList" :key="e.value" :label="e.label" :value="e.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议时间">
          <DateRange :start-time.sync="filterForm.startTime" :end-time.sync="filterForm.endTime"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="() => $refs.table.reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-button v-if="$hasPower('ProjectMeetingAddEpc')" type="primary" @click="$router.push('meeting/add')"
          >发起会议</el-button
        >
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="会议名称" field="meetingName"></vxe-table-column>
      <vxe-table-column
        title="会议时间"
        :show-overflow="false"
        :formatter="({ row }) => row.startTime + ' - ' + row.endTime"
      ></vxe-table-column>
      <vxe-table-column title="会议地点" field="meetingAddress"></vxe-table-column>
      <vxe-table-column title="会议主题" field="meetingSubject"></vxe-table-column>
      <vxe-table-column title="发起人" field="initiatorName" width="100px"></vxe-table-column>
      <vxe-table-column title="会议内容" field="meetingContent"></vxe-table-column>
      <vxe-table-column
        width="80px"
        title="会议状态"
        field="status"
        :formatter="({ cellValue }) => $getLabel(meetingStatusList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="200px">
        <template v-slot="{ row }">
          <el-button v-if="$hasPower('ProjectMeetingAddEpc')" type="text" @click="$router.push('meeting/' + row.id)"
            >查看</el-button
          >
          <el-button
            v-if="row.status === 0 && $hasPower('ProjectMeetingEditEpc')"
            type="text"
            @click="$router.push('meeting/' + row.id + '/edit')"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status === 4 && ($hasPower('ProjectMeetingRecordEpc') || row.recorderId === $store.state.user.id)"
            type="text"
            @click="$router.push('meeting/' + row.id + '/record')"
          >
            会议记录
          </el-button>
          <el-button v-if="row.status === 0 && $hasPower('ProjectMeetingDeleteEpc')" type="text" @click="remove([row])">
            删除
          </el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import meetingStatusList from '../lib/meetingStatusList'
export default {
  name: 'Meeting',
  data() {
    return {
      meetingStatusList,
      filterForm: {
        meetingType: 'meetingType_1'
      },
      request(body) {
        return this.axios.system.post('systemMeeting/list', body)
      }
    }
  },
  computed: {
    userList() {
      return this.$store.state.userList
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    submit() {},
    async remove(rows) {
      await this.$tipRemove(rows, 'meetingName')
      await this.axios.system.post('systemMeeting/delete/' + _.map(rows, 'id').join(','))
      this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
