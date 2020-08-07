<!--
    任务名称：bug#1310,1304(跟1310相连，1310解决，1304就不会出现) | 跟产品商量之后，所有的附件暂时都改为必填，供应商其他模块统一处理，在此统一声明；
    开发人员：申豪强
    日期：2020-03-25
    任务类型：测试人员提出的系统性BUG
  -->
<template>
  <div class="create">
    <Title title="新建供应商" />
    <section>
      <el-card>
        <div slot="header" class="card-header">供应商基本信息</div>
        <el-form ref="form" class="base-info-card" label-width="144px" :model="form" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真或固话" prop="taxTel">
                <el-input v-model="form.taxTel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商类型" prop="supplierType">
                <el-select v-model="form.supplierType" style="width: 100%;" placeholder="请选择供应商类型">
                  <el-option label="分包商" :value="1"></el-option>
                  <el-option label="分供商" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司网址" prop="website">
                <el-input v-model="form.website"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社会统一信用代码" prop="socialCreditCode">
                <el-input v-model="form.socialCreditCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司地址" prop="address">
                <el-input v-model="form.address" class="none"></el-input>
                <AddressSelect :value="form.address" @update="areaUpdate" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司法人" prop="legalPerson">
                <el-input v-model="form.legalPerson"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label prop="detailedAddress">
                <el-input v-model="form.detailedAddress" placeholder="详细地址"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="经营范围" prop="businessScope">
                <el-input v-model="form.businessScope"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册资本(元)" prop="registeredCapital">
                <el-input-number
                  v-model="form.registeredCapital"
                  :min="0"
                  :controls="false"
                  style="width: 100%;"
                ></el-input-number>
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
    <!-- 供应商联系人 -->
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">供应商联系人</div>
        <el-table :data="form.contactList">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="联系人姓名" label-class-name="required" width="120" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.name" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="联系人电话" label-class-name="required" width="200" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.mobile" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="联系人地址" width="200" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.address" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="电子邮件" align="center" width="200">
            <template slot-scope="{ row }">
              <el-input v-model="row.email" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.remark" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, form.contactList)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="add" @click="addLink">+ 添加</div>
      </el-card>
    </section>
    <!-- 供应商银行信息 -->

    <!--  申豪强 2020-03-19 后台口头传达新增必填信息 -->
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">供应商银行信息</div>
        <el-table :data="form.bankAccountList">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="开户银行" width="160" align="center" label-class-name="required">
            <template slot-scope="{ row }">
              <el-input v-model="row.openingBank" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="开户行账号" width="200" align="center" label-class-name="required">
            <template slot-scope="{ row }">
              <el-input v-model="row.accountNum" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="开户名称" width="200" align="center" label-class-name="required">
            <template slot-scope="{ row }">
              <el-input v-model="row.accountName" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.remark" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, form.bankAccountList)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="add" @click="addBank">+ 添加</div>
      </el-card>
    </section>
    <div class="btn-box-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="saveDraft('draft')">保存为草稿</el-button>
      <el-button type="primary" class="btn-box-footer-button" @click="saveDraft('submit')">提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/provider/manage.js'
import publicRegular from '@/utils/regular'
export default {
  name: 'ProviderManagementCreate',
  data() {
    return {
      id: this.$route.query.id,
      form: {
        projectId: localStorage.getItem('projectId'),
        bankAccountList: [{}],
        contactList: [{}],
        address: '',
        fileId: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '供应商名称必填',
            trigger: 'blur'
          }
        ],
        taxTel: [
          {
            pattern: publicRegular.Tel,
            required: true,
            message: '格式错误，请输入座机号:区号-号码',
            trigger: 'blur'
          }
        ],
        supplierType: [
          {
            required: true,
            message: '供应商类型必选',
            trigger: 'change'
          }
        ],
        website: [
          {
            type: 'url',
            message: '请填写正确网址',
            trigger: 'blur'
          }
        ],
        socialCreditCode: [
          {
            pattern: publicRegular.taxNo,
            required: true,
            message: '格式错误',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '地址必填'
          }
        ],
        legalPerson: [
          {
            required: true,
            message: '公司法人必填',
            trigger: 'blur'
          }
        ],
        detailedAddress: [
          {
            required: true,
            message: '详细地址必填',
            trigger: 'blur'
          }
        ],
        businessScope: [
          {
            required: true,
            message: '经营范围必填',
            trigger: 'blur'
          }
        ],
        registeredCapital: [
          {
            required: true,
            message: '注册资本必填',
            trigger: 'blur'
          }
        ],
        fileId: [
          {
            required: true,
            message: '附件必传'
          }
        ]
      }
    }
  },
  created() {
    if (this.id) {
      this.getDetails()
    }
  },
  methods: {
    areaUpdate(e) {
      this.form.address = e
    },
    fileChange(e) {
      if (e.length === 0) return (this.form.fileId = '')
      this.form.fileId = e.map(item => item.id).join(',')
    },
    async getDetails() {
      let res = await api.getSupplierManageDetails(this.id)
      if (res) {
        this.form = res.data
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 新增供应商联系人
    addLink() {
      if (this.form.contactList.length === 0) {
        this.form.contactList.push({})
        return
      }
      if (_.isEmpty(this.form.contactList[this.form.contactList.length - 1]))
        return this.$message.error('请填写完整后再添加')
      this.form.contactList.push({})
    },
    // 新增银行信息
    addBank() {
      if (this.form.bankAccountList.length === 0) {
        this.form.bankAccountList.push({})
        return
      }
      if (_.isEmpty(this.form.bankAccountList[this.form.bankAccountList.length - 1]))
        return this.$message.error('请填写完整后再添加')
      this.form.bankAccountList.push({})
    },
    cancel() {
      this.$router.push({ name: 'ProviderManagementList' })
    },
    saveDraft(flag) {
      if (this.form.contactList.length === 0 || _.isEmpty(this.form.contactList[0]))
        return this.$message.error('供应商联系人必填')
      if (this.form.contactList.some(item => !item.name || !item.mobile))
        return this.$message.error('请填写联系人姓名+电话')

      if (this.form.bankAccountList.length === 0 || _.isEmpty(this.form.bankAccountList[0]))
        return this.$message.error('供应商银行信息必填')
      // <!--  申豪强 2020-03-19 后台口头传达新增必填信息 -->
      if (this.form.bankAccountList.some(item => !item.openingBank || !item.accountNum || !item.accountName))
        return this.$message.error('请填写开户行+开户行账号+开户名称')
      this.$refs.form.validate(valid => {
        if (valid) {
          if (flag === 'draft') {
            this.saveDraftSure()
          } else {
            this.save()
          }
        }
      })
    },
    async saveDraftSure() {
      let res = await api.supplierManageSave(this.form)
      this.$message.success('保存成功')
      this.resetFields()
      this.cancel()
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    async save() {
      let res = await api.supplierManageSubmit(this.form)
      this.$message.success('保存成功')
      this.resetFields()
      this.cancel()
    }
  }
}
</script>

<style lang="less" scoped>
.required {
  color: red;
}
/deep/ .el-table th.required > div::before {
  display: inline-block;
  content: '*';
  color: red;
  width: 8px;
  height: 8px;
  background: none;
  margin-right: 5px;
  vertical-align: sub;
  font-size: 16px;
}
.add {
  border: 1px dashed lightgrey;
  text-align: center;
  line-height: 30px;
  height: 30px;
  font-size: 14px;
  cursor: pointer;
}
.create {
  margin-bottom: 100px;
}
</style>
