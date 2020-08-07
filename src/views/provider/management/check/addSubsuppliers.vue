<template>
  <div class="margin-bottom-100">
    <Title title="新建分供商考核" />
    <!-- 基本信息 -->
    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">{{ id ? form.supplierName : '分供商基本信息' }}</div>
        <el-form ref="form" class="base-info-card" label-width="120px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="9">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label-width="20px">
                <el-button type="text" @click="chooseProvider">选择供应商</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核开始日期" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  style="width: 100%;"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="考核结束日期" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="被考核部门" prop="beCheckedOrganId">
                <el-input v-model="form.beCheckedOrganId" class="none"></el-input>
                <SelectDepart
                  :id.sync="form.beCheckedOrganId"
                  :multiple="false"
                  :value="form.beCheckedOrganId ? { id: form.beCheckedOrganId, label: form.beCheckedOrganName } : null"
                  :label.sync="form.beCheckedOrganName"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核部门" prop="checkDeptId">
                <el-input v-model="form.checkDeptId" class="none"></el-input>
                <SelectDepart
                  :id.sync="form.checkDeptId"
                  :multiple="false"
                  :value="form.checkDeptId ? { id: form.checkDeptId, label: form.checkDeptName } : null"
                  :label.sync="form.checkDeptName"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核人" prop="checker">
                <el-input v-model="form.checker" class="none"></el-input>
                <SelectUser
                  :id.sync="form.checker"
                  :value="form.checker ? { id: form.checker, label: form.checkerName } : null"
                  :name.sync="form.checkerName"
                  :multiple="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="考核描述" prop="checkDesc">
                <el-input v-model="form.checkDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件" prop="fileId">
                <el-input v-model="form.fileId" style="display: none;"></el-input>
                <US :ids="form.fileId" :multiple="true" @input="fileChange" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </section>
    <!-- 评分基本情况 -->
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">评分基本信息</div>
        <el-table
          :data="form.supplierCheckScoreList"
          show-summary
          sum-text="综合平均得分"
          :summary-method="summaryMethod"
        >
          <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>
          <el-table-column label="考核项目" align="center" prop="project"></el-table-column>
          <el-table-column label="考核名称" align="center" prop="name"></el-table-column>
          <el-table-column label="参考分值" align="center" prop="fraction"></el-table-column>
          <el-table-column label="考核内容" align="center" prop="content"></el-table-column>
          <el-table-column label="所得分值" align="center">
            <template slot-scope="{ row }">
              <el-select v-model="row.score" placeholder="请选择" @change="summaryMethod">
                <el-option v-for="item in row.fraction" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="详细说明" align="center" prop="remark">
            <template slot-scope="{ row }">
              <el-input v-model="row.remark"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </section>
    <div class="btn-box-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save('draft')">保存为草稿</el-button>
      <el-button type="primary" class="btn-box-footer-button" @click="save('submit')">提交</el-button>
    </div>
    <ChooseProvider ref="chooseProvider" :type="2" @chooseSure="chooseSure" />
  </div>
</template>

<script>
import ChooseProvider from '../components/ChooseProvider'
import api from '@/api/provider/check.js'

export default {
  name: 'AddSubsuppliers',
  components: {
    ChooseProvider
  },
  data() {
    return {
      id: this.$route.query.id,
      form: {
        type: 2,
        fileId: '',
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
        supplierName: [
          {
            required: true,
            message: '供应商名称必填'
          }
        ],
        startTime: [
          {
            required: true,
            message: '考核开始日期必填'
          }
        ],
        endTime: [
          {
            required: true,
            message: '考核结束日期必填'
          }
        ],
        beCheckedOrganId: [
          {
            required: true,
            message: '被考核部门必选'
          }
        ],
        checkDeptId: [
          {
            required: true,
            message: '考核部门必选'
          }
        ],
        checker: [
          {
            required: true,
            message: '考核人必选'
          }
        ],
        checkDesc: [
          {
            required: true,
            message: '考核描述必填',
            trigger: 'blur'
          }
        ],
        fileId: [
          {
            required: true,
            message: '附件必传'
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
    // 被考核部门更改
    beCheckedOrgan(e) {
      if (e) {
        this.form.beCheckedOrganId = e.id
        this.form.beCheckedOrganName = e.organName
      } else {
        this.form.beCheckedOrganId = null
        this.form.beCheckedOrganName = null
      }
    },
    // 考核部门更改
    checkDept(e) {
      if (e) {
        this.form.checkDeptId = e.id
        this.form.checkDeptName = e.organName
      } else {
        this.form.checkDeptId = null
        this.form.checkDeptName = null
      }
    },
    // 考核人
    checker(e) {
      if (e) {
        this.form.checker = e.id
        this.form.checkerName = e.label
      } else {
        this.form.checker = null
        this.form.checkerName = null
      }
    },
    fileChange(e, f) {
      if (e.length === 0) return (this.form.fileId = '')
      this.form.fileId = e.map(item => item.id).join(',')
    },
    // 选择供应商
    chooseProvider() {
      this.$refs.chooseProvider.show()
    },
    chooseSure(e) {
      this.form.supplierId = e.id
      this.$set(this.form, 'supplierName', e.name)
    },
    async getDetails() {
      let res = await api.getSupplierDetalis(this.id)
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
      }
    },
    cancel() {
      this.$router.push({ name: 'ProviderCheck' })
    },
    async save(type) {
      let number = 0
      let len = this.form.supplierCheckScoreList.length
      let flag = this.form.supplierCheckScoreList.some(item => item.score === null)
      if (flag) return this.$message.error('分值必填')
      this.form.supplierCheckScoreList.forEach((item, index) => {
        number += item.score
        item.checkItem = index
      })
      this.form.checkScore = number.toFixed(2)
      this.form.supplierCheckScoreList.forEach((item, index) => (item.itemSeq = index))
      this.$refs.form.validate(valid => {
        if (valid) {
          if (type === 'draft') {
            this.draftSure()
          } else {
            this.submit()
          }
        }
      })
    },
    async draftSure() {
      let res = await api.saveSupplierCheck(this.form)
      this.$message.success('保存成功')
      this.cancel()
    },
    async submit() {
      let res = await api.submitSupplierCheck(this.form)
      this.$message.success('保存成功')
      this.cancel()
    },
    // 综合评分
    summaryMethod(params) {
      let number = 0
      let list = _.cloneDeep(this.form.supplierCheckScoreList)
      list.forEach(item => {
        /*
         * @任务编号:1504 || 初始值显示问题
         * @开发人员:张龙
         * @日期:2020-04-07
         * @任务类型:修改代码
         */
        // if (item.score === null) item.score = 0
        // number += item.score
        number += item.score || 0
      })
      number = number.toFixed(0)
      return ['综合平均得分', number]
    }
  }
}
</script>

<style lang="scss" scoped></style>
