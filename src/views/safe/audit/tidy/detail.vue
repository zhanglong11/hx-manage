<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>安全整改:({{ orderInfo.number }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">安全检查</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">计划整改完成日期</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creator }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.files" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <p class="status">状态</p>
        <p class="status-info">待审核</p>
      </div>
    </div>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>检查项明细</span>
        </div>
        <VXTable ref="table" :columns="checkColumn" :tableData="tableList" />
      </el-card>
    </section>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>操作记录</span>
        </div>
        <VXTable ref="table" :columns="tableColumn" :tableData="tableList" :pageShow="false" />
      </el-card>
    </section>
    <section style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>审核</span>
        </div>
        <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
          <el-form-item label="审核结果" prop="result" style="width: 50%;">
            <el-radio-group v-model="form.auditStatus">
              <el-radio :label="0">同意</el-radio>
              <el-radio :label="1">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="remark " style="width: 50%;">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
          <el-form-item label="附件" prop="file" style="width: 50%;">
            <FileUpload v-model="form.file" />
          </el-form-item>
        </el-form>
      </el-card>
    </section>
    <div class="btn-box">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        number: 'GB50300-2013',
        type: '国家标准',
        creator: '张静如',
        content: '建筑工程施工质量验收统一标准.pdf',
        time: '2020-02-23 10:00:00',
        remark: '这是一段备注'
      },
      tableList: [
        {
          id: 1,
          type: '国家标准',
          creator: '张佑轩',
          time: '2020/1/1110:11'
        }
      ],
      requestFlag: false,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'creator',
          title: '操作人'
        },
        {
          field: 'time',
          title: '操作时间'
        },
        {
          field: 'type',
          title: '操作类型'
        },
        {
          field: 'content',
          title: '操作内容'
        },
        {
          field: '',
          title: '附件',
          width: 200,
          slots: {
            default: ({ row }) => {
              return [<el-button type="text">附件</el-button>]
            }
          }
        }
      ],
      form: {},
      checkColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkName',
          title: '检查项名称'
        },
        {
          field: 'name',
          title: '检查结果'
        },
        {
          field: 'name',
          title: '存在隐患部位'
        },
        {
          field: 'name',
          title: '备注'
        },
        {
          field: 'remark',
          title: '整改措施'
        },
        {
          field: 'remark',
          title: '整改负责人'
        },
        {
          field: 'remark',
          title: '实际完成日期'
        },
        {
          field: 'name',
          title: '复查验证结果'
        },
        {
          field: 'name',
          title: '复查人'
        },
        {
          field: 'name',
          title: '复查日期'
        }
      ]
    }
  },
  methods: {
    toEdit(id) {
      this.$router.push({ path: 'checkStandardEdit', params: { id } })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
