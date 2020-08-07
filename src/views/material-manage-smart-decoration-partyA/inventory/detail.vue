<template>
  <div>
    <el-card class="box-card">
      <el-row class="row">
        <span class="title">材料详情</span>
      </el-row>

      <el-row class="row">
        <el-col :span="8">材料编号: {{ viewData.code }}</el-col>
        <el-col :span="8">材料名称: {{ viewData.name }}</el-col>
        <el-col :span="8">规格型号: {{ viewData.models }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">单位: {{ viewData.unit }}</el-col>
        <el-col :span="8">品牌: {{ viewData.brand }}</el-col>
        <el-col :span="8">供应商: {{ viewData.supplier }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">库存量: {{ viewData.inventoryNumber }}</el-col>
        <el-col :span="8">已使用量: {{ viewData.consumeNumber }}</el-col>
        <el-col :span="8">采购方: {{ viewData.type === '1' ? '甲供' : '自购' }}</el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>材料采购详表</span>
      </div>

      <el-table :data="viewData.materialInfoPurchaseList" style="width: 100%; margin-top: 20px;">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
        <el-table-column prop="materialId" label="采购时间" min-width="100" />
        <el-table-column prop="name" label="采购发起人" min-width="100" />
        <el-table-column prop="models" label="采购数量" min-width="100" />
        <el-table-column prop="unit" label="合格率（%）" min-width="100" />
        <el-table-column prop="brand" label="入库数量" min-width="100" />
        <el-table-column label="材料入库单">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleInDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>材料使用详表</span>
      </div>

      <el-table :data="viewData.materialInfoOutputJiaWebList" style="width: 100%; margin-top: 20px;">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
        <el-table-column prop="createTime" label="提取时间" min-width="100" />
        <el-table-column prop="creatorName" label="提取人" min-width="100" />
        <el-table-column prop="outputNum" label="提取数量" min-width="100" />
        <el-table-column label="材料提取单">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleInDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 批注组件 start -->
    <template v-if="$hasPower('InventoryListSmartDecorationPartyACommentPCDetail')">
      <AddComments
        :id="inventoryId"
        type="Material"
        :canAdd="$hasPower('InventoryListSmartDecorationPartyACommentPCAdd')"
      />
    </template>
    <!-- 批注组件 end -->
    <div class="footerButton">
      <el-button @click="goBack">返回</el-button>
      <!-- <el-button type="primary" @click="onSave">保存</el-button> -->
    </div>
  </div>
</template>
<script>
/*
author: 许雷
date: 2020-06-30
*/
import Api from '../inOutWarehouse/api/index.js'

export default {
  name: 'InWarehouseDetail',
  data() {
    return {
      viewData: {
        materialInfoPurchaseList: [],
        materialInfoOutputJiaWebList: []
      },
      id: '', //当前页面入库单id
      inventoryId: this.$route.query.id || ''
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getInfo()
  },
  methods: {
    getInfo() {
      Api.getMaterialDetail(this.id).then(res => {
        this.viewData = res.data
      })
    },
    handleInDetail(id) {
      this.$router.push({
        name: `InWarehouseDetailSmartDecorationPartyA`,
        query: {
          id: id
        }
      })
    },
    handleOutDetail(id) {
      this.$router.push({
        name: `OutWarehouseDetailSmartDecorationPartyA`,
        query: {
          id: id
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    // onSave() {
    //   //保存成功跳转
    //   this.$router.go(-1)
    // },
    indexMethod(index) {
      return index + 1
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bolder;
}
.row {
  margin-bottom: 20px;
}
</style>
