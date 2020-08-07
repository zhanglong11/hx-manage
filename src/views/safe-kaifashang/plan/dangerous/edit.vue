<!--
* @任务编号:字段替换，危险源详情赋值
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 修改代码
-->
<template>
  <div class="is-Footer">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="危险源" prop="dangerSource">
          <el-input v-model="form.dangerSource" class="inputStyle" />
        </el-form-item>
        <el-form-item label="伤害类别" prop="category">
          <el-select v-model="form.category" class="inputStyle" multiple @change="getHarmLabel">
            <el-option v-for="item in harmTypeList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险类别" prop="riskCategory">
          <el-select v-model="form.riskCategory" class="inputStyle">
            <el-option v-for="item in riskCategoryList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker v-model="form.beginTime" value-format="yyyy-MM-dd" class="inputStyle" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd" class="inputStyle" />
        </el-form-item>
        <el-form-item label="防范措施" prop="precautionaryMeasure">
          <el-input v-model="form.precautionaryMeasure" type="textarea" class="inputStyle" />
        </el-form-item>
        <el-form-item label="项目责任领导" prop="principalLeaderName">
          <div style="display: flex;" class="inputStyle">
            <el-input v-model="form.principalLeaderName" disabled />
            <el-button type="text" @click="showLeaderDialog">选择人员</el-button>
          </div>
        </el-form-item>
        <el-form-item label="责任人" prop="principalName">
          <div style="display: flex;" class="inputStyle">
            <el-input v-model="form.principalName" disabled />
            <el-button type="text" @click="showPrincipalDialog">选择人员</el-button>
          </div>
        </el-form-item>
        <el-form-item label="责任人联系方式" prop="principalContact">
          <el-input v-model="form.principalContact" class="inputStyle" />
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <FileEdit v-model="form.files" class="inputStyle" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" class="inputStyle" />
        </el-form-item>
      </el-form>
    </section>
    <section style="margin-top: 20px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>危险源关键部位</span>
        </div>
        <EditTable v-model="dangerSourcePlaces" :tableColumn="tableColumn" :validRules="validRules" />
      </el-card>
    </section>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <SelectPeopleDialog :visible.sync="leaderVisible" @choose="chooseLeader" />
    <SelectPeopleDialog :visible.sync="principalVisible" @choose="choosePrincipal" />
  </div>
</template>

<script>
import EditTable from '@/components/EditTable'
import riskCategoryList from '../../lib/riskCategoryList'
import harmTypeList from '../../lib/harmTypeList'
import Api from '../../api'
export default {
  name: 'Edit',
  components: { EditTable },
  data() {
    return {
      riskCategoryList,
      harmTypeList,
      form: {},
      rules: {
        dangerSource: { required: true, message: '必填' },
        category: { required: true, message: '必填' },
        harmCategory: { required: true, message: '必填' },
        precautionaryMeasure: { required: true, message: '必填' },
        principalLeaderName: { required: true, message: '必填' },
        principalName: { required: true, message: '必填' },
        beginTime: [
          { required: true, message: '必填' },
          {
            validator: (rule, val, callback) => {
              if (moment(val).isAfter(this.form.endTime)) {
                callback(new Error('结束时间必须大于开始时间'))
              }
              callback()
            }
          }
        ],
        endTime: [
          { required: true, message: '必填' },
          {
            validator: (rule, val, callback) => {
              if (moment(val).isBefore(this.form.beginTime)) {
                callback(new Error('结束时间必须大于开始时间'))
              }
              callback()
            }
          }
        ]
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
      let res = await Api.dangerous.getDangerousInfoById(this.$route.params.id, {})
      this.form = res.data

      this.dangerSourcePlaces = res.data.dangerSourcePlaces ? res.data.dangerSourcePlaces : []
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$route.params.id
            ? await Api.dangerous.updateDangerous({ ...this.form, ...{ dangerSourcePlaces: this.dangerSourcePlaces } })
            : await Api.dangerous.addDangerous({ ...this.form, ...{ dangerSourcePlaces: this.dangerSourcePlaces } })
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    getHarmLabel(label) {
      let labelName = label.map(item => this.$getLabel(harmTypeList, item))
      this.form = {
        ...this.form,
        ...{
          harmCategory: label.join(','),
          harmCategoryNames: labelName.join(',')
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
@import '../../style.less';
</style>
