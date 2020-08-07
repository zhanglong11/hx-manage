<!--
 * @Description: 发起审批
 * @Author:
 * @Date: 2020-01-16 17:27:19
 -->
<template>
  <div>
    <el-dialog title="发起审批" :visible.sync="examineFlag" width="60%" @close="examineClose">
      <el-form ref="examine" :model="examineForm" label-width="120px" :rules="examineRules" class="examineForm">
        <el-form-item label="审批原因" prop="processInstanceDesp">
          <el-input v-model="examineForm.processInstanceDesp"></el-input>
        </el-form-item>
        <el-form-item label="审批流程" prop="processId">
          <el-select v-model="examineForm.processId" clearable placeholder="审批流程">
            <el-option v-for="e in list" :key="e.id" :label="e.processName" :value="e.id" />
          </el-select>
          <el-button type="text" class="padding-left" @click="showDetails">流程详情</el-button>
        </el-form-item>
        <el-form-item label-width="60px">
          <p>关联文件列表</p>
          <el-table :data="tableData" style="width: 100%;" max-height="250" header-align="center">
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column prop="name" label="文件名" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="examineFlag = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="flowTitle" :visible.sync="flowFlag" width="60%" @close="flowClose">
      <el-table :data="flowData" style="width: 100%;" max-height="250" header-align="center">
        <el-table-column prop="stageName" label="阶段" align="center"></el-table-column>
        <el-table-column prop="auditorList" label="审批人" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.auditorList.length > 0 ? scope.row.auditorList.map(item => item.name).join(',') : null }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="审批方式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.passFlag === 1 ? '全部通过' : '任一通过' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="carbon" label="抄送人" align="center">
          <template>
            <span v-for="item in carbonList" :key="item.userId">{{ item.name }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/design'
import uuid32 from '@/utils/uuid'
export default {
  props: {},
  data() {
    return {
      flowFlag: false,
      examineFlag: false,
      examineForm: {
        auditType: 'file_check',
        fileId: '',
        processId: '',
        processInstanceDesp: '',
        projectId: localStorage.getItem('projectId')
      },
      flowTitle: '',
      carbonList: [],
      examineRules: {
        processInstanceDesp: [{ required: true, message: '必填', trigger: 'blur' }],
        processId: [{ required: true, message: '必选', trigger: 'change' }]
      },
      list: [],
      tableData: [],
      flowData: [{}]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取流程列表
    getList() {
      api.getProcessTemplateList().then(res => {
        this.list = res
      })
    },
    flowClose() {},
    async showDetails() {
      if (!this.examineForm.processId) return this.$message.error('请选择流程')
      let res = await api.getFlowDetails(this.examineForm.processId)
      this.flowFlag = true
      this.flowTitle = res.data.processName
      this.flowData = res.data.stages
      this.carbonList = res.data.carbonList
    },
    show(data) {
      this.examineFlag = true
      this.tableData = data
    },
    examineClose() {
      this.$nextTick(() => {
        this.$refs.examine.resetFields()
      })
    },
    async sure() {
      if (this.tableData.length === 0) return this.$message.error('请选择文件')
      this.examineForm.fileId = this.tableData.map(item => item.id).join(',')
      this.examineForm.targetId = uuid32()
      let res = await api.flowStar(this.examineForm)
      this.examineFlag = false
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.examineForm {
  padding-left: 34px;
  padding-right: 72px;
}
.padding-left {
  padding-left: 20px;
}
</style>
