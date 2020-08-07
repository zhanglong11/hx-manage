<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
        <el-form-item label="验收名称" prop="acceptanceName">
          <el-input v-model="form.acceptanceName" />
        </el-form-item>
        <el-form-item label="验收日期" prop="acceptanceDate">
          <el-date-picker v-model="form.acceptanceDate" value-format="yyyy-MM-dd" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="验收人" prop="acceptanceManId">
          <SelectUser
            :id.sync="form.acceptanceManId"
            :value="form.acceptanceManId ? { id: form.acceptanceManId, label: form.acceptanceManName } : null"
            :name.sync="form.acceptanceManName"
            :multiple="false"
          />
        </el-form-item>
        <el-form-item label="验收类型" prop="acceptanceType">
          <SelectList v-model="form.acceptanceType" :hasAllOption="false" type="checkTypeList" @input="chooseType" />
        </el-form-item>
        <!-- 检验批验收-->
        <div v-if="form.acceptanceType === 1">
          <el-form-item label="检验批编号" prop="inspectionLotNumber">
            <el-input v-model="form.inspectionLotNumber" />
          </el-form-item>
          <el-form-item label="检验批名称" prop="inspectionLotName">
            <el-input v-model="form.inspectionLotName" />
          </el-form-item>
          <el-form-item label="所属分项" prop="engineeringName">
            <div style="display: flex;">
              <el-input v-model="form.engineeringName" disabled />
              <el-button type="text" @click="showTargetDialog(4)"> 选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="检验批部位" prop="inspectionLotPoint">
            <el-input v-model="form.inspectionLotPoint" />
          </el-form-item>
          <el-form-item label="检验批容量" prop="inspectionLotCapacity">
            <el-input v-model="form.inspectionLotCapacity" />
          </el-form-item>
          <el-form-item label="施工依据" prop="constructionBases">
            <el-input v-model="form.constructionBases" />
          </el-form-item>
          <el-form-item label="验收依据">
            <div style="display: flex;">
              <el-input v-model="form.acceptanceSpecificationName" disabled />
              <el-button type="text" @click="showCheckStandard"> 选择</el-button>
            </div>
          </el-form-item>
        </div>
        <!--        隐蔽工程验收-->
        <div v-if="form.acceptanceType === 2">
          <el-form-item label="隐蔽项目" prop="hideProject">
            <el-input v-model="form.hideProject" />
          </el-form-item>
          <el-form-item label="隐蔽部位" prop="hidePart">
            <el-input v-model="form.hidePart" />
          </el-form-item>
          <el-form-item label="隐蔽内容" prop="hideContent">
            <el-input v-model="form.hideContent" />
          </el-form-item>
        </div>
        <!--        单位工程-->
        <div v-if="form.acceptanceType === 3">
          <el-form-item label="单位编号" prop="engineeringNumber">
            <el-input v-model="form.engineeringNumber" disabled />
          </el-form-item>

          <el-form-item label="单位名称" prop="engineeringName">
            <div style="display: flex;">
              <el-input v-model="form.engineeringName" disabled />
              <el-button type="text" @click="showTargetDialog(1)"> 选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="开工日期" prop="startWorkDate">
            <el-date-picker v-model="form.startWorkDate" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="完工日期" prop="finishWorkDate">
            <el-date-picker v-model="form.finishWorkDate" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
        </div>
        <!--        分部工程-->
        <div v-if="form.acceptanceType === 4">
          <el-form-item label="分部编号" prop="engineeringNumber">
            <el-input v-model="form.engineeringNumber" disabled />
          </el-form-item>
          <el-form-item label="分部名称" prop="engineeringName">
            <div style="display: flex;">
              <el-input v-model="form.engineeringName" disabled />
              <el-button type="text" @click="showTargetDialog(2)"> 选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="分项数量">
            <el-input v-model="form.length" disabled />
          </el-form-item>
        </div>
        <!--        分项工程-->
        <div v-if="form.acceptanceType === 5">
          <el-form-item label="分项编号" prop="engineeringNumber">
            <el-input v-model="form.engineeringNumber" disabled />
          </el-form-item>
          <el-form-item label="分项名称" prop="engineeringName">
            <div style="display: flex;">
              <el-input v-model="form.engineeringName" disabled />
              <el-button type="text" @click="showTargetDialog(4)"> 选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="说明" prop="itemExplain">
            <el-input v-model="form.itemExplain" type="textarea" />
          </el-form-item>
        </div>
        <el-form-item label="附件" prop="fileIds">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </section>
    <section v-if="form.acceptanceType === 1">
      <el-card>
        <div slot="header" class="card-header">
          <span>检验批明细</span>
        </div>
        <EditTable v-model="detailList" :tableColumn="checkColumn" :validRules="validRules" />
      </el-card>
    </section>

    <!--    <section v-if="form.acceptanceType === 3">-->
    <!--      <el-card>-->
    <!--        <div slot="header" class="card-header">-->
    <!--          <span>单位工程</span>-->
    <!--        </div>-->
    <!--        <VXTable ref="table" :columns="tableColumn" :tableData="tableList" :pageShow="false" />-->
    <!--      </el-card>-->
    <!--    </section>-->
    <!--    <section v-if="form.acceptanceType === 3">-->
    <!--      <el-card>-->
    <!--        <div slot="header" class="card-header">-->
    <!--          <span>分部明细</span>-->
    <!--        </div>-->
    <!--        <EditTable v-model="tableList" :tableColumn="branchColumn" :validRules="validRules" />-->
    <!--      </el-card>-->
    <!--    </section>-->
    <!--    <section v-if="form.acceptanceType === 3">-->
    <!--      <el-card>-->
    <!--        <div slot="header" class="card-header">-->
    <!--          <span>分项明细</span>-->
    <!--        </div>-->
    <!--        <EditTable v-model="tableList" :tableColumn="projectColumn" :validRules="validRules" />-->
    <!--      </el-card>-->
    <!--    </section>-->
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
    <SelectCheckStandardDialog :visible.sync="checkVisible" @choose="choose" />
    <SelectTargetResolveDialog :visible.sync="targetVisible" :targetType="targetType" @getTarget="getTarget" />
  </div>
