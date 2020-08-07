<template>
  <el-dialog
    width="900px"
    :title="type === 'detail' ? '详情' : '发起审批'"
    :visible="visible"
    @open="refresh"
    @close="close"
  >
    <ul class="description">
      <li>
        <label>审批状态</label>
        <Status :options="auditStatus" :value="detail.auditStatus"></Status>
      </li>
      <li>
        <label>审批类型</label>
        <span>{{ _.get(_.find(auditType, { value: detail.auditType }), 'label', '未知') }}</span>
      </li>
      <li>
        <label>审批事项</label>
        <span>{{ detail.processInstanceName }}</span>
      </li>
      <li>
        <label>简述</label>
        <span>{{ detail.processInstanceDesp }}</span>
      </li>
      <li>
        <label>发起人</label>
        <span>{{ detail.creatorName }}</span>
      </li>
      <li>
        <label>发起时间</label>
        <span>{{ detail.createTime }}</span>
      </li>
    </ul>

    <vxe-grid border :data="detail.stages" :span-method="colspanMethod">
      <vxe-table-column width="60px" title="序号" field="stageSeq"></vxe-table-column>
      <vxe-table-column width="120px" title="阶段名" field="stageName"></vxe-table-column>
      <vxe-table-column width="80px" title="审批人" field="auditorName"></vxe-table-column>
      <vxe-table-column width="80px" title="审批结果" field="auditResult">
        <Status slot-scope="{ row }" :options="auditResult" :value="row.auditResult"></Status>
      </vxe-table-column>
      <vxe-table-column title="审批意见" field="auditOpinion"></vxe-table-column>
      <vxe-table-column width="120px" title="抄送">
        <template v-slot>
          <ul>
            <li v-for="e in detail.carbonList" :key="e.userId" style="margin-left: 0;">{{ e.name }}</li>
          </ul>
        </template>
      </vxe-table-column>
    </vxe-grid>

    <template v-if="false">
      <h6>关联文件:</h6>
      <vxe-grid>
        <vxe-table-column type="seq" title="序号"></vxe-table-column>
        <vxe-table-column title="文件名" field="title"></vxe-table-column>
        <vxe-table-column title="标签" field="title"></vxe-table-column>
        <vxe-table-column title="大小" field="title"></vxe-table-column>
      </vxe-grid>
    </template>
    <template v-if="false">
      <h6>变更记录:</h6>
      <vxe-grid>
        <vxe-table-column type="seq" title="序号"></vxe-table-column>
        <vxe-table-column title="任务编号" field="title"></vxe-table-column>
        <vxe-table-column title="任务名称" field="title"></vxe-table-column>
        <vxe-table-column title="开始时间" field="title"></vxe-table-column>
        <vxe-table-column title="结束时间" field="title"></vxe-table-column>
        <vxe-table-column title="工期" field="title"></vxe-table-column>
        <vxe-table-column title="前置任务" field="title"></vxe-table-column>
      </vxe-grid>
    </template>

    <template v-if="false">
      <h6>会议审核:</h6>
      <vxe-grid>
        <vxe-table-column type="seq" title="序号"></vxe-table-column>
        <vxe-table-column title="任务编号" field="title"></vxe-table-column>
        <vxe-table-column title="任务名称" field="title"></vxe-table-column>
        <vxe-table-column title="开始时间" field="title"></vxe-table-column>
        <vxe-table-column title="结束时间" field="title"></vxe-table-column>
        <vxe-table-column title="工期" field="title"></vxe-table-column>
        <vxe-table-column title="前置任务" field="title"></vxe-table-column>
      </vxe-grid>
    </template>

    <el-form
      v-show="type === 'audit'"
      ref="form"
      label-width="70px"
      style="margin-top: 15px;"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="审核结果">
        <el-radio-group v-model="form.auditResult">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批意见">
        <el-input v-model="form.auditOpinion" type="textarea"></el-input>
      </el-form-item>
    </el-form>

    <footer v-if="type === 'audit'" slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </footer>
    <footer v-else slot="footer">
      <el-button @click="close">我知道了</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import auditResult from '../lib/auditResult'
import auditStatus from '../lib/auditStatus'
import auditType from '../lib/auditType'
export default {
  name: 'Edit',
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    audit: {
      type: Object,
      require: true
    },
    type: {
      type: String,
      enum: ['detail', 'audit'],
      required: true
    }
  },
  data() {
    return {
      detail: {},
      form: {
        auditResult: null,
        auditOpinion: ''
      },
      rules: {
        auditResult: [{ required: true, message: '必填' }]
      },
      auditResult,
      auditStatus,
      auditType
    }
  },
  methods: {
    refresh() {
      this.axios.design.post('process/instance/detail/' + (this.audit.processInstanceId || this.audit.id)).then(res => {
        res.data.stages = _.flatten(
          res.data.stages.map(e => {
            e.auditorRecords.forEach((f, index) => {
              f.groupLength = e.auditorRecords.length
              f.hidden = !!index
            })
            return e.auditorRecords
          })
        )
        this.detail = res.data
      })
    },
    async submit() {
      await this.$refs.form.validate()
      await this.axios.design.post('process/task/audit', {
        id: this.audit.id,
        ...this.form
      })
      this.$message.success('操作成功')
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
      this.detail = {}
    },
    colspanMethod({ row, rowIndex, column, columnIndex, data }) {
      if ([0, 1].includes(columnIndex)) {
        if (row.hidden) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: row.groupLength,
            colspan: 1
          }
        }
      }

      if (columnIndex === 5) {
        if (rowIndex === 0) {
          return {
            rowspan: data.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }
}
</script>

<style scoped lang="less">
.description {
  margin-bottom: 10px;
  li {
    > * {
      display: inline-block;
      vertical-align: middle;
    }
    label:first-child {
      width: 70px;
      text-align: left;
      margin: 8px;
      &:after {
        content: '：';
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
