<template>
  <div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ orderInfo.dangerSource }}</span>
        </h6>
        <ul>
          <li>
            <span class="label">伤害类别</span>
            <span class="val">{{ orderInfo.harmCategoryNames }}</span>
          </li>
          <li>
            <span class="label">防范措施</span>
            <span class="val">{{ orderInfo.precautionaryMeasure }}</span>
          </li>
          <li>
            <span class="label">项目责任领导</span>
            <span class="val">{{ orderInfo.principalLeaderName }}</span>
          </li>
          <li>
            <span class="label">责任人</span>
            <span class="val">{{ orderInfo.principalName }}</span>
          </li>
          <li>
            <span class="label">责任人联系方式</span>
            <span class="val">{{ orderInfo.principalContact }}</span>
          </li>

          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.files" />
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
          <span class="val">{{ _.get(_.find(paramList.safeCommonStatus, { value: orderInfo.status }), 'label') }}</span>
        </p>
      </div>
    </div>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>危险源关键部位</span>
        </div>
        <VXTable ref="table" :columns="partsColumn" :tableData="tableList" :pageShow="false" />
      </el-card>
    </section>
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import api from '@/api/safe/plan/dangerous'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      paramList,
      tableList: [],
      requestFlag: false,
      // 表格表头
      partsColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'placeName',
          title: '关键部位名称'
        },
        {
          field: 'remark',
          title: '备注'
        }
      ]
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id)
      this.orderInfo = res.data
      this.tableList = res.data.dangerSourcePlaces
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
