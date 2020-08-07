<template>
  <div class="is-Footer white">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.acceptanceName }} {{ orderInfo.acceptanceApplyNumber }}</span>
        </h6>
        <div class="infoWrapper">
          <el-row v-if="orderInfo.acceptanceType === 1">
            <el-col :span="12">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收类型</div>
                    <div class="lrCellValue">检验批验收</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收人</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceManName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收日期</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">检验批编号</div>
                    <div class="lrCellValue">{{ orderInfo.inspectionLotNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">检验批名称</div>
                    <div class="lrCellValue">{{ orderInfo.inspectionLotName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">检验批部位</div>
                    <div class="lrCellValue">{{ orderInfo.inspectionLotPoint }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">检验批容量</div>
                    <div class="lrCellValue">{{ orderInfo.inspectionLotCapacity }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">施工依据</div>
                    <div class="lrCellValue">{{ orderInfo.constructionBases }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收依据</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceName }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">附件</div>
                    <div class="lrCellValue"><FileList :ids="orderInfo.fileIds" /></div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">备注</div>
                    <div class="lrCellValue">{{ orderInfo.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="orderInfo.acceptanceType === 2">
            <el-col :span="12">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收类型</div>
                    <div class="lrCellValue">隐蔽工程验收</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收人</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceManName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收日期</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">隐蔽项目</div>
                    <div class="lrCellValue">{{ orderInfo.hideProject }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">隐蔽部位</div>
                    <div class="lrCellValue">{{ orderInfo.hidePart }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">隐蔽内容</div>
                    <div class="lrCellValue">{{ orderInfo.hideContent }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收结论</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceConclusion }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">说明</div>
                    <div class="lrCellValue">{{ orderInfo.itemExplain }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">附件</div>
                    <div class="lrCellValue"><FileList :ids="orderInfo.fileIds" /></div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">备注</div>
                    <div class="lrCellValue">{{ orderInfo.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="orderInfo.acceptanceType === 3">
            <el-col :span="12">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收类型</div>
                    <div class="lrCellValue">单位工程</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收人</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceManName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收日期</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">单位编号</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">单位名称</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">开工日期</div>
                    <div class="lrCellValue">{{ orderInfo.startWorkDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">完工日期</div>
                    <div class="lrCellValue">{{ orderInfo.finishWorkDate }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">附件</div>
                    <div class="lrCellValue"><FileList :ids="orderInfo.fileIds" /></div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">备注</div>
                    <div class="lrCellValue">{{ orderInfo.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="orderInfo.acceptanceType === 4">
            <el-col :span="12">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收类型</div>
                    <div class="lrCellValue">分部工程</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收人</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceManName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收日期</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">分部编号</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">分部名称</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">分项数量</div>
                    <div class="lrCellValue">{{ tableData.length }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">附件</div>
                    <div class="lrCellValue"><FileList :ids="orderInfo.fileIds" /></div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">备注</div>
                    <div class="lrCellValue">{{ orderInfo.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="orderInfo.acceptanceType === 5">
            <el-col :span="12">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收类型</div>
                    <div class="lrCellValue">分项工程</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收人</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceManName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">验收日期</div>
                    <div class="lrCellValue">{{ orderInfo.acceptanceDate }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">分项编号</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringNumber }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">分项名称</div>
                    <div class="lrCellValue">{{ orderInfo.engineeringName }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">检验批数量</div>
                    <div class="lrCellValue">{{ tableData.length }}</div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">说明</div>
                    <div class="lrCellValue">{{ orderInfo.itemExplain }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">附件</div>
                    <div class="lrCellValue"><FileList :ids="orderInfo.fileIds" /></div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="rowLine">
                <el-col>
                  <div class="lrCellInfo">
                    <div class="lrCellLabel">备注</div>
                    <div class="lrCellValue">{{ orderInfo.remark }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="status-box" style="width: 140px;">
        <p class="status">状态</p>
        <p class="status-info">
          <span class="val">{{ $getLabel(acceptanceApplyStatusList, orderInfo.status) }}</span>
        </p>
      </div>
    </div>
    <section v-if="orderInfo.acceptanceType !== 2">
      <el-card>
        <div slot="header" class="card-header">
          <span>{{ $getLabel(acceptanceTypeList, orderInfo.acceptanceType) }} </span>
        </div>
        <VXTable ref="table" :columns="getColumns()" :tableData="tableData" :pageShow="false" />
      </el-card>
    </section>
    <!-- 审批组件 start -->
    <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
    <!-- 审批组件 end -->
    <div class="footer-btn">
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button v-if="isCheck" type="primary" @click="approval()">确定</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../../api/index'
import acceptanceApplyStatusList from '../../lib/acceptanceApplyStatusList'
import acceptanceTypeList from '../../lib/acceptanceTypeList'
import projectCategory from '../../lib/projectCategory'
import checkResult from '../../lib/checkResult'
export default {
  name: 'Detail',
  data() {
    return {
      acceptanceApplyStatusList,
      acceptanceTypeList,
      projectCategory, //项目种类
      checkResult,
      orderInfo: {},
      tableList: [],
      acceptanceName: '',
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
            default: ({ row }) => [<span>{this.$getLabel(this.projectCategory, row.itemCategory)}</span>]
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
            default: ({ row }) => [<span>{this.$getLabel(this.projectCategory, row.itemCategory)}</span>]
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
            default: ({ row }) => [<span>{this.$getLabel(this.checkResult, row.examineResult)}</span>]
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
            default: ({ row }) => [<span>{this.$getLabel(this.checkResult, row.examineResult)}</span>]
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
            default: ({ row }) => [<span>{this.$getLabel(this.checkResult, row.examineResult)}</span>]
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
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck
    }
  },
  computed: {
    isAudit() {
      return this.$route.meta.isAudit
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await Api.acceptanceApply.detail(this.$route.params.id)
      this.orderInfo = res.data
      this.getAcceptName(res.data.acceptanceSpecificationId)
      let type = res.data.acceptanceType
      if (type === 1) {
        this.tableData = res.data.detailList ? res.data.detailList : []
      } else {
        this.tableData = res.data.targetList ? res.data.targetList : []
      }
      // this.tableData = type === 1 || type === 5 ? res.data.detailList : res.data.targetList
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
        const res = await Api.acceptanceApply.acceptList({})
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
<style lang="less" scoped>
@import '../../style.less';
</style>
