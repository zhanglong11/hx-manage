<!--
 * @Description: 分包商进场审核详情
 * @Version:
 * @Autor:
 * @Date: 2020-02-14 17:02:49
 * @LastEditTime: 2020-02-21 15:42:32
 -->
<template>
  <div class="margin-bottom-100">
    <!--    <Title title="分包商进场审核详情" />-->
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <!-- 基本信息 -->
    <Base :form="form" />
    <!-- 审核 -->
    <!--    <CheckForm ref="checkForm" :type="type" :checkForm="form" />-->
    <!-- 审核组件 start -->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard" :isAdd="isCheck" @emit="handleEmitForm"></CheckCard>
    </template>
    <!-- 审核组件 end -->
    <!-- 保存等操作按钮 -->
    <div class="btn-box-footer">
      <el-button :class="type === 'check' ? '' : 'btn-box-footer-button'" @click="goBack">返回</el-button>
      <el-button v-if="type === 'check'" type="primary" class="btn-box-footer-button" @click="check">审核</el-button>
    </div>
  </div>
</template>

<script>
import Base from '@/views/provider/components/enter/Details'
import api from '@/api/provider/enter.js'
import Api from '@/api/contract/contractManage'
export default {
  name: 'SubContractorEnterCheckDetails',
  components: {
    Base
    // CheckForm
  },
  data() {
    return {
      id: this.$route.query.id,
      type: this.$route.query.type,
      requestFlag: false,
      form: {
        name: '测试'
      },
      operatList: [],
      fileList: [
        {
          name: '文件1',
          value: '23'
        }
      ],
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '操作人'
        },
        {
          field: 'number',
          title: '操作时间'
        },
        {
          field: 'number',
          title: '操作类型'
        },
        {
          field: 'number',
          title: '操作内容'
        }
      ]
    }
  },
  created() {
    if (this.id) {
      this.getDetails()
    }
    let isCheck = this.$route.params
    this.isCheck = isCheck
  },
  methods: {
    async getDetails() {
      let res = await api.getCheckDetalis(this.id)
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
      this.$router.push({ name: 'SubContractorEnterCheck' })
    },
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
