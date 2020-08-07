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
    <section v-if="orderInfo.acceptanceType === 1">
      <el-card>
        <div slot="header" class="card-header">
          <span>检验批明细</span>
        </div>
        <VXTable ref="table" :columns="tableColumn" :tableData="tableList" :pageShow="false" />
      </el-card>
    </section>
    <section style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>审核</span>
        </div>
        <el-form
          ref="form"
          :model="form"
          :disabled="orderInfo.status !== 1"
          :rules="rules"
          class="form"
          label-width="110px"
        >
          <el-form-item label="审核结果" prop="auditStatus" style="width: 50%;">
            <el-radio-group v-model="form.auditStatus">
              <el-radio :label="0">同意</el-radio>
              <el-radio :label="1">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="remark " style="width: 50%;">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
          <el-form-item label="附件" prop="file" style="width: 50%;">
            <FileUpload v-model="form.file" />
          </el-form-item>
        </el-form>
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/acceptance/apply'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      form: {},
      tableList: [],
      acceptanceName: '',
      paramList,
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
      rules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
      this.getAcceptName(res.data.acceptanceSpecificationId)
      this.tableList = res.data.detailList
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.form.auditStatus
            ? await api.auditReject(this.$route.query.id)
            : await api.auditPass(this.$route.query.id)
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
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
