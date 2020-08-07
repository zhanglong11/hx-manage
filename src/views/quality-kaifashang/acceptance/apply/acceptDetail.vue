<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.acceptanceName }} {{ orderInfo.acceptanceApplyNumber }}</span>
        </h6>
        <!--        检验批验收-->
        <ul v-if="orderInfo.acceptanceType === 1">
          <li>
            <span class="label">验收类型</span>
            <span class="val">{{
              _.get(_.find(paramList.checkTypeList, { value: orderInfo.acceptanceType }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">验收人</span>
            <span class="val">{{ orderInfo.acceptanceManName }}</span>
          </li>
          <li>
            <span class="label">验收日期</span>
            <span class="val">{{ orderInfo.acceptanceDate }}</span>
          </li>
          <li>
            <span class="label">检验批编号</span>
            <span class="val">{{ orderInfo.inspectionLotNumber }}</span>
          </li>
          <li>
            <span class="label">检验批名称</span>
            <span class="val">{{ orderInfo.inspectionLotName }}</span>
          </li>
          <li>
            <!--            无数据-->
            <span class="label">所属分项</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">检验批部位</span>
            <span class="val">{{ orderInfo.inspectionLotPoint }}</span>
          </li>
          <li>
            <span class="label">检验批容量</span>
            <span class="val">{{ orderInfo.inspectionLotCapacity }}</span>
          </li>
          <li>
            <span class="label">施工依据</span>
            <span class="val">{{ orderInfo.constructionBases }}</span>
          </li>
          <li>
            <span class="label">验收依据</span>
            <span class="val">{{ acceptanceName }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
        <!--        隐蔽工程验收-->
        <ul v-if="orderInfo.acceptanceType === 2">
          <li>
            <span class="label">验收类型</span>
            <span class="val">{{
              _.get(_.find(paramList.checkTypeList, { value: orderInfo.acceptanceType }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">验收人</span>
            <span class="val">{{ orderInfo.acceptanceManName }}</span>
          </li>
          <li>
            <span class="label">验收日期</span>
            <span class="val">{{ orderInfo.acceptanceDate }}</span>
          </li>
          <li>
            <span class="label">隐蔽项目</span>
            <span class="val">{{ orderInfo.hideProject }}</span>
          </li>
          <li>
            <span class="label">隐蔽部位</span>
            <span class="val">{{ orderInfo.hidePart }}</span>
          </li>
          <li>
            <span class="label">隐蔽内容</span>
            <span class="val">{{ orderInfo.hideContent }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
        <el-form
          v-if="orderInfo.acceptanceType === 2"
          ref="form"
          :model="form"
          :rules="rules"
          class="form"
          style="width: 400px;"
          label-width="120px"
        >
          <el-form-item label="验收结论" prop="hideResult">
            <SelectList v-model="form.hideResult" :has-all-option="false" type="qualityCheckResult" />
          </el-form-item>
          <el-form-item label="验收说明" prop="hideExplain">
            <el-input v-model="form.hideExplain" type="textarea" />
          </el-form-item>
        </el-form>
        <!--        单位工程-->
        <ul v-if="orderInfo.acceptanceType === 3">
          <li>
            <span class="label">验收类型</span>
            <span class="val">{{
              _.get(_.find(paramList.checkTypeList, { value: orderInfo.acceptanceType }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">验收人</span>
            <span class="val">{{ orderInfo.acceptanceManName }}</span>
          </li>
          <li>
            <span class="label">验收日期</span>
            <span class="val">{{ orderInfo.acceptanceDate }}</span>
          </li>
          <li>
            <span class="label">单位编号</span>
            <span class="val">{{ orderInfo.engineeringNumber }}</span>
          </li>
          <li>
            <span class="label">单位名称</span>
            <span class="val">{{ orderInfo.engineeringName }}</span>
          </li>
          <li>
            <span class="label">开工日期</span>
            <span class="val">{{ orderInfo.startWorkDate }}</span>
          </li>
          <li>
            <span class="label">完工日期</span>
            <span class="val">{{ orderInfo.finishWorkDate }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
        <!--        分部工程-->
        <ul v-if="orderInfo.acceptanceType === 4">
          <li>
            <span class="label">验收类型</span>
            <span class="val">{{
              _.get(_.find(paramList.checkTypeList, { value: orderInfo.acceptanceType }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">验收人</span>
            <span class="val">{{ orderInfo.acceptanceManName }}</span>
          </li>
          <li>
            <span class="label">验收日期</span>
            <span class="val">{{ orderInfo.acceptanceDate }}</span>
          </li>
          <li>
            <span class="label">分部编号</span>
            <span class="val">{{ orderInfo.engineeringNumber }}</span>
          </li>
          <li>
            <span class="label">分部名称</span>
            <span class="val">{{ orderInfo.engineeringName }}</span>
          </li>
          <li>
            <span class="label">分项数量</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
        <!--        分项工程-->
        <ul v-if="orderInfo.acceptanceType === 5">
          <li>
            <span class="label">验收类型</span>
            <span class="val">{{
              _.get(_.find(paramList.checkTypeList, { value: orderInfo.acceptanceType }), 'label')
            }}</span>
          </li>
          <li>
            <span class="label">验收人</span>
            <span class="val">{{ orderInfo.acceptanceManName }}</span>
          </li>
          <li>
            <span class="label">验收日期</span>
            <span class="val">{{ orderInfo.acceptanceDate }}</span>
          </li>
          <li>
            <span class="label">分项编号</span>
            <span class="val">{{ orderInfo.engineeringNumber }}</span>
          </li>
          <li>
            <span class="label">分项名称</span>
            <span class="val">{{ orderInfo.engineeringName }}</span>
          </li>
          <li>
            <span class="label">检验批数量</span>
            <span class="val">{{ orderInfo.targetList ? orderInfo.targetList.length : 0 }}</span>
          </li>
          <li>
            <span class="label">说明</span>
            <span class="val">{{ orderInfo.itemExplain }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <section v-if="orderInfo.acceptanceType !== 2">
      <el-card>
        <div slot="header" class="card-header">
          <span>{{ _.get(_.find(paramList.checkTypeList, { value: orderInfo.acceptanceType }), 'label') }}</span>
        </div>
        <EditTable
          v-model="tableData"
          :tableColumn="getColumns()"
          :validRules="validRules"
          :is-remove="false"
          :is-add="false"
        />
      </el-card>
    </section>

    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(null)">保存</el-button>
      <el-button type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import paramList from '@/lib/paramList'
import api from '@/api/quality/acceptance/apply'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      tableList: [],
      paramList,
      form: {},
      rules: {},
      acceptanceName: '',
      detailCount: 0,
      requestFlag: false,
      /*
       * @任务编号:2686||质量申请-验收记录功能完善
       * @开发人员:张龙
       * @日期:2020-03-25
       * @任务类型: 全新代码
       */
      checkColumns: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'acceptanceItem',
          title: '验收项目'
        },
        {
          field: 'itemCategory',
          title: '项目种类',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.checkApplyProjectType, { value: row.itemCategory }), 'label')}</span>
            ]
          }
        },
        {
          field: 'designRequirements',
          title: '设计要求及规范规范'
        },
        {
          field: 'sampleNum',
          title: '实际抽样数量',
          slots: {
            default: ({ row }) => [<InputNumber v-model={row.sampleNum} />]
          }
        },
        {
          field: 'examineRecord',
          title: '检查记录',
          slots: {
            default: ({ row }) => [<el-input v-model={row.examineRecord} />]
          }
        },
        {
          field: 'examineResult',
          title: '检查结果',
          slots: {
            default: ({ row }) => [
              <SelectList v-model={row.examineResult} hasAllOption={false} type="qualityCheckResult" />
            ]
          }
        }
      ],
      unitColumns: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkName',
          title: '项目'
        },
        {
          field: 'name',
          title: '数量'
        },
        {
          field: 'name',
          title: '合格数量',
          slots: {
            default: ({ row }) => [<InputNumber v-model={row.materialCopies} />]
          }
        },
        {
          field: 'name',
          title: '验收结论',
          slots: {
            default: ({ row }) => [<el-input v-model={row.remark} />]
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
      itemColumns: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'inspectionLotName',
          title: '检验批名称'
        },
        {
          field: 'inspectionLotCapacity',
          title: '检验批容量'
        },
        {
          field: 'inspectionLotPoint',
          title: '检验批部位'
        },
        {
          field: 'name',
          title: '检查结果',
          slots: {
            default: ({ row }) => [
              <SelectList v-model={row.examineResult} hasAllOption={false} type="qualityCheckResult" />
            ]
          }
        },
        {
          field: 'name',
          title: '备注',
          slots: {
            default: ({ row }) => [<el-input v-model={row.materialCopies} />]
          }
        }
      ],
      partColumns: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'engineeringName',
          title: '分项名称'
        },
        {
          field: 'name',
          title: '检验批数量',
          slots: {
            default: ({ row }) => [<span>{this.detailCount}</span>]
          }
        },
        {
          field: 'name',
          title: '检查结果',
          slots: {
            default: ({ row }) => [
              <SelectList v-model={row.examineResult} hasAllOption={false} type="qualityCheckResult" />
            ]
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
      tableData: [],
      validRules: {
        name: [{ required: true, message: '必填' }],
        remark: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id)
      // this.tableData = this.getCurResolve(res.data.qualityTargetDecomposeId)
      this.orderInfo = res.data
      this.getAcceptName(res.data.acceptanceSpecificationId)
      let type = res.data.acceptanceType
      if (type === 2) {
        this.form = {
          hideResult: res.data.hideResult,
          hideExplain: res.data.hideExplain
        }
      }
      if (type === 1) {
        this.tableData = res.data.detailList ? res.data.detailList : []
      } else {
        this.tableData = res.data.targetList ? res.data.targetList : []
      }
      // this.tableData = type === 1 || type === 5 ? res.data.detailList : res.data.targetList
    },
    toEdit(id) {
      this.$router.push({ path: 'qualityApplyEdit', query: { id } })
    },
    getColumns() {
      switch (true) {
        case this.orderInfo.acceptanceType === 1:
          return this.checkColumns
        case this.orderInfo.acceptanceType === 3:
          return this.unitColumns
        case this.orderInfo.acceptanceType === 5:
          return this.itemColumns
        case this.orderInfo.acceptanceType === 4:
          return this.partColumns
        default:
          return []
      }
    },
    async submit(isAudit) {
      if (this.orderInfo.acceptanceType === 2) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const res = await api.logSave({
              ...this.form,
              ...{ status: isAudit ? 1 : 0 },
              ...{ id: this.$route.params.id }
            })
          }
        })
      } else if (this.orderInfo.acceptanceType === 4) {
        const res = await api.logSave({
          ...{ targetList: this.tableData },
          ...{ status: isAudit ? 1 : 0 },
          ...{ id: this.$route.params.id }
        })
      } else if (this.orderInfo.acceptanceType === 1) {
        const res = await api.logSave({
          ...{ detailList: this.tableData },
          ...{ status: isAudit ? 1 : 0 },
          ...{ id: this.$route.params.id }
        })
      } else if (this.orderInfo.acceptanceType === 5) {
        const res = await api.logSave({
          ...{ targetOneList: this.tableData },
          ...{ status: isAudit ? 1 : 0 },
          ...{ id: this.$route.params.id }
        })
      }
      // if (isAudit) {
      //   let audit = await api.logSubmit(this.$route.query.id)
      // }
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    async getAcceptName(id) {
      if (id) {
        const res = await api.acceptList({})
        this.acceptanceName = res.data.records.length ? res.data.records.find(r => r.id === id).specificationName : ''
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
