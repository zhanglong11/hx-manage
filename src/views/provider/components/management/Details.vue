<!--
 * @Description: 
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-19 17:43:29
 * @LastEditTime: 2020-03-25 10:28:33
 -->
<template>
  <div>
    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <div>{{ form.name }}</div>
        </div>
        <el-form ref="form" label-width="140px" :model="form">
          <el-row>
            <el-col :span="20">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="供应商类型">{{ typeFilter(form.supplierType) }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建人">{{ form.creatorName }}</el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="社会统一信用代码:">{{ form.socialCreditCode }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建时间">{{ form.createTime }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="公司法人">{{ form.legalPerson }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="经营范围">{{ form.businessScope }}</el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="注册资本(元)">
                    {{ $moneyFormat(form.registeredCapital) }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="传真或固话">
                    {{ form.taxTel }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="公司网址">
                    {{ form.website }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- 
                    *任务名称：无任务编号 
                    *开发人员：申豪强 
                    *日期：2020-03-25
                    *任务类型：修改地址插件传递方式，改为传递code，此处修改render方式 
                  -->
                  <el-form-item label="公司地址">{{
                    renderAddress(form.address) + ' ' + form.detailedAddress
                  }}</el-form-item>
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
    <!-- 供应商联系人 -->
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">供应商联系人</div>
        <el-table :data="form.contactList">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="联系人姓名" prop="name" align="center"></el-table-column>
          <el-table-column label="联系人电话" prop="mobile" align="center"></el-table-column>
          <el-table-column label="联系人地址" prop="address" align="center"></el-table-column>
          <el-table-column label="电子邮件" prop="email" align="center"></el-table-column>
          <el-table-column label="备注" prop="remark" align="center"></el-table-column>
        </el-table>
      </el-card>
    </section>
    <!-- 供应商银行信息 -->
    <section class="padding-top-20">
      <el-card>
        <div slot="header" class="card-header">供应商银行信息</div>
        <el-table :data="form.bankAccountList">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="开户银行" prop="openingBank" align="center"></el-table-column>
          <el-table-column label="开户行账号" prop="accountNum" align="center"></el-table-column>
          <el-table-column label="开户名称" prop="accountName" align="center"></el-table-column>
          <el-table-column label="备注" prop="remark" align="center"></el-table-column>
        </el-table>
      </el-card>
    </section>
  </div>
</template>

<script>
import supplierType from '@/lib/supplier/supplierType'
import supplierState from '@/lib/supplier/supplierState'
import mapList from '_c/AddressSelect/addressList.json'
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
      fileList: [
        {
          name: '文件1',
          value: '23'
        }
      ]
    }
  },
  methods: {
    /*
      任务名称：无任务编号
      开发人员：申豪强
      日期：2020-03-25
      任务类型：修改地址插件传递方式，改为传递code，此处修改render方式
    */
    renderAddress(code) {
      let str = '-'
      if (code) {
        str = ''
        let addressArray = code.split('_')
        for (let i = 0; i < addressArray.length; i++) {
          str = str + ',' + this.getAddressNode(mapList, addressArray[i])
        }
        str = str.substr(1)
      }
      return str
    },
    getAddressNode(pca, value) {
      for (let i = 0; i < pca.length; i++) {
        if (pca[i].value === value) {
          return pca[i].label
        } else if (pca[i].children) {
          let result = this.getAddressNode(pca[i].children, value)
          if (result) {
            return result
          }
        }
      }
    },
    typeFilter(type) {
      return _.get(
        supplierType.find(item => item.value === type),
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
    download(item) {},
    goEdit() {
      this.$router.push({ name: this.editName, query: { id: this.form.id } })
    }
  }
}
</script>

<style lang="scss" scoped></style>
