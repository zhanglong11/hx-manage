<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.dangerSource }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">伤害类别</span>
            <span class="val">{{ orderInfo.harmCategoryNames }}</span>
          </li>
          <li>
            <span class="label">防范措施</span>
            <span class="val">{{ orderInfo.precautionaryMeasure }}</span>
          </li>
          <li>
            <span class="label">项目责任领导</span>
            <span class="val">{{ orderInfo.principalLeaderName }}</span>
          </li>
          <li>
            <span class="label">责任人</span>
            <span class="val">{{ orderInfo.principalName }}</span>
          </li>
          <li>
            <span class="label">责任人联系方式</span>
            <span class="val">{{ orderInfo.principalContact }}</span>
          </li>

          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
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
        <p class="status-info">
          <span class="val">{{ _.get(_.find(paramList.safeCommonStatus, { value: orderInfo.status }), 'label') }}</span>
        </p>
      </div>
    </div>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>危险源关键部位</span>
        </div>
        <VXTable ref="table" :columns="partsColumn" :tableData="tableList" :pageShow="false" />
      </el-card>
    </section>
    <section style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>审核</span>
        </div>
        <el-form
          ref="form"
          :model="form"
          :disabled="orderInfo.status !== 1"
          :rules="rules"
          class="form"
          label-width="110px"
        >
          <el-form-item label="审核结果" prop="auditStatus" style="width: 50%;">
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
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/plan/dangerous'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      tableList: [],
      requestFlag: false,
      // 表格表头
      partsColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'placeName',
          title: '关键部位名称'
        },
        {
          field: 'remark',
          title: '备注'
        }
      ],
      form: {},
      paramList,
      rules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
      this.tableList = res.data.dangerSourcePlaces
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.form.auditStatus
            ? await api.auditReject(this.$route.query.id)
            : await api.auditPass(this.$route.query.id)
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
