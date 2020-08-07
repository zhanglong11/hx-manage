<template>
  <div class="margin-bottom-100">
    <Title title="分供商考核审核详情" />
    <Base :form="form" />
    <!-- 审核 -->
    <CheckForm ref="checkForm" :type="type" :checkForm="form" />
    <!-- 保存等操作按钮 -->
    <div class="btn-box-footer">
      <el-button :class="type === 'check' ? '' : 'btn-box-footer-button'" @click="goBack">取消</el-button>
      <el-button v-if="type === 'check'" type="primary" class="btn-box-footer-button" @click="saveJudge"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
// 分供商考核详情
import CheckForm from '../components/CheckForm'
import Base from '@/views/provider/components/check/detailsSubsuppliers'
import api from '@/api/provider/check.js'
export default {
  name: 'ProviderAssessmentDetails',
  components: {
    Base,
    CheckForm
  },
  data() {
    return {
      id: this.$route.query.id,
      type: this.$route.query.type,
      fileList: [
        {
          name: '文件1',
          value: '23'
        }
      ],
      form: {
        type: 2,
        projectId: localStorage.getItem('projectId'),
        supplierCheckScoreList: [
          {
            project: '质量水平(30分)',
            name: '质量管理体系',
            fraction: 2,
            content: '尽力质量管理依稀并取得认证证书得2分,无质量管理体系得0分',
            score: null,
            checkItem: null
          },
          {
            project: '',
            name: '产品认证情况',
            fraction: 3,
            content: '产品取得所有认证得3分；出现一项无产品认证得0分',
            score: null,
            checkItem: null
          },
          {
            project: '',
            name: '到货质量',
            fraction: 10,
            content: '到货物资经检验确认为不合格的，每次扣2分；由此影响生产、工程进度的，视情况扣3~10分',
            score: null
          },
          {
            project: '',
            name: '使用质量',
            fraction: 10,
            content: '物资使用过程中发生质量问题的，每次扣3分，影响生产正常进行的，每次扣5分',
            score: null
          },
          {
            project: '',
            name: '质量评价',
            fraction: 5,
            content:
              '对产品的使用寿命和作业成本进行经济评价，同类产品多个供应商的产品经济评价效果最好的得满分，其他依次类推',
            score: null
          },
          {
            project: '合同履约(20分)',
            name: '合同履约率',
            fraction: 8,
            content: '全年合同履约率达到100%得8分，95%~100%减3分；90%~95%减5分，90%以下不得分',
            score: null
          },
          {
            project: '',
            name: '交货的及时性',
            fraction: 7,
            content: '交货时间达不到合同或其他约定要求的，每次扣1分，由此影响生产、工程进度的，视情况扣3~7分',
            score: null
          },
          {
            project: '',
            name: '交货的准确性',
            fraction: 5,
            content:
              '交货数量未按合同或其他约定要求，超出合理量差范围的，每次扣1~2分；交货物资规格型号与合同或其他约定不符的，每次扣2~3分；物资到货后质量说明书,合格证,使用说明出,图纸,物料等不完整,不符合要求的,递次扣1分'
            // score: null
          },
          {
            project: '交货能力（15分）',
            name: '交易数量',
            fraction: 5,
            content: '考核期内同类产品该供应商供应我公司数量，最高得5分，按次序排得分依次递减1分'
            // score: null
          },
          {
            project: '',
            name: '交货周期',
            fraction: 3,
            content:
              '同类产品多个供应商供应周期最长的供应商得1分，供应周期每缩短5天加0.5分；同类产品单一供应商供应周期与上年相比每缩短5天加1分，此项最高3分'
            // score: null
          },
          {
            project: '',
            name: '增/减订货的响应能力',
            fraction: 3,
            content: '供应商对用户要求增/减订货给予配合的，每次加1分，最高3分'
            // score: null
          },
          {
            project: '',
            name: '零星或紧急订单的保证能力',
            fraction: 4,
            content: '供应商对公司零星或紧急订货给予积极解决的，视情况每次加1分，最高4分'
            // score: null
          },
          {
            project: '售后服务、诚信经营（20分）',
            name: '诚信经营',
            fraction: 5,
            content: '诚信经营得5分，不诚信经营得0分'
            // score: null
          },
          {
            project: '',
            name: '问题处理',
            fraction: 4,
            content: '对公司发出的招标、报价、工作会议、问题整改等信息，一次未反馈的扣2分，反馈不及时的扣1分，扣完为止'
            // score: null
          },
          {
            project: '',
            name: '售后服务',
            fraction: 4,
            content:
              '公司各单位对供应商进行投诉一次的扣1分，未按合同约定进行技术培训、安装调试和其他售后服务项目的每次扣2分，扣完为止'
            // score: null
          },
          {
            project: '',
            name: '共同改进、参与开发',
            fraction: 3,
            content: '供应商在产品技术改良、新产品开发、降低成本方面与公司积极配合，视情况得1~3分'
            // score: null
          },
          {
            project: '',
            name: '反应及时率',
            fraction: 4,
            content: '对公司发出的招标、报价、工作会议、问题整改等信息，一次未反馈的扣2分，反馈不及时的扣1分，扣完为止'
            // score: null
          },
          {
            project: '价格水平（15分）',
            name: '优惠程度',
            fraction: 10,
            content:
              '同类产品多个供应商的价格按最低为基准，每高出5%扣1分，直至扣完；单一供应商的以上年价格为基准，每高出5%扣1分，直至扣完'
            // score: null
          },
          {
            project: '',
            name: '消化涨价的能力',
            fraction: 5,
            content:
              '注重市场价格变化，能改善流程、提高效率、降低成本，市场涨价时，产品售价能按合同约定执行的得5；市场涨价时，价格基本保持稳定，提出涨价愿望，但仍按照合同执行的得3分；市场涨价时，申请涨价，不按合同执行，消极供应或停止供货的，此项不得分'
            // score: null
          }
        ]
      },

      rules: {
        auditStatus: [
          {
            required: true,
            message: '审核结果必选',
            trigger: 'change'
          }
        ],
        auditOpinion: [
          {
            required: true,
            message: '审核意见必填',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getDetails()
    }
  },
  methods: {
    saveJudge() {
      let data = this.$refs.checkForm.judge()
      if (data) {
        this.save(data)
      }
    },
    async save(data) {
      let res = await api.auditSupplierCheck(data)
      this.$message.success('审核成功')
      this.goBack()
    },
    fileChange(e, f) {
      if (e.length === 0) return (this.form.auditFileId = '')
      if (f) {
        this.form.auditFileId = e.join(',')
      } else {
        this.form.auditFileId = e.map(item => item.respons.data)
      }
    },
    stateFilter(state) {
      return _.get(
        supplierState.find(item => item.value === state),
        'label',
        '-'
      )
    },
    async getDetails() {
      let res = await api.getSupplierCheckDetails(this.id)
      if (res) {
        let arr = []
        let list = res.data.supplierCheckScoreList.sort((a, b) => {
          return a.itemSeq - b.itemSeq
        })

        list.forEach((item, index) => {
          let obj = {
            project: this.form.supplierCheckScoreList[index].project,
            name: this.form.supplierCheckScoreList[index].name,
            fraction: this.form.supplierCheckScoreList[index].fraction,
            content: this.form.supplierCheckScoreList[index].content,
            score: item.score,
            checkItem: item.checkItem,
            remark: item.remark
          }
          arr.push(obj)
        })
        this.form = res.data
        this.$set(this.form, 'supplierCheckScoreList', arr)
        console.log(this.from)
      }
    },
    goBack() {
      this.$router.push({
        name: 'ProviderAssessment'
      })
    },
    download(item) {},
    goEdit() {
      this.$router.push({ name: 'SubsuppliersAdd', query: { id: this.id } })
    },
    // 综合评分
    summaryMethod(params) {
      let number = 0
      let list = _.cloneDeep(this.form.supplierCheckScoreList)
      list.forEach(item => {
        if (item.score === null) item.score = 0
        number += item.score
      })
      number = number.toFixed(0)
      return ['综合平均得分', number]
    }
  }
}
</script>

<style lang="less" scoped></style>
