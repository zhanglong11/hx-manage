<!--
 * @Description: 
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-19 16:13:53
 * @LastEditTime: 2020-03-25 15:07:25
 -->
<template>
  <div>
    <!-- 基本信息 -->
    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <div>{{ form.id ? form.supplierName : '分包商基本信息' }}</div>
        </div>
        <el-form ref="form" label-width="110px" :model="form">
          <el-row>
            <el-col :span="20">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="进场日期">{{ form.enterTime }}</el-form-item>
                </el-col>
                <!-- 
                  任务名称：bug#1312,1297
                  开发人员：申豪强
                  日期：2020-03-25
                  任务类型：测试人员提出的系统性BUG
                -->
                <el-col :span="12">
                  <el-form-item label="创建人">{{ form.creatorName }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="退场负责人">{{ form.principalName }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="退场日期">{{ form.leaveTime }}</el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="创建时间">{{ form.createTime }}</el-form-item>
                </el-col>
                <!--  申豪强 2020-03-19 解决自测小bug -->
                <el-col :span="12">
                  <el-form-item label="合同履约情况" style="word-wrap: break-word;">{{
                    form.contractFulfillmentInfo
                  }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否发生事故">{{ conclusionsFilter(form.accidentOccurFlag) }}</el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="事故内容">{{ form.accidentInfo }}</el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注">{{ form.remark }}</el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="附件">
                    <FileList :ids="form.fileId" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="item-status">
              <p>状态</p>
              <p class="status">{{ stateFilter(form.status) }}</p>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </section>
  </div>
</template>

<script>
import supplierType from '@/lib/supplier/supplierType'
import supplierState from '@/lib/supplier/supplierState'
export default {
  props: {
    form: {
      type: Object
    },
    // 编辑页面name
    editName: {
      type: String
    }
  },
  data() {
    return {
      conclusions: [
        {
          label: '全部',
          value: null
        },
        {
          label: '是',
          value: 0
        },
        {
          label: '否',
          value: 1
        }
      ]
    }
  },
  methods: {
    conclusionsFilter(e) {
      return _.get(
        this.conclusions.find(item => item.value === e),
        'label',
        '-'
      )
    },
    stateFilter(state) {
      return _.get(
        supplierState.find(item => item.value === state),
        'label',
        '-'
      )
    },
    goEdit() {
      this.$router.push({ name: this.editName, query: { id: this.form.id } })
    }
  }
}
</script>

<style lang="less" scoped></style>
