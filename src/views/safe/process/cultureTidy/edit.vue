<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <span>状态：不合格</span>
        </h6>
        <ul>
          <li>
            <span class="label">安全检查编号</span>
            <span class="val">{{ orderInfo.checkNumber }}</span>
          </li>
          <li>
            <span class="label">安全整改编号</span>
            <span class="val">{{ orderInfo.rectificationNumber }}</span>
          </li>
          <li>
            <span class="label">问题等级</span>
            <span class="val">{{ _.get(_.find(paramList.questionLevel, { value: orderInfo.levels }), 'label') }}</span>
          </li>
          <li>
            <span class="label">紧急程度</span>
            <span class="val">{{ _.get(_.find(paramList.urgencyDegree, { value: orderInfo.urgency }), 'label') }}</span>
          </li>
          <li>
            <span class="label">问题描述</span>
            <span class="val">{{ orderInfo.describes }}</span>
          </li>
          <li>
            <span class="label">整改人</span>
            <span class="val">{{ orderInfo.rectificationerName }}</span>
          </li>
          <li>
            <span class="label">整改期限</span>
            <span class="val">{{ orderInfo.rectificationPeriodTime }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.rectificationRequire }}</span>
          </li>
          <!--          <li>-->
          <!--            <span class="label">复查人</span>-->
          <!--            <span class="val">{{ orderInfo.checkResultDTO.checkPersonName }}</span>-->
          <!--          </li>-->
          <li>
            <span class="label">关键部位</span>
            <span class="val">{{ orderInfo.placeNames }}</span>
          </li>
          <li>
            <span class="label">检查人</span>
            <span class="val">{{ orderInfo.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">检查时间</span>
            <span class="val">{{ orderInfo.checkDate }}</span>
          </li>
          <li>
            <span class="label">附件---现场照片</span>
            <span class="val"> <FileList :ids="orderInfo.files" /></span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <section v-if="tidyList.length" style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>整改记录</span>
        </div>
        <el-collapse>
          <el-collapse-item
            v-for="item in tidyList"
            :key="item.id"
            :title="`整改时间：${item.rectificationTime}`"
            :name="item.id"
          >
            <div class="info">
              <div class="content">
                <ul>
                  <li>
                    <span class="label">整改人</span>
                    <span class="val">{{ item.rectificationerName }}</span>
                  </li>
                  <li>
                    <span class="label">备注</span>
                    <span class="val">{{ item.remark }}</span>
                  </li>
                  <li>
                    <span class="label">整改照片</span>
                    <span class="val"> <FileList :ids="orderInfo.files" /></span>
                  </li>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </section>
    <section style="margin-top: 10px;">
      <el-card style="overflow-y: auto;">
        <div slot="header" class="card-header">
          <span>整改情况</span>
        </div>
        <el-form ref="form" :model="form" style="width: 500px;" :rules="rules" class="form" label-width="110px">
          <el-form-item label="整改人" prop="rectificationer">
            <SelectUser
              :id.sync="form.rectificationer"
              :appendToBody="true"
              :value="form.rectificationer ? { id: form.rectificationer, label: form.rectificationerName } : null"
              :name.sync="form.rectificationerName"
              :multiple="false"
            />
          </el-form-item>
          <el-form-item label="整改时间" prop="rectificationTime" style="width: 100%;">
            <el-date-picker v-model="form.rectificationTime" value-format="yyyy-MM-dd 00:00:00" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="整改描述" prop="remark" style="width: 100%;">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
          <el-form-item label="整改照片" prop="files" style="width: 100%;">
            <FileEdit v-model="form.files" />
          </el-form-item>
        </el-form>
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import paramList from '@/lib/paramList'
import api from '@/api/safe/process/cultureTidy'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        checkResultDTO: {}
      },
      paramList,
      tidyList: [],
      rules: {
        rectificationer: [{ required: true, message: '必填' }],
        rectificationTime: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      },
      form: {}
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
      if (
        res.data.rectificationResult.find(r => r.draftFlag === 0) &&
        res.data.rectificationResult.find(r => r.draftFlag === 0).rectificationTime
      ) {
        this.form = res.data.rectificationResult.find(r => r.draftFlag === 0)
      }
      this.tidyList = res.data.rectificationResult.filter(r => r.draftFlag !== 0)
    },
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let info = {
            civilizationCheckId: this.orderInfo.civilizationCheckId,
            safetySourceId: this.orderInfo.rectificationId,
            id: this.orderInfo.rectificationResult.find(r => r.draftFlag !== 1).id
          }
          let res = isAudit
            ? await api.submitAudit({ ...this.form, ...info })
            : await api.update({ ...this.form, ...info })
          this.$message.success('保存成功')
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
c
<style scoped lang="less">
.form {
  display: flex;
  flex-wrap: wrap;
}
</style>
