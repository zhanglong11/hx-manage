<!--
 * @Description: 审核form
 * @Version:
 * @Autor:
 * @Date: 2020-02-19 15:19:28
 * @LastEditTime: 2020-02-27 09:52:05
 -->
<template>
  <div class="margin-bottom-100">
    <!-- 审核 -->
    <section class="padding-top-20">
      <el-card class="box-card">
        <div slot="header" class="card-header">审核</div>
        <el-form
          v-if="type === 'check'"
          ref="form"
          class="base-info-card"
          label-width="100px"
          :model="form"
          :rules="rules"
        >
          <el-form-item label="审核结果" prop="auditStatus">
            <el-radio-group v-model="form.auditStatus" size="medium" @change="resultChange">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="auditOpinion">
            <el-input v-model="form.auditOpinion" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <US :ids="form.auditFileId" :multiple="true" @input="fileChange" />
          </el-form-item>
        </el-form>
        <el-form v-else class="base-info-card" label-width="100px" :model="form">
          <el-form-item label="审核结果">
            {{ auditStatusFilter() }}
          </el-form-item>
          <el-form-item label="审核意见" prop="auditOpinion">
            {{ form.auditOpinion }}
          </el-form-item>
          <el-form-item label="附件">
            <FileList :ids="form.auditFileId" />
          </el-form-item>
        </el-form>
      </el-card>
    </section>
  </div>
</template>

<script>
import supplierState from '@/lib/supplier/supplierState'
export default {
  name: 'FormCheck',
  props: {
    checkForm: {
      type: Object
    },
    // 是详情还是编辑
    type: {}
  },
  data() {
    return {
      form: {},
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
            required: false,
            message: '审核意见必填',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    checkForm: {
      handler: function (n, o) {
        if (n) {
          let copy = JSON.parse(JSON.stringify(this.checkForm))
          this.form = copy
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    resultChange(e) {
      console.log(e)
      if (!e) {
        //不通过：审核意见必填
        this.rules.auditOpinion[0].required = true
      } else {
        this.rules.auditOpinion[0].required = false
      }
    },
    auditStatusFilter() {
      return _.get(
        supplierState.find(item => item.value === this.form.status),
        'label',
        '-'
      )
    },
    fileChange(e) {
      if (e.length === 0) return (this.form.auditFileId = '')
      this.form.auditFileId = e.map(item => item.id).join(',')
    },
    judge() {
      let data = null
      this.$refs.form.validate(valid => {
        if (valid) {
          data = this.form
        } else {
          data = false
        }
      })
      return data
    }
  }
}
</script>

<style lang="less" scoped></style>
