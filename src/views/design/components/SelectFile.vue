<template>
  <el-dialog append-to-body :visible="visible" @close="$emit('update:visible', false)">
    <el-tabs v-model="filterForm.departmentId">
      <el-tab-pane v-for="e in departmentList" :key="e.id" :name="e.id" :label="e.name"></el-tab-pane>
    </el-tabs>
    <el-breadcrumb separator="/" style="margin: 5px 0;">
      <el-breadcrumb-item>
        <el-button
          type="text"
          @click="
            () => {
              pathList = []
              refresh()
            }
          "
          >根目录</el-button
        >
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(e, index) in pathList" :key="e.id">
        <el-button v-if="index !== pathList.length - 1" type="text" @click="pathList.splice(index + 1, 1)">
          {{ e.name }}</el-button
        >
        <el-button v-else type="text">
          <span style="color: #333;">{{ e.name }}</span>
        </el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <vxe-grid
      ref="table"
      v-loading="loading"
      :data="list"
      :checkboxConfig="{
        checkMethod: ({ row }) => row.type === 2
      }"
      @checkbox-change="({ selection }) => (selectedList = selection)"
    >
      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
      <vxe-table-column title="名称">
        <template v-slot="{ row }">
          <el-button v-if="row.type === 1" type="text" @click="pathList.push(row)">{{ row.name }}</el-button>
          <span v-else>{{ row.name }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column
        title="文件大小"
        field="fileSize"
        :formatter="({ cellValue }) => filesize(cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="上传人" field="createName"></vxe-table-column>
      <vxe-table-column title="上传时间" field="createTime"></vxe-table-column>
    </vxe-grid>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :disabled="!selectedList.length" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import filesize from 'filesize'
import api from '@/api/design/file'
export default {
  name: 'SelectFile',
  props: ['milestone', 'visible'],
  data() {
    return {
      loading: false,
      filterForm: {
        departmentId: null,
        module: 'unit'
      },
      departmentList: [],
      pathList: [],
      list: [],
      selectedList: []
    }
  },
  watch: {
    'filterForm.departmentId'() {
      this.pathList = []
      this.refresh()
    },
    pathList(val) {
      _.size(val) && this.refresh()
    }
  },
  created() {
    api.getFirstList({ projectId: localStorage.getItem('projectId') }).then(res => {
      this.departmentList = res.data
      this.filterForm.departmentId = _.first(res.data)?.id
    })
  },
  methods: {
    filesize,
    refresh() {
      this.$refs.table && this.$refs.table.setAllCheckboxRow(false)
      this.loading = true
      let form = Object.assign({}, this.filterForm, {
        projectId: localStorage.getItem('projectId'),
        taskUniqueId: this.milestone.taskUniqueId,
        pid: _.get(_.last(this.pathList), 'id', 0)
      })
      api
        .getFileList(form)
        .then(res => {
          this.list = res.data
        })
        .finally(() => (this.loading = false))
    },
    submit() {
      this.$emit('change', this.selectedList)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs /deep/ .el-tabs__header {
  margin-bottom: 0;
}
</style>
