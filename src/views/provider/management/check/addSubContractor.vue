<!--
 * @Description: 新建分包商考核
 * @Version:
 * @Autor:
 * @Date: 2020-02-08 16:44:56
 * @LastEditTime: 2020-03-25 15:04:42
 -->
<!--
    任务名称：bug#1302 | 跟产品商量之后，供应商模块所有时间均统一成时分秒，其他文件统一，在此说明；
    开发人员：申豪强
    日期：2020-03-25
    任务类型：测试人员提出的系统性BUG
  -->

<template>
  <div class="margin-bottom-100">
    <Title title="新建分包商考核" />
    <!-- 基本信息 -->
    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">{{ id ? form.supplierName : '分包商基本信息' }}</div>
        <el-form ref="form" class="base-info-card" label-width="120px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="9">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label-width="20px">
                <el-button type="text" @click="chooseProvider">选择供应商</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核开始日期" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  style="width: 100%;"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="考核结束日期" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="被考核部门" prop="beCheckedOrganId">
                <el-input v-model="form.beCheckedOrganId" class="none"></el-input>
                <SelectDepart
                  :id.sync="form.beCheckedOrganId"
                  :multiple="false"
                  :value="form.beCheckedOrganId ? { id: form.beCheckedOrganId, label: form.beCheckedOrganName } : null"
                  :label.sync="form.beCheckedOrganName"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核部门" prop="checkDeptId">
                <el-input v-model="form.checkDeptId" class="none"></el-input>
                <SelectDepart
                  :id.sync="form.checkDeptId"
                  :multiple="false"
                  :value="form.checkDeptId ? { id: form.checkDeptId, label: form.checkDeptName } : null"
                  :label.sync="form.checkDeptName"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核人" prop="checker">
                <el-input v-model="form.checker" class="none"></el-input>
                <SelectUser
                  :id.sync="form.checker"
                  :value="form.checker ? { id: form.checker, label: form.checkerName } : null"
                  :name.sync="form.checkerName"
                  :multiple="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="考核描述" prop="checkDesc">
                <el-input v-model="form.checkDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件" prop="fileId">
                <el-input v-model="form.fileId" style="display: none;"></el-input>
                <US :ids="form.fileId" :multiple="true" @input="fileChange" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </section>
    <!-- 评分基本情况 -->
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">评分基本信息</div>
        <div>
          <el-button type="primary" class="margin-bottom-10" @click="add">添加评分标准</el-button>
        </div>
        <div class="score-list">
          <ul>
            <li v-for="(item, index) in form.supplierCheckScoreList" :key="index">
              <div class="desc">
                <p>{{ item.checkItem }}</p>
                <p>{{ item.score }}/10</p>
              </div>
              <el-slider
                v-model="item.score"
                :show-stops="true"
                :max="10"
                :min="0"
                :step="1"
                class="slider"
                @change="summaryMethod"
              ></el-slider>
              <div class="remove">
                <el-button @click="remove(index)">删除</el-button>
              </div>
            </li>
          </ul>
        </div>
        <div class="synthesize">综合平均得分:{{ allScore }}</div>
      </el-card>
    </section>
    <div class="btn-box-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save('draft')">保存为草稿</el-button>
      <el-button type="primary" class="btn-box-footer-button" @click="save('submit')">提交</el-button>
    </div>
    <el-dialog title="评分标准" :visible.sync="dialogVisible" width="500px" @close="close">
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="标准名称" prop="checkItem">
          <el-input v-model="addForm.checkItem"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
    <ChooseProvider ref="chooseProvider" :type="1" @chooseSure="chooseSure" />
  </div>
</template>

