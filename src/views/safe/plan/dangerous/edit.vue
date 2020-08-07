<!--
* @任务编号:字段替换，危险源详情赋值
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 修改代码
-->
<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="危险源" prop="dangerSource">
          <el-input v-model="form.dangerSource" />
        </el-form-item>
        <el-form-item label="伤害类别" prop="category">
          <SelectList
            v-model="form.category"
            :multiple="true"
            :hasAllOption="false"
            type="harmTypeList"
            @change="getHarmLabel"
          />
        </el-form-item>
        <!--        张龙 3-23 代码注释-->
        <!--        <el-form-item label="风险类别" prop="riskCategory">-->
        <!--          <SelectList v-model="form.riskCategory" :hasAllOption="false" type="riskTypeList" />-->
        <!--        </el-form-item>-->
        <el-form-item label="防范措施" prop="precautionaryMeasure">
          <el-input v-model="form.precautionaryMeasure" type="textarea" />
        </el-form-item>
        <el-form-item label="项目责任领导" prop="principalLeaderName">
          <div style="display: flex;">
            <el-input v-model="form.principalLeaderName" disabled />
            <el-button type="text" @click="showLeaderDialog">选择人员</el-button>
          </div>
        </el-form-item>
        <el-form-item label="责任人" prop="principalName">
          <div style="display: flex;">
            <el-input v-model="form.principalName" disabled />
            <el-button type="text" @click="showPrincipalDialog">选择人员</el-button>
          </div>
        </el-form-item>
        <el-form-item label="责任人联系方式" prop="principalContact">
          <el-input v-model="form.principalContact" />
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <FileEdit v-model="form.files" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>危险源关键部位</span>
        </div>
        <EditTable v-model="dangerSourcePlaces" :tableColumn="tableColumn" :validRules="validRules" />
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
    <SelectPeopleDialog :visible.sync="leaderVisible" @choose="chooseLeader" />
    <SelectPeopleDialog :visible.sync="principalVisible" @choose="choosePrincipal" />
  </div>
</template>

<script>
import api from '@/api/safe/plan/dangerous'
import EditTable from '@/components/EditTable'
export default {
  name: 'Edit',
  components: { EditTable },
  data() {
    return {
      form: {
        number: null,
        name: null,
        type: null,
        remark: null
      },
      rules: {
        dangerSource: { required: true, message: '必填' },
        harmCategory: { required: true, message: '必填' },
        precautionaryMeasure: { required: true, message: '必填' },
        principalLeaderName: { required: true, message: '必填' },
        principalName: { required: true, message: '必填' }
      },
      leaderVisible: false,
      principalVisible: false,
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'placeName',
          title: '关键部位名称',
          slots: {
            default: ({ row }) => [<el-input v-model={row.placeName} />]
          }
        },
        {
          field: 'remark',
          title: '备注',
          slots: {
            default: ({ row }) => [<el-input v-model={row.remark} />]
          }
        }
      ],
      dangerSourcePlaces: [],
      validRules: {
        name: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
      this.dangerSourcePlaces = res.data.dangerSourcePlaces
    },
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id
            ? await api.update({ ...this.form, ...{ dangerSourcePlaces: this.dangerSourcePlaces } })
            : await api.add({ ...this.form, ...{ dangerSourcePlaces: this.dangerSourcePlaces } })
          if (isAudit) {
            let audit = this.$route.params.id
              ? await api.submitAudit(this.$route.params.id)
              : await api.submitAudit(res.data)
          }
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    getHarmLabel(label) {
      this.form = {
        ...this.form,
        ...{
          harmCategoryNames: label.join(',')
        }
      }
    },
    showLeaderDialog() {
      this.leaderVisible = true
    },
    showPrincipalDialog() {
      this.principalVisible = true
    },
    chooseLeader(row) {
      this.form = {
        ...this.form,
        ...{
          principalLeader: row.id,
          principalLeaderName: row.realName
        }
      }
    },
    choosePrincipal(row) {
      this.form = {
        ...this.form,
        ...{
          principal: row.id,
          principalName: row.realName,
          principalContact: row.mobile
        }
      }
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