</template>

<script>
import SelectCheckStandardDialog from './components/SelectCheckStandardDialog'
import api from '@/api/quality/acceptance/apply'
export default {
  name: 'Edit',
  components: { SelectCheckStandardDialog },
  data() {
    return {
      checkVisible: false,
      targetVisible: false,
      targetType: null,
      form: {
        acceptanceType: 1
      },
      /*
       * @任务编号:#bug1340||验证功能
       * @开发人员:张龙
       * @日期:2020-03-30
       * @任务类型: 修改代码
       */
      rules: {
        acceptanceName: [{ required: true, message: '必填' }],
        acceptanceDate: [{ required: true, message: '必填' }],
        acceptanceManId: [{ required: true, message: '必填' }],
        inspectionLotNumber: [{ required: true, message: '必填' }],
        inspectionLotName: [{ required: true, message: '必填' }],
        engineeringName: [{ required: true, message: '必填' }],
        inspectionLotPoint: [{ required: true, message: '必填' }],
        inspectionLotCapacity: [{ required: true, message: '必填' }],
        acceptanceType: [{ required: true, message: '必填' }],
        hideProject: [{ required: true, message: '必填' }],
        hidePart: [{ required: true, message: '必填' }],
        hideContent: [{ required: true, message: '必填' }],
        startWorkDate: [{ required: true, message: '必填' }],
        finishWorkDate: [{ required: true, message: '必填' }]
      },
      detailList: [],
      tableList: [],
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '项目'
        },
        {
          field: 'name',
          title: '数量'
        }
      ],
      checkColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'acceptanceItem',
          title: '验收项目',
          slots: {
            default: ({ row }) => [<el-input v-model={row.acceptanceItem} />]
          }
        },
        {
          field: 'itemCategory',
          title: '项目种类',
          slots: {
            default: ({ row }) => [
              <SelectList v-model={row.itemCategory} hasAllOption={false} type="checkApplyProjectType" />
            ]
          }
        },
        {
          field: 'designRequirements',
          title: '设计要求及规范规范',
          slots: {
            default: ({ row }) => [<el-input v-model={row.designRequirements} />]
          }
        }
      ],
      projectColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '检验批名称',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '检验批容量',
          slots: {
            default: ({ row }) => [<el-select v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '检验批部位',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        }
      ],
      validRules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }]
      },
      branchColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '分项名称',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '检验批数量',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        }
      ]
    }
  },
  // watch: {
  //   // 'form.acceptanceType'() {
  //   //   this.form = {
  //   //     ...this.form,
  //   //     ...{
  //   //       qualityTargetDecomposeId: null,
  //   //       engineeringNumber: null,
  //   //       engineeringName: null,
  //   //       length: 0
  //   //     }
  //   //   }
  //   // }
  //   'form.acceptanceType': {
  //     handler() {
  //       console.log(111)
  //       this.form = {
  //         ...this.form,
  //         ...{
  //           qualityTargetDecomposeId: null,
  //           engineeringNumber: null,
  //           engineeringName: null,
  //           length: 0
  //         }
  //       }
  //     },
  //     immediate: false
  //   }
  // },
  created() {
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
      this.detailList = res.data.detailList || []
      console.log(res.data)
    },
    async submit(isAudit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.form.acceptanceType === 1 && !this.detailList.length) {
            this.$message.error('检验批明细不能为空')
            return
          }
          if (
            this.detailList &&
            this.detailList.length &&
            this.detailList.some(d => !d.acceptanceItem || !d.itemCategory || !d.designRequirements)
          ) {
            this.$message.error('请完善检验批明细')
            return
          }
          if (this.form.acceptanceType === 1) {
            let res = this.$route.params.id
              ? await api.update({
                  ...this.form,
                  ...{
                    detailList: this.detailList
                  },
                  ...{ status: isAudit ? 1 : 0 }
                })
              : await api.add({
                  ...this.form,
                  ...{
                    detailList: this.detailList
                  },
                  ...{ status: isAudit ? 1 : 0 }
                })
          } else {
            let res = this.$route.params.id
              ? await api.update({ ...this.form, ...{ status: isAudit ? 1 : 0 } })
              : await api.add({ ...this.form, ...{ status: isAudit ? 1 : 0 } })
          }
          this.$message.success('保存成功')
          this.$router.go(-1)
        }
      })
    },
    chooseType() {
      this.form = {
        ...this.form,
        ...{
          qualityTargetDecomposeId: null,
          engineeringNumber: null,
          engineeringName: null,
          length: 0
        }
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    showCheckStandard() {
      this.checkVisible = true
    },
    showTargetDialog(type) {
      this.targetType = type
      this.targetVisible = true
    },
    getTarget(o) {
      this.form = {
        ...this.form,
        ...{
          qualityTargetDecomposeId: o.id,
          engineeringNumber: o.number,
          engineeringName: o.name,
          length: o.length
        }
      }
    },
    choose(row) {
      this.form.acceptanceSpecificationId = row.id
      this.form.acceptanceSpecificationName = row.specificationName
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
