<template>
  <div class="container no-padding is-footer">
    <!-- 流程图 start -->
    <ViewFlow v-if="id" :id="id" />
    <!-- 流程图 end -->
    <el-card v-if="type === 'view'" class="detail">
      <div slot="header" style="display: flex; align-items: center; justify-content: space-between;">
        <span>{{ form.supplyPlanName }}</span>
        <div class="status-wrap">
          <h6>审核状态：</h6>
          <p>{{ $getLabel(auditStatusList, form.auditStatus) }}</p>
          <el-button
            v-if="form.auditStatus === 0 && $hasPower('MaterialPlanListEdit')"
            type="primary"
            size="mini"
            @click="$router.push({ path: `/material/planList/${id}` })"
          >
            编辑
          </el-button>
          <el-button
            v-if="form.isRevocation && $hasPower('MaterialPlanListEdit') && isMe"
            type="primary"
            size="mini"
            @click="revoke"
            >撤回</el-button
          >
          <el-button
            v-if="!form.isRevocation && form.auditStatus === 1 && $hasPower('MaterialPlanListEdit') && isMe"
            type="primary"
            size="mini"
            @click="invalid"
            >作废</el-button
          >
        </div>
      </div>
      <ul>
        <li>
          <span>甲供材计划编号</span><span>{{ form.supplyPlanCode }}</span>
        </li>
        <li>
          <span>甲供材计划名称</span><span>{{ form.supplyPlanName }}</span>
        </li>
        <li>
          <span>合同编号</span><span>{{ form.contractCode }}</span>
        </li>
        <li>
          <span>合同名称</span><span>{{ form.contractName }}</span>
        </li>
        <li>
          <span>项目经理</span><span>{{ form.projectManagerName }}</span>
        </li>
        <li>
          <span>收货人</span><span>{{ form.consigneeName }}</span>
        </li>
        <li>
          <span>联系电话</span><span>{{ form.consigneeMobile }}</span>
        </li>
        <li>
          <span>填报时间</span><span>{{ form.createTime | ymd }}</span>
        </li>
      </ul>
    </el-card>
    <el-card v-else :header="$route.meta.title">
      <el-form ref="form" label-width="140px" :model="form" :rules="rules">
        <el-form-item label="甲供材计划编号" prop="supplyPlanCode">
          <el-input v-model="form.supplyPlanCode" placeholder="编号自动生成" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目经理" prop="projectManagerId">
          <SelectUser
            :id.sync="form.projectManagerId"
            :value="form.projectManagerId"
            :name.sync="form.projectManagerName"
            valueFormat="id"
            :roles="['项目经理']"
            :multiple="false"
            keyWords="项目经理"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="甲供材计划名称" prop="supplyPlanName">
          <el-input v-model="form.supplyPlanName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="收货人" prop="consigneeId">
          <SelectUser
            :id.sync="form.consigneeId"
            :roles="['收货人']"
            :value="form.consigneeId"
            :name.sync="form.consigneeName"
            :mobile.sync="form.consigneeMobile"
            valueFormat="id"
            :multiple="false"
            keyWords="收货人"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractCode">
          <span v-if="form.contractCode" style="margin-right: 15px;">{{ form.contractCode }}</span>
          <el-button type="text" @click="contractDialogVisible = true">选择合同</el-button>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.consigneeMobile" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span>材料计划详情</span>
          <SelectContractInventory :contractId="form.contractId" @change="add">
            <el-button
              v-if="['edit', 'add'].includes(type)"
              :title="form.contractId ? '' : '先选择合同'"
              :disabled="!form.contractId"
              type="primary"
              style="margin-left: 15px;"
            >
              选择合同清单
            </el-button>
          </SelectContractInventory>
        </div>
        <div v-if="type === 'view'">
          <!-- <el-dropdown>
            <el-button>打印</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="print(1)">原始表单</el-dropdown-item>
              <el-dropdown-item @click.native="print(2)">审核流程</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
          <el-dropdown style="margin-left: 10px;">
            <el-button>下载</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="download(1)">原始表单</el-dropdown-item>
              <el-dropdown-item @click.native="download(2)">审核流程</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <vxe-table
        ref="table"
        :data="form.detailList"
        :edit-config="type === 'view' ? null : { trigger: 'manual', mode: 'row', showIcon: false }"
        keep-source
        :edit-rules="tableRules"
        row-id="_id"
      >
        <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
        <vxe-table-column field="itemName" title="名称"></vxe-table-column>
        <vxe-table-column field="model" title="型号"></vxe-table-column>
        <vxe-table-column field="specifications" title="规格"></vxe-table-column>
        <vxe-table-column field="quantity" title="合同数量" width="80px"></vxe-table-column>
        <vxe-table-column
          field="contractCode"
          title="合同剩余量"
          width="100px"
          :formatter="({ row }) => row.quantity - row.totalSupplyNum"
        ></vxe-table-column>
        <vxe-table-column field="supplyNum" title="本计划供应量" :edit-render="{ autofocus: '.vxe-input--inner' }">
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.supplyNum" type="number" :max="calculateSupplyNumMax(row)"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="usedPart"
          title="使用部位"
          :edit-render="{ name: 'input', attrs: { type: 'text' } }"
        ></vxe-table-column>
        <vxe-table-column field="totalSupplyNum" title="累计实际已供应量"></vxe-table-column>
        <vxe-table-column
          field="planArrivalTime"
          title="计划到场时间"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :edit-render="{ name: '$input', props: { type: 'datetime' } }"
        ></vxe-table-column>
        <vxe-table-column
          field="remark"
          title="备注"
          :edit-render="{ name: 'input', attrs: { type: 'text' } }"
        ></vxe-table-column>
        <vxe-table-column v-if="type !== 'view'" title="操作">
          <template v-slot="{ row, $rowIndex }">
            <template v-if="$refs.table.isActiveByRow(row)">
              <el-button type="text" @click="$refs.table.clearActived()">保存</el-button>
              <el-button
                type="text"
                @click="
                  $refs.table.clearActived().then(() => {
                    $refs.table.revertData(row)
                  })
                "
                >取消</el-button
              >
            </template>
            <template v-else>
              <el-button type="text" @click="$refs.table.setActiveRow(row)">编辑</el-button>
              <el-button type="text" @click="form.detailList.splice($rowIndex, 1)">删除</el-button>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <el-card v-if="form.auditStatus" class="timeline-wrap" header="审核流程">
      <div class="timeline">
        <TimelineItem status="1">
          <h4>填报单位</h4>
          <p>
            <span class="label">项目经理</span>
            <span class="content">{{ form.projectManagerName }}</span>
          </p>
          <p>
            <span class="label">收货人</span><span class="content">{{ form.consigneeName }}</span>
          </p>
          <p>
            <span class="label">填报时间</span>
            <span class="content">{{ _.get(workflowList, '0.endTime') | ymd }}</span>
          </p>
          <p>
            <span class="label">联系电话</span><span class="content">{{ form.consigneeMobile }}</span>
          </p>
        </TimelineItem>

        <TimelineItem :status="_.get(workflowList, '0.taskVariables.flag')">
          <h4>监理单位审核</h4>
          <p>
            <span class="label">监理工程师</span>
            <span class="content">{{ _.get(workflowList, '0.taskVariables.taskDelegateName') }}</span>
          </p>
          <p>
            <span class="label">审核结果</span>
            <span class="content">{{ _.get(workflowList, '0.taskVariables.flag') | auditText }}</span>
          </p>
          <p>
            <span class="label">审核意见</span>
            <span class="content">{{ _.get(workflowList, '0.taskVariables.remark') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '0.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
        <TimelineItem :status="_.get(workflowList, '1.taskVariables.flag')">
          <h4>监理单位审核</h4>
          <p>
            <span class="label">总监理工程师</span>
            <span class="content">{{ _.get(workflowList, '1.taskVariables.taskDelegateName') }}</span>
          </p>
          <p>
            <span class="label">审核结果</span>
            <span class="content">{{ _.get(workflowList, '1.taskVariables.flag') | auditText }}</span>
          </p>
          <p>
            <span class="label">审核意见</span>
            <span class="content">{{ _.get(workflowList, '1.taskVariables.remark') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '1.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
        <TimelineItem :status="_.get(workflowList, '2.taskVariables.flag')">
          <h4>建设单位审核</h4>
          <p>
            <span class="label">专业工程师</span>
            <span class="content">{{ _.get(workflowList, '2.taskVariables.taskDelegateName') }}</span>
          </p>
          <p>
            <span class="label">审核结果</span>
            <span class="content">{{ _.get(workflowList, '2.taskVariables.flag') | auditText }}</span>
          </p>
          <p>
            <span class="label">审核意见</span>
            <span class="content">{{ _.get(workflowList, '2.taskVariables.remark') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '2.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
        <TimelineItem :status="_.get(workflowList, '3.taskVariables.flag')">
          <h4>建设单位审核</h4>
          <p>
            <span class="label">项目经理</span>
            <span class="content">{{ _.get(workflowList, '3.taskVariables.taskDelegateName') }}</span>
          </p>
          <p>
            <span class="label">审核结果</span>
            <span class="content">{{ _.get(workflowList, '3.taskVariables.flag') | auditText }}</span>
          </p>
          <p>
            <span class="label">审核意见</span>
            <span class="content">{{ _.get(workflowList, '3.taskVariables.remark') }}</span>
          </p>
          <p>
            <span class="label">审核时间</span>
            <span class="content">{{ _.get(workflowList, '3.endTime') | ymd }}</span>
          </p>
        </TimelineItem>
      </div>
    </el-card>
    <!-- 通用审批 start -->
    <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
    <!-- 通用审批 end -->
    <footer v-if="isCheck" class="footer-btn">
      <el-button size="medium" @click="$router.back()">返回</el-button>
      <el-button size="medium" type="primary" @click="approval()">审批</el-button>
    </footer>
    <footer v-else class="footer-btn">
      <el-button v-if="type === 'view'" size="medium" @click="$router.back()">返回</el-button>
      <el-button v-else size="medium" @click="$router.back()">取消</el-button>
      <el-button v-if="type !== 'view'" size="medium" type="primary" @click="save">保存</el-button>
      <el-button v-if="type !== 'view'" size="medium" type="primary" @click="submit">保存并提交</el-button>
    </footer>
    <ContractDialog
      v-if="contractDialogVisible"
      showRadio
      :checkRowKey="form.contractId"
      :visible.sync="contractDialogVisible"
      @submit="contractChange"
    ></ContractDialog>
  </div>
</template>

<script>
import ContractDialog from '@/views/contract-merchants/contractManage/ContractDialog'
import SelectContractInventory from './components/SelectContractInventory'
import auditStatusList from '@/views/material/planList/lib/auditStatus'
import TimelineItem from '../components/TimelineItem'
import { saveAs } from 'file-saver'
import { toJpeg } from 'dom-to-image'
export default {
  name: 'MaterialPlanListDetail',
  components: { ContractDialog, SelectContractInventory, TimelineItem },
  filters: {
    auditText(val) {
      return ['通过', '驳回'][val - 1]
    }
  },
  data() {
    return {
      auditStatusList,
      form: {
        projectId: this.$store.state.project.projectId,
        supplyPlanName: '',
        contractCode: null,
        contractId: '',
        detailList: []
      },
      contractDialogVisible: false,
      rules: {
        supplyPlanName: [
          { required: true, message: '必填' },
          { max: 200, message: '最大长度200' }
        ],
        contractCode: [{ required: true, message: '必填' }],
        projectManagerId: [{ required: true, message: '必填' }],
        consigneeId: [{ required: true, message: '必填' }]
      },
      tableRules: {
        supplyNum: [
          { required: true, message: '必填' },
          {
            validator({ cellValue }) {
              if (cellValue <= 0) {
                return Promise.reject(new Error('必须大于0'))
              }
            }
          }
        ],
        usedPart: [{ required: true, message: '必填' }],
        planArrivalTime: [{ required: true, message: '必填' }]
      },
      workflowList: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    type() {
      return this.$route.meta.type
    },
    isCheck() {
      return this.$route.params.isCheck
    },
    isMe() {
      return this.$store.state.user.id === this.form.creator
    }
  },
  watch: {
    'form.contractId'(val, oldVal) {
      if (oldVal) this.form.detailList = []
    }
  },
  async created() {
    if (this.id) {
      this.form = await this.axios.construction.get('materialSupplyPlan/get/' + this.id).then(res => {
        res.data.detailList = res.data.detailList || []
        return res.data
      })
      this.getWorkflowTasks()
    }
  },
  mounted() {},
  methods: {
    async save() {
      await this.$refs.form.validate()
      await this.$refs.table.validate()
      await this.axios.construction.post(this.id ? 'materialSupplyPlan/update' : 'materialSupplyPlan/add', this.form)
      this.$message.success(this.id ? '修改成功' : '创建成功')
      this.$router.back()
    },
    getWorkflowTasks() {
      this.axios.workflow.get('task/list/' + this.id).then(res => {
        for (let i = 0; i < 5; i++) {
          // 设置驳回
          if (['2', '3'].includes(_.get(res.data[i], 'taskVariables.flag'))) {
            res.data[i + 1] = { taskVariables: { flag: '3' } }
          }
        }
        this.workflowList = res.data
      })
    },
    async submit() {
      await this.$refs.form.validate()
      await this.$refs.table.validate()
      await this.axios.construction.post('materialSupplyPlan/saveAndSubmitAudit', this.form)
      this.$message.success('提交成功')
      this.$router.back()
    },
    contractChange(row) {
      this.form.contractId = row.id
      this.form.contractName = row.name
      this.form.contractCode = row.code
    },
    calculateSupplyNumMax(row) {
      return (
        row.quantity -
        row.totalSupplyNum -
        _.sumBy(
          this.form.detailList.filter(e => e.materialId === row.materialId && e._id !== row._id),
          'supplyNum'
        )
      )
    },
    add(rows) {
      this.form.detailList.push(
        ...rows.map(e => ({
          itemName: e.itemName,
          contractId: this.form.contractId,
          materialId: e.id,
          model: e.model,
          specifications: e.specifications,
          quantity: e.quantity,
          totalSupplyNum: e.totalSupplyNum,
          supplyNum: 0,
          planArrivalTime: null
        }))
      )
    },
    //撤回
    async revoke() {
      await this.$confirm('确定撤回该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.axios.construction.get(`/materialSupplyPlan/${this.id}/revocation`)
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    //作废
    async invalid() {
      await this.$confirm('确定作废该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.axios.construction.get(`/materialSupplyPlan/${this.id}/cancellation`)
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    },
    print(type) {
      if (type === 1) {
        this.axios.construction
          .post(`materialSupplyPlan/print`, { type, id: this.id })
          .then(res => this.axios.get(res.data, { responseType: 'blob' }))
          .then(res => {
            const data = URL.createObjectURL(res.data)
            const iframe = document.createElement('iframe')
            iframe.src = data
            iframe.display = 'none'
            document.getElementById('iframe').appendChild(iframe)
            iframe.contentWindow.print()
          })
      } else if (type === 2) {
        toJpeg(document.getElementsByClassName('timeline')[0], { quality: 0.95 }).then(src => {
          const img = new Image()
          img.src = src
          document.getElementsByTagName('body')[0].appendChild(img)
        })
      }
    },
    download(type) {
      if (type === 1) {
        this.axios.construction
          .post(`materialSupplyPlan/download`, { type, id: this.id }, { responseType: 'blob' })
          .then(res => {
            saveAs(res.data, this.form.supplyPlanName + '-原始表单.doc')
          })
      } else if (type === 2) {
        toJpeg(document.getElementsByClassName('timeline')[0], { quality: 0.95 }).then(src => {
          this.axios.construction
            .post(
              `materialSupplyPlan/download`,
              { type, id: this.id, base64: src.replace('data:image/jpeg;base64,', '') },
              { responseType: 'blob' }
            )
            .then(res => {
              saveAs(res.data, this.form.supplyPlanName + '-材料确认单.doc')
            })
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.el-card {
  overflow: visible;
}
.detail {
  color: #333;
  padding: 0 5px;
  ul {
    li {
      display: flex;
      align-items: center;
      line-height: 30px;
    }
    span {
      &:first-child {
        color: #888;
        width: 130px;
        &::after {
          content: '：';
        }
      }
    }
  }
  .status-wrap {
    display: flex;
    align-items: center;
    h6 {
      color: #666;
    }
    p {
      font-weight: bold;
    }
    p + .el-button {
      margin-left: 20px;
    }
  }
}
.el-form {
  max-width: 1000px;
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    &:nth-child(odd) {
      width: 65%;
    }
    &:nth-child(even) {
      width: 35%;
    }
  }
}
.el-card {
  margin-bottom: 15px;
}
.timeline-wrap {
  /deep/ .el-card__body {
    display: flex;
    justify-content: center;
  }
  .timeline {
    background-color: #fff;
    padding: 50px;
  }
}
</style>
