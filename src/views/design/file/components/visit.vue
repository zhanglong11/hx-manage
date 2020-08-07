<!--
 * @Description: 访问权限
 * @Author:
 * @Date: 2020-01-22 15:34:26
 -->
<template>
  <div>
    <el-dialog title="访问权限" :visible.sync="visitFlag" width="700px" @close="close">
      <div class="content-body">
        <el-table
          :data="tableData"
          style="width: 100%; margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{ children: 'userList' }"
        >
          <el-table-column prop="name" label="参与人员"></el-table-column>
          <!-- 这里写权限列表 -->
          <el-table-column label="操作权限">
            <template v-if="scope.row.list" slot-scope="scope">
              <el-checkbox-group v-model="scope.row.list">
                <el-checkbox v-for="item in privilegeList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
            <!-- <template slot-scope="scope">{{ scope.row }}</template> -->
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visitFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitJudge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/design/file'
export default {
  props: {
    // table数据：copy一份
    userList: {},
    // 文件夹所属模块
    module: {},
    // 里程碑id
    taskUniqueId: {},
    // 一级部门id
    departmentId: {}
  },
  data() {
    return {
      test: [],
      visitFlag: false,
      tableData: [],
      // 权限list
      privilegeList: [
        {
          name: '重命名',
          id: 'rename'
        },
        {
          name: '删除',
          id: 'delete'
        },
        {
          name: '访问权限',
          id: 'access'
        },
        {
          name: '下载',
          id: 'download'
        },
        {
          name: '审核进度',
          id: 'select_audit'
        }
      ],
      copy: [],
      folderId: ''
    }
  },
  watch: {
    visitFlag(val) {
      if (val) {
        let copy = JSON.parse(JSON.stringify(this.userList))
        this.copy = copy.filter(item => item.id === this.departmentId)
        this.getAccess()
      }
    }
  },
  methods: {
    async getAccess() {
      let res = await api.getAccess(this.folderId)
      let accessObj = res.data
      if (accessObj) {
        this.copy.forEach(item => {
          item.userList.forEach(userItem => {
            userItem.list = accessObj[userItem.id] ? accessObj[userItem.id] : []
          })
        })
      }
      this.tableData = this.copy
    },
    async submitJudge() {
      // let obj = {
      //   accessType: '', //权限
      //   departmentId: '', //一级部门id
      //   folderId: '', //文件夹id
      //   module: '', //unit自定义，pigeonhole归档，share分享，collaboration外部协作
      //   projectId: '', //项目id
      //   taskUniqueId: '', //里程碑id
      //   userId: ''
      // }
      // 聚集所有用户
      let userList = this.tableData.map(item => {
        return item.userList.map(userItem => {
          userItem.folderId = this.folderId
          userItem.module = this.module
          userItem.departmentId = this.departmentId
          userItem.taskUniqueId = this.taskUniqueId
          userItem.projectId = localStorage.getItem('projectId')
          userItem.userId = userItem.id
          userItem.accessType = userItem.list.join(',')
          return userItem
        })
      })
      let list = [].concat.apply([], userList)
      let res = await api.setAccess(list)
      this.$message.success('设置成功')
      this.close()
    },
    show(id) {
      this.folderId = id
      this.visitFlag = true
    },
    async getUserList() {
      let obj = {
        prokectId: localStorage.getItem('projectId')
      }
      let res = await api.getUserList(obj)
      console.log(res)
      this.tableData = res.data
    },
    close() {
      this.visitFlag = false
    }
  }
}
</script>
<style lang="less" scoped>
.content-body {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