<script>
import ChooseProvider from '../components/ChooseProvider'
import api from '@/api/provider/check.js'
export default {
  name: 'AddSUbContractor',
  components: {
    ChooseProvider
  },
  data() {
    return {
      id: this.$route.query.id,
      dialogVisible: false,
      form: {
        startTime: '',
        projectId: localStorage.getItem('projectId'),
        fileId: '',
        supplierCheckScoreList: [
          {
            checkItem: '队伍素质',
            score: 0
          },
          {
            checkItem: '施工质量',
            score: 0
          },
          {
            checkItem: '施工工期',
            score: 0
          },
          {
            checkItem: '安全生产',
            score: 0
          },
          {
            checkItem: '文明施工',
            score: 0
          },
          {
            checkItem: '建会情况',
            score: 0
          },
          {
            checkItem: '劳务合同',
            score: 0
          },
          {
            checkItem: '工资支付',
            score: 0
          },
          {
            checkItem: '工作配合',
            score: 0
          },
          {
            checkItem: '遵纪守法',
            score: 0
          }
        ],
        type: 1
      },

      rules: {
        supplierName: [
          {
            required: true,
            message: '供应商名称必填'
          }
        ],
        startTime: [
          {
            required: true,
            message: '考核开始日期必填'
          }
        ],
        endTime: [
          {
            required: true,
            message: '考核结束日期必填'
          }
        ],
        beCheckedOrganId: [
          {
            required: true,
            message: '被考核部门必选'
          }
        ],
        checkDeptId: [
          {
            required: true,
            message: '考核部门必选'
          }
        ],
        checker: [
          {
            required: true,
            message: '考核人必选'
          }
        ],
        checkDesc: [
          {
            required: true,
            message: '考核描述必填',
            trigger: 'blur'
          }
        ],
        fileId: [
          {
            required: true,
            message: '附件必传'
          }
        ]
      },

      number: 0,
      addForm: {},
      addRules: {
        checkItem: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    allScore() {
      let number = 0
      let len = this.form.supplierCheckScoreList.length
      this.form.supplierCheckScoreList.forEach(item => {
        number += (100 / len) * (item.score / 10)
      })
      return number.toFixed(0)
    }
  },
  mounted() {
    if (this.id) {
      this.getDetails()
    }
  },
  methods: {
    async getDetails() {
      let res = await api.getSupplierDetalis(this.id)
      if (res) {
        this.form = res.data
      }
    },
    remove(index) {
      this.form.supplierCheckScoreList.splice(index, 1)
    },
    chooseSure(e) {
      this.form.supplierId = e.id
      this.$set(this.form, 'supplierName', e.name)
    },
    fileChange(e, f) {
      if (e.length === 0) return (this.form.fileId = '')
      this.form.fileId = e.map(item => item.id).join(',')
    },
    // 选择供应商
    chooseProvider() {
      this.$refs.chooseProvider.show()
    },
    // 被考核部门更改
    beCheckedOrgan(e) {
      if (e) {
        this.form.beCheckedOrganId = e.id
        this.form.beCheckedOrganName = e.organName
      } else {
        this.form.beCheckedOrganId = null
        this.form.beCheckedOrganName = null
      }
    },
    // 考核部门更改
    checkDept(e) {
      if (e) {
        this.form.checkDeptId = e.id
        this.form.checkDeptName = e.organName
      } else {
        this.form.checkDeptId = null
        this.form.checkDeptName = null
      }
    },
    close(e) {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    cancel() {
      this.$router.push({ name: 'ProviderCheck' })
    },
    save(type) {
      let number = 0
      let len = this.form.supplierCheckScoreList.length
      this.form.supplierCheckScoreList.forEach(item => {
        number += (100 / len) * (item.score / 10)
      })
      this.form.checkScore = number.toFixed(2)
      this.form.supplierCheckScoreList.forEach((item, index) => (item.itemSeq = index))
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (type === 'draft') {
          this.draftSure()
        } else {
          this.submit()
        }
      })
    },
    async draftSure() {
      let res = await api.saveSupplierCheck(this.form)
      this.$message.success('保存成功')
      this.cancel()
    },
    async submit() {
      let res = await api.submitSupplierCheck(this.form)
      this.$message.success('保存成功')
      this.cancel()
    },
    // 综合评分
    summaryMethod(params) {
      let number = 0
      let list = _.cloneDeep(this.form.supplierCheckScoreList)
      list.forEach(item => {
        number += item.score
      })
      number = number.toFixed(0)
      this.number = number
    },
    add() {
      this.dialogVisible = true
    },
    sure() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let flag = this.form.supplierCheckScoreList.some(item => item.checkItem === this.addForm.checkItem)
          if (flag) return this.$message.error('不能重复命名')
          this.form.supplierCheckScoreList.push({
            checkItem: this.addForm.checkItem,
            score: 0
          })
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.remove {
  padding-left: 20px;
}
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
