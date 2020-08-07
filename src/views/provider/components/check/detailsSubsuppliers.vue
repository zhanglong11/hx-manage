<!--
 * @Description: 分供商考核详情
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-20 09:56:39
 * @LastEditTime: 2020-02-21 13:56:14
 -->
<template>
  <div>
    <!-- 基本信息 -->
    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <div>{{ form.supplierName }}</div>
        </div>
        <el-form ref="form" label-width="110px" :model="form">
          <el-row>
            <el-col :span="20">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="供应商类型">
                    分供商
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建人">
                    {{ form.creatorName }}
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="考核开始日期">
                    {{ form.startTime }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建时间">
                    {{ form.createTime }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="考核结束日期">
                    {{ form.endTime }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="考核部门">
                    {{ form.checkDeptName }}
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="考核人">
                    {{ form.checkerName }}
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="考核描述">{{ form.checkDesc }}</el-form-item>
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
    <!-- 评分基本情况 -->
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">评分基本信息</div>
        <el-table
          :data="form.supplierCheckScoreList"
          show-summary
          sum-text="综合平均得分"
          :summary-method="summaryMethod"
        >
          <el-table-column label="序号" width="50" type="index" align="center"></el-table-column>
          <el-table-column label="考核项目" align="center" prop="project"></el-table-column>
          <el-table-column label="考核名称" align="center" prop="name"></el-table-column>
          <el-table-column label="参考分值" align="center" prop="fraction"></el-table-column>
          <el-table-column label="考核内容" align="center" prop="content"></el-table-column>
          <el-table-column label="所得分值" align="center" prop="score"></el-table-column>
          <el-table-column label="详细说明" align="center" prop="remark"></el-table-column>
        </el-table>
      </el-card>
    </section>
  </div>
</template>

<script>
import supplierState from '@/lib/supplier/supplierState'
import supplierType from '@/lib/supplier/supplierType'
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
  methods: {
    goEdit() {
      this.$router.push({ name: this.editName, query: { id: this.form.id } })
    },
    stateFilter(state) {
      return _.get(
        supplierState.find(item => item.value === state),
        'label',
        '-'
      )
    },
    // 综合评分
    summaryMethod(params) {
      let number = 0
      let list = _.cloneDeep(this.form.supplierCheckScoreList)
      list.forEach(item => {
        if (item.score === null) item.score = 0
        number += item.score
      })
      number = number.toFixed(0)
      return ['综合平均得分', number]
    }
  }
}
</script>

<style lang="scss" scoped></style>
