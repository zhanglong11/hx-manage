<template>
  <div class="is-footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
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
          <!--          <li>-->
          <!--            &lt;!&ndash;            无数据&ndash;&gt;-->
          <!--            <span class="label">所属分项</span>-->
          <!--            <span class="val">{{ orderInfo.type }}</span>-->
          <!--          </li>-->
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
            <span class="label">验收结论</span>
            <span class="val">{{ orderInfo.acceptanceConclusion }}</span>
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
            <span class="val">{{ tableData.length }}</span>
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
            <span class="val">{{ tableData.length }}</span>
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
      <div class="status-box">
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{ _.get(_.find(paramList.checkApplyStatus, { value: orderInfo.status }), 'label') }}</span>
        </p>
      </div>
    </div>
    <section v-if="orderInfo.acceptanceType !== 2">
      <el-card>
        <div slot="header" class="card-header">
          <span>{{ _.get(_.find(paramList.checkTypeList, { value: orderInfo.acceptanceType }), 'label') }}</span>
        </div>
        <VXTable ref="table" :columns="getColumns()" :tableData="tableData" :pageShow="false" />
      </el-card>
    </section>
    <!-- 审批组件 start -->
    <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
    <!-- 审批组件 end -->
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
      <el-button v-if="isCheck" type="primary" @click="approval()">确定</el-button>
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
      acceptanceName: '',
      rules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      },
      requestFlag: false,
      // 表格表头
      tableColumn: [
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
        }
      ],
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
            default: ({ row }) => [<span>{row.sampleNum}</span>]
          }
        },
        {
          field: 'examineRecord',
          title: '检查记录',
          slots: {
            default: ({ row }) => [<span>{row.examineRecord}</span>]
          }
        },
        {
          field: 'examineResult',
          title: '检查结果',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.qualityCheckResult, { value: row.examineResult }), 'label')}</span>
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
          field: 'materialCopies',
          title: '合格数量',
          slots: {
            default: ({ row }) => [<span>{row.materialCopies}</span>]
          }
        },
        {
          field: 'acceptanceConclusion',
          title: '验收结论',
          slots: {
            default: ({ row }) => [<span>{row.acceptanceConclusion}</span>]
          }
        },
        {
          field: 'remark',
          title: '备注',
          slots: {
            default: ({ row }) => [<span>{row.remark}</span>]
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
              <span>{_.get(_.find(paramList.qualityCheckResult, { value: row.examineResult }), 'label')}</span>
            ]
          }
        },
        {
          field: 'name',
          title: '备注',
          slots: {
            default: ({ row }) => [<span>{row.remark}</span>]
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
            default: ({ row }) => [<span>{row.acceptanceNum}</span>]
          }
        },
        {
          field: 'name',
          title: '检查结果',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.qualityCheckResult, { value: row.examineResult }), 'label')}</span>
            ]
          }
        },
        {
          field: 'remark',
          title: '备注',
          slots: {
            default: ({ row }) => [<span>{this.remark}</span>]
          }
        }
      ],
      tableData: [],
      id: this.$route.query.id || this.$route.params.id || '',
      isCheck: this.$route.params.isCheck
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.id)
      this.orderInfo = res.data
      let type = res.data.acceptanceType
      this.getAcceptName(res.data.acceptanceSpecificationId)
      this.tableData = type === 1 || type === 5 ? res.data.detailList : res.data.targetList
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.form.auditStatus ? await api.logReject(this.id) : await api.logPass(this.id)
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
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
    async getAcceptName(id) {
      if (id) {
        const res = await api.acceptList({})
        this.acceptanceName = res.data.records.length ? res.data.records.find(r => r.id === id).specificationName : ''
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped></style>
