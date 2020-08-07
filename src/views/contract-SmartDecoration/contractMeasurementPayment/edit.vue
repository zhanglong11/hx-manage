<template>
  <div>
    <div class="formWrapper">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="选择合同" label-width="160px" prop="contractName">
          <el-input v-model="form.contractName" placeholder="请选择合同" class="inputStyle" disabled> </el-input>
          <a @click="showContractDialog">选择合同</a>
        </el-form-item>
        <el-form-item label="付款单名称" label-width="160px" prop="name">
          <el-input v-model="form.name" placeholder="请输入付款单名称" class="inputStyle"> </el-input>
        </el-form-item>
        <!-- <el-form-item v-if="contractType === 3" label="分包合同付款方式" label-width="160px" prop="payWay">
          <el-radio-group v-model="form.payWay" @change="changePayType">
            <el-radio :label="31">工程进度款</el-radio>
            <el-radio :label="32">月度结算款</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="支付阶段" label-width="160px" prop="paymentStage">
          <!-- :disabled="!payList.length" -->
          <SelectList
            v-model="form.paymentStage"
            style="width: 500px;"
            :has-all-option="false"
            :disabled="!form.contractName"
            filterable
            :self-list="payList"
          />
          <a v-if="form.contractName" @click="showPaymentStageDialog">添加支付阶段</a>
        </el-form-item>
        <el-form-item label="申请金额" label-width="160px" prop="totalAmount">
          <InputNumberCommon v-model="form.totalAmount" class="inputStyle" />
        </el-form-item>
        <el-form-item label="申请金额合计（元）" label-width="160px" prop="totalMoney">
          <InputNumberCommon v-model="form.totalMoney" class="inputStyle" disabled />
        </el-form-item>
        <el-form-item label="付款方" label-width="160px" prop="payer">
          <el-input v-model="form.payer" placeholder="请输入付款方" class="inputStyle" disabled />
        </el-form-item>
        <el-form-item label="收款方" label-width="160px" prop="payee">
          <el-input v-model="form.payee" placeholder="请输入收款方" class="inputStyle" disabled />
        </el-form-item>
        <el-form-item label="支付时间" label-width="160px" prop="paymentTime">
          <el-date-picker
            v-model="form.paymentTime"
            type="datetime"
            placeholder="支付时间"
            class="inputStyle"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="备注" label-width="160px" prop="remark">
          <el-input v-model="form.remark" type="textarea" class="inputStyle" placeholder="备注" />
        </el-form-item>
      </el-form>
    </div>
    <div class="footerButton">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save(null)">保存</el-button>
      <el-button type="primary" @click="save(true)">保存并提交</el-button>
    </div>
    <ContractDialog
      v-if="contractVisible"
      :visible="contractVisible"
      @close="contractVisible = false"
      @submit="getContract"
    />
    <PaymentStageDialog
      v-if="paymentStageVisible"
      :visible.sync="paymentStageVisible"
      @close="paymentStageVisible = false"
      @submit="paymentStageSuccess"
    ></PaymentStageDialog>
  </div>
</template>
<script>
import Api from '@/api/contract/contractMeasurementPayment'
import ContractDialog from './componnets/ContractDialog'
import PaymentStageDialog from './componnets/PaymentStageDialog'
import totalPayPhase from './lib/totalPayPhase'
import projectPayPhase from './lib/projectPayPhase'
import monthPayPhase from './lib/monthPayPhase'
export default {
  name: 'Edit',
  components: { ContractDialog, PaymentStageDialog },
  data() {
    return {
      totalPayPhase,
      projectPayPhase,
      monthPayPhase,
      contractVisible: false,
      contractType: null,
      form: {},
      rules: {
        contractName: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        payWay: [{ required: true, message: '必填' }],
        paymentStage: [{ required: true, message: '必填' }],
        totalAmount: [{ required: true, message: '必填' }],
        payee: [{ required: true, message: '必填' }],
        payer: [{ required: true, message: '必填' }],
        paymentTime: [{ required: true, message: '必填' }]
      },
      // 自定义支付阶段dialog参数
      paymentStageVisible: false
    }
  },
  computed: {
    payList() {
      // if (this.contractType === 1) {
      //   return totalPayPhase
      // } else if (this.contractType === 3) {
      //   return this.form.payWay === 31 ? projectPayPhase : monthPayPhase
      // } else {
      //   return []
      // }
      return this.$getArgList('paymentStage') || []
    }
  },
  created() {
    const { id } = this.$route.params
    this.id = id
    if (id) {
      this.refresh()
    }
  },
  methods: {
    showPaymentStageDialog() {
      this.paymentStageVisible = true
    },
    // 付款方式添加成功的回调，默认填充新增项
    async paymentStageSuccess(data) {
      this.$store.dispatch('setSystemConfigStorage').then(list => {
        let group = this.$getArgList(data.argGroup)
        let matchItem = _.find(group, { label: data.argText }) || {}
        this.form.paymentStage = matchItem.value
        this.paymentStageVisible = false
      })
    },
    async refresh() {
      const res = await Api.getContractMeasurementPaymentById(this.id)
      this.form = res.data
      this.contractType = res.data.contractType
    },
    showContractDialog() {
      this.contractVisible = true
    },
    getContract(row) {
      this.form.paymentStage = null
      this.contractType = row.type
      this.form = {
        ...this.form,
        ...{
          contractId: row.id,
          contractName: row.name,
          payer: row.firstParty, //付款方  甲方
          payee: row.secondParty, //收款方 乙方
          totalMoney: row.applyTotalMoney || 0
        }
      }
      this.contractVisible = false
    },
    async save(isSubmit) {
      await this.$refs.form.validate()
      let id = null
      if (this.id) {
        await Api.updatePrepayment({ ...this.form, ...{ projectId: localStorage.getItem('projectId') } })
        id = this.id
      } else {
        const res = await Api.addPrepayment({ ...this.form, ...{ projectId: localStorage.getItem('projectId') } })
        id = res.data
      }
      if (isSubmit) {
        await Api.audit(id)
      }
      this.$message.success('操作成功')
      this.cancel()
    },
    changePayType() {
      this.form = _.omit(this.form, 'paymentStage')
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.outerContainer {
  padding: 20px;
}
.formWrapper {
  width: 800px;
  margin: 0 auto;
}
.inputStyle {
  width: 500px;
}
</style>
