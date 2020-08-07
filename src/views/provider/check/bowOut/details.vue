<!--
 * @Description: 分包商退场详情
 * @Version:
 * @Autor:
 * @Date: 2020-02-14 17:02:49
 * @LastEditTime: 2020-02-21 15:45:39
 -->
<template>
  <div>
    <!--    <Title title="分包商退场详情" />-->
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <!-- 基本信息 -->
    <Base :form="form" />
    <!-- <CheckStep /> -->
    <!--    <CheckForm ref="checkForm" :type="type" :checkForm="form" />-->
    <!-- 审核组件 start -->
    <template v-if="isCheck || [2, 3, 5, 6].includes(headData.status)">
      <CheckCard :id="id" ref="checkCard" @emit="handleEmitForm"></CheckCard>
    </template>
    <!-- 审核组件 end -->
    <div class="btn-box-footer">
      <el-button :class="type === 'check' ? '' : 'btn-box-footer-button'" @click="goBack">返回</el-button>
      <el-button v-if="type === 'check'" class="btn-box-footer-button" type="primary" @click="check">审核</el-button>
    </div>
  </div>
</template>

<script>
// import CheckStep from '../components/CheckStep'
import Base from '@/views/provider/components/bowOut/Details'
import api from '@/api/provider/bowOut.js'
import CheckForm from '../components/CheckForm'
import Api from '@/api/contract/contractManage'
export default {
  name: 'SubContractorBowOutCheckDetails',
  components: {
    // CheckForm,
    Base
  },
  data() {
    return {
      conclusions: [
        {
          label: '全部',
          value: null
        },
        {
          label: '是',
          value: 0
        },
        {
          label: '否',
          value: 1
        }
      ],
      id: this.$route.query.id,
      type: this.$route.query.type,
      requestFlag: false,
      form: {
        id: this.$route.query.id
      },
      operatList: [],
      fileList: [
        {
          name: '文件1',
          value: '23'
        }
      ]
    }
  },
  created() {
    if (this.id) {
      this.getDetails()
      console.log(this.$route.query)
    }
    let isCheck = this.$route.params
    this.isCheck = isCheck
  },
  methods: {
    check() {
      let data = this.$refs.checkForm.judge()
      if (data) {
        this.checkSure(data)
      }
    },
    async checkSure(data) {
      let res = await api.audit(data)
      this.$message.success('审核成功')
      this.goBack()
    },
    conclusionsFilter(e) {
      return _.get(
        this.conclusions.find(item => item.value === e),
        'label',
        '-'
      )
    },
    async getDetails() {
      let res = await api.getCheckDetails(this.id)
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
      this.$router.push({ name: 'SubContractorBowOutCheck' })
    }
  }
}
</script>

<style lang="less" scoped></style>
