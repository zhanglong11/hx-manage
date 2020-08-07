<!--
 * @Description: 分包商考核详情
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-20 09:17:57
 * @LastEditTime: 2020-02-21 13:55:56
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
                    分包商
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
        <div class="score-list">
          <ul>
            <li v-for="(item, index) in form.supplierCheckScoreList" :key="index">
              <div class="desc">
                <p>{{ item.checkItem }}</p>
                <p>{{ item.score }}/10</p>
              </div>
              <el-slider
                v-model="item.score"
                :max="10"
                :min="0"
                :step="1"
                :show-stops="true"
                disabled
                class="slider"
              ></el-slider>
            </li>
          </ul>
        </div>
        <div class="synthesize">综合平均得分:{{ number }}</div>
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
  computed: {
    number() {
      let number = 0
      this.form.supplierCheckScoreList.forEach(item => {
        number += item.score
      })
      return number.toFixed(0)
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
    }
  }
}
</script>

<style lang="less" scoped>
.synthesize {
  font-size: 20px;
  font-weight: 900;
  padding-top: 20px;
}
.score-list {
  position: relative;
  z-index: 900;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
  }
  .desc {
    font-size: 12px;
    text-align: center;
    width: 100px;
  }
  .slider {
    width: 88%;
  }
}
</style>
