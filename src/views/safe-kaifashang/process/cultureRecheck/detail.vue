<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <span>状态：合格</span>
        </h6>
        <ul>
          <li>
            <span class="label">安全检查编号</span>
            <span class="val">{{ orderInfo.checkNumber }}</span>
          </li>
          <li>
            <span class="label">安全整改编号</span>
            <span class="val">{{ orderInfo.rectificationNumber }}</span>
          </li>
          <li>
            <span class="label">问题等级</span>
            <span class="val">{{ _.get(_.find(paramList.questionLevel, { value: orderInfo.levels }), 'label') }}</span>
          </li>
          <li>
            <span class="label">紧急程度</span>
            <span class="val">{{ _.get(_.find(paramList.urgencyDegree, { value: orderInfo.urgency }), 'label') }}</span>
          </li>
          <li>
            <span class="label">问题描述</span>
            <span class="val">{{ orderInfo.describes }}</span>
          </li>
          <li>
            <span class="label">整改人</span>
            <span class="val">{{ orderInfo.rectificationerName }}</span>
          </li>
          <li>
            <span class="label">整改期限</span>
            <span class="val">{{ orderInfo.rectificationPeriodTime }}</span>
          </li>
          <li>
            <span class="label">整改要求</span>
            <span class="val">{{ orderInfo.rectificationRequire }}</span>
          </li>
          <li>
            <span class="label">复查人</span>
            <span class="val">{{ orderInfo.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">关键部位</span>
            <span class="val">{{ orderInfo.placeName }}</span>
          </li>
          <li>
            <span class="label">检查人</span>
            <span class="val">{{ orderInfo.checkPersonName }}</span>
          </li>
          <li>
            <span class="label">检查时间</span>
            <span class="val">{{ orderInfo.checkDate }}</span>
          </li>
          <li>
            <span class="label">附件---现场照片</span>
            <span class="val">{{ orderInfo.files }}</span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <section v-if="tidyList.length" style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>整改记录</span>
        </div>
        <el-collapse>
          <el-collapse-item
            v-for="item in tidyList"
            :key="item.id"
            :title="`整改时间：${item.rectificationTime}`"
            :name="item.id"
          >
            <div class="info">
              <div class="content">
                <ul>
                  <li>
                    <span class="label">整改人</span>
                    <span class="val">{{ item.rectificationerName }}</span>
                  </li>
                  <li>
                    <span class="label">备注</span>
                    <span class="val">{{ item.remark }}</span>
                  </li>
                  <li>
                    <span class="label">整改照片</span>
                    <span class="val"> <FileList :ids="orderInfo.files" /></span>
                  </li>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </section>
    <section v-if="rechekList.length" style="margin-top: 10px;">
      <el-card>
        <div slot="header" class="card-header">
          <span>复查记录</span>
        </div>
        <el-collapse>
          <el-collapse-item
            v-for="item in rechekList"
            :key="item.id"
            :title="`复查时间：${item.rectificationTime}`"
            :name="item.id"
          >
            <div class="info">
              <div class="content">
                <ul>
                  <li>
                    <span class="label">复查人</span>
                    <span class="val">{{ item.checkPersonName }}</span>
                  </li>
                  <li>
                    <span class="label">备注</span>
                    <span class="val">{{ item.remark }}</span>
                  </li>
                  <li>
                    <span class="label">复查照片</span>
                    <span class="val"> <FileList :ids="orderInfo.files" /></span>
                  </li>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="cancel">保存</el-button>
    </div>
  </div>
</template>

<script>
import paramList from '@/lib/paramList'
import api from '@/api/safe/process/cultrueRecheck'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      tidyList: [],
      rechekList: [],
      paramList,
      form: {}
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
      this.tidyList = res.data.rectificationResult.filter(r => r.draftFlag !== 0)
      this.rechekList = res.data.recheckResult.filter(r => r.draftFlag !== 0)
    },
    toEdit(id) {
      this.$router.push({ path: 'checkStandardEdit', params: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.form {
  display: flex;
  flex-wrap: wrap;
}
</style>
