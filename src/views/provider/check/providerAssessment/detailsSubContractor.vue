<!--
 * @Description: 分包商考核审核详情
 * @Version:
 * @Autor:
 * @Date: 2020-02-08 17:45:30
 * @LastEditTime: 2020-02-20 09:53:46
 -->

<template>
  <div class="margin-bottom-100">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <!--    <Title title="分包商考核审核详情" />-->
    <Base :form="form" />
    <!-- 审核 -->

    <!-- 审核组件 start -->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard" @emit="handleEmitForm"></CheckCard>
    </template>
    <!-- 审核组件 end -->

    <!--    <CheckForm ref="checkForm" :type="type" :checkForm="form" />-->
    <!-- 保存等操作按钮 -->
    <div class="btn-box-footer">
      <el-button :class="type === 'check' ? '' : 'btn-box-footer-button'" @click="goBack">取消</el-button>
      <el-button v-if="type === 'check'" type="primary" class="btn-box-footer-button" @click="check">审核</el-button>
    </div>
  </div>
</template>

<script>
// 分包商考核详情
import Base from '@/views/provider/components/check/detailsSubContractor'
import api from '@/api/provider/check.js'
import Api from '@/api/contract/contractManage'
export default {
  name: 'SubContractorrAssessmentDetails',
  components: {
    Base
    // CheckForm
  },
  data() {
    return {
      id: this.$route.query.id,
      type: this.$route.query.type,
      // 操作日志
      operateList: [],
      fileList: [
        {
          name: '文件1',
          value: '23'
        }
      ],
      form: {
        projectId: localStorage.getItem('projectId'),
        supplierCheckScoreList: [],
        type: 1
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
  computed: {
    allScore() {
      let number = 0
      this.form.supplierCheckScoreList.forEach(item => {
        number += 10
      })
      return number.toFixed(0)
    },
    number() {
      let number = 0
      this.form.supplierCheckScoreList.forEach(item => {
        number += item.score
      })
      return number.toFixed(0)
    }
  },
  created() {
    let isCheck = this.$route.params
    this.isCheck = isCheck
  },
  mounted() {
    if (this.id) {
      this.getDetails()
    }
  },
  methods: {
    check() {
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
    async getDetails() {
      let res = await api.getSupplierCheckDetails(this.id)
      if (res) {
        this.form = res.data
      }
    },
    handleEmitForm(data) {
      console.log(data)
      Api.handleCheck(data).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    goBack() {
      this.$router.push({
        name: 'ProviderAssessment'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.synthesize {
  font-size: 20px;
  font-weight: 900;
  padding-top: 20px;
}
.score-list {
  position: relative;
  z-index: 900;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
  }
  .desc {
    font-size: 12px;
    text-align: center;
    width: 100px;
  }
  .slider {
    width: 88%;
  }
}
</style>
