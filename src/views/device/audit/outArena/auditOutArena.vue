<!--
* @任务编号: 2824 || 审核接口对接
* @开发人员:张龙
* @日期:2020-03-03
* @任务类型:修改代码
-->
<template>
  <div>
    <ViewFlow :id="$route.query.id" />
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>设备退场</span>
        </h6>
        <ul>
          <li>
            <span class="label">编码</span>
            <span class="val">{{ orderInfo.equipmentNum }}</span>
          </li>
          <li>
            <span class="label">名称</span>
            <span class="val">{{ orderInfo.equipmentName }}</span>
          </li>
          <li>
            <span class="label">规格及型号</span>
            <span class="val">{{ orderInfo.specification }}</span>
          </li>
          <li>
            <span class="label">进场日期</span>
            <span class="val">{{ orderInfo.enterTime }}</span>
          </li>
          <li>
            <span class="label">退场日期</span>
            <span class="val">{{ orderInfo.actualLeaveTime }}</span>
          </li>
          <li>
            <span class="label">退场负责人</span>
            <span class="val">{{ orderInfo.principalName }}</span>
          </li>
          <li>
            <span class="label">是否结算</span>
            <span class="val">{{ orderInfo.settlementFlag }}</span>
          </li>
          <li>
            <span class="label">设备退场单号</span>
            <span class="val">{{ orderInfo.leaveCode }}</span>
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
            <span class="val">{{ orderInfo.check }}</span>
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
    <section style="margin-top: 10px;">
      <!--<el-card>
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
          <el-form-item label="审核结果" prop="auditStatus" style="width:50%">
            <el-radio-group v-model="form.auditStatus">
              <el-radio :label="1">同意</el-radio>
              <el-radio :label="0">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="auditOpinion " style="width:50%">
            <el-input v-model="form.auditOpinion" type="textarea" />
          </el-form-item>
          <el-form-item label="附件" prop="file" style="width:50%">
            <FileUpload v-model="form.file" />
          </el-form-item>
        </el-form>
      </el-card>-->
      <CheckCard :id="$route.query.id" ref="checkCard" :isAdd="isCheck" @emit="handleEmitForm"></CheckCard>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import paramList from '@/lib/paramList'
import api from '@/api/device/equipment/outArena'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      paramList,
      form: {},
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
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await api.audit({ ...this.form, ...{ id: this.$route.query.id } })
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
