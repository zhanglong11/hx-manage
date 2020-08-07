<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" class="edit-section" label-width="110px">
      <el-form-item label="分项工程" prop="engineeringName">
        <div style="display: flex;">
          <el-input v-model="form.engineeringName" />
          <el-button type="text" @click="showTargetDialog(4)"> 选择</el-button>
        </div>
      </el-form-item>
      <!--      根据原型修改 张龙 3-30-->
      <el-form-item label="测量项目" prop="measureProject">
        <el-input v-model="form.measureProject" />
      </el-form-item>
      <el-form-item label="测量内容" prop="measureContent">
        <el-input v-model="form.measureContent" />
      </el-form-item>
      <el-form-item label="合格标准" prop="deviationValue">
        <InputNumber v-model="form.deviationValue" />
      </el-form-item>
      <el-form-item label="实测点">
        <InputNumber disabled :value="this.detailList.length" />
      </el-form-item>
      <el-form-item label="合格点">
        <InputNumber disabled :value="getStandardCount()" />
      </el-form-item>
      <el-form-item label="合格率">
        <InputNumber disabled :value="getPercent()" />
      </el-form-item>
      <el-form-item label="爆点数">
        <InputNumber disabled :value="getUnqualified()" />
      </el-form-item>
      <el-form-item label="附件" prop="fileIds">
        <FileEdit v-model="form.fileIds" />
      </el-form-item>
    </el-form>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>测点明细</span>
        </div>
        <EditTable ref="table" v-model="detailList" :tableColumn="tableColumn" :validRules="validRules" />
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <SelectTargetResolveDialog :visible.sync="targetVisible" :targetType="targetType" @getTarget="getTarget" />
  </div>
</template>

<script>
import api from '@/api/quality/control/actualMeasure'
import commonApi from '@/api/safe/common'
export default {
  name: 'Edit',
  data() {
    return {
      targetVisible: false,
      orderInfo: {},
      userData: [],
      targetType: null,
      form: {
        deviationValue: 1
      },
      //验证功能 张龙 3-30
      rules: {
        measureProject: [{ required: true, message: '必填' }],
        measureContent: [{ required: true, message: '必填' }],
        engineeringName: [{ required: true, message: '必填' }],
        deviationValue: [{ required: true, message: '必填' }]
      },
      tableColumn: [
        { type: 'seq', title: '点号', width: 80 },
        {
          field: 'location',
          title: '位置',
          slots: {
            default: ({ row }) => [<el-input v-model={row.location} />]
          }
        },
        {
          field: 'designValue',
          title: '设计值',
          slots: {
            default: ({ row, rowIndex }) => [
              <el-input-number
                v-model={row.designValue}
                controls={false}
                controls-position="right"
                min={0}
                onInput={() => {
                  this.getDesignValue(row, rowIndex)
                }}
              />
            ]
          }
        },
        {
          field: 'measuredValue',
          title: '测量值',
          slots: {
            default: ({ row, rowIndex }) => [
              <el-input-number
                v-model={row.measuredValue}
                controls={false}
                controls-position="right"
                min={0}
                onInput={() => {
                  this.getMeasuredValue(row, rowIndex)
                }}
              />
            ]
          }
        },
        {
          field: 'deviationValue',
          title: '偏差'
        },
        {
          field: 'isStandard',
          title: '是否合格',
          slots: {
            default: ({ row }) => [<span>{this.formatterStandard(row.deviationValue)}</span>]
          }
        },
        {
          field: 'measuredManId',
          title: '测量人',
          slots: {
            default: ({ row, rowIndex }) => [
              <el-select
                v-model={row.measuredManId}
                onChange={value => {
                  this.getMeasuredMan(row, rowIndex, value)
                }}
              >
                {this.getManList()}
              </el-select>
            ]
          }
        }
      ],
      detailList: [],
      validRules: {
        measuredManId: [{ required: true, message: '必填' }],
        //bug1440 张龙 3-31
        location: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    this.getUserData()
    if (this.$route.params.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
      this.detailList = res.data.detailList
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.detailList.length) {
            this.$message.error('请添加测点明细')
            return
          }
          this.$refs.table.$refs.table.$refs.vxeTable.validate().then(async () => {
            let res = this.$route.params.id
              ? await api.update({ ...this.form, ...{ detailList: this.detailList } })
              : await api.add({ ...this.form, ...{ detailList: this.detailList } })
            this.$message.success('保存成功')
            this.$router.go(-1)
          })
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    showTargetDialog(type) {
      this.targetType = type
      this.targetVisible = true
    },
    getTarget(o) {
      this.form = {
        ...this.form,
        ...{
          qualityTargetDecomposeId: o.id,
          engineeringName: o.name
        }
      }
    },
    getDesignValue(row) {
      row.deviationValue = row.measuredValue - row.designValue || 0
      this.$refs.table.$refs.table.$refs.vxeTable.reloadRow(row)
    },
    getMeasuredValue(row) {
      row.deviationValue = row.measuredValue - row.designValue || 0
      this.$refs.table.$refs.table.$refs.vxeTable.reloadRow(row)
    },
    async getUserData() {
      let res = await commonApi.userList({ page: 1, rows: 50 })
      this.userData = res.data.records
    },
    getManList() {
      return this.userData.map(item => [<el-option value={item.id} key={item.id} label={item.realName} />])
    },
    getMeasuredMan(row, rowIndex, value) {
      let label = this.userData.filter(l => value === l.id).map(l => l.realName)[0]
      row.measuredManName = label
      this.$refs.table.$refs.table.$refs.vxeTable.reloadRow(rowIndex, row)
    },
    formatterStandard(deviationValue) {
      if (Math.abs(this.form.deviationValue) >= Math.abs(deviationValue)) {
        return '合格'
      } else {
        return '不合格'
      }
    },
    getStandardCount() {
      return this.detailList.filter(r => {
        return Math.abs(this.form.deviationValue) >= Math.abs(r.deviationValue)
      }).length
    },
    getUnqualified() {
      return this.detailList.filter(r => {
        return Math.abs(this.form.deviationValue) < Math.abs(r.deviationValue)
      }).length
    },
    getPercentFun(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0 + '%'
    },
    getPercent() {
      return this.getPercentFun(this.getStandardCount(), this.detailList.length)
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}
</style>
