<!--
 * @Description: 选择供应商
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-18 11:43:34
 * @LastEditTime: 2020-02-18 17:30:51
 -->
<template>
  <div>
    <el-dialog title="选择供应商" :visible.sync="providerVisible" width="900px" @close="providerClose">
      <el-form ref="pageQuery" :model="pageQuery">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="keyWord" label-width="0">
              <el-input
                v-model="pageQuery.keyWord"
                placeholder="供应商名称/社会统一信用代码/公司法人/经营范围"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <div class="tooltips end">
              <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <VXTable
          ref="table"
          v-loading="tableLoading"
          :tableData="tableData"
          :pageQuery="pageQuery"
          :total="total"
          rowId="id"
          :columns="tableColumn"
          @selectionChange="selectionChange"
          @getList="getList"
          @pageChange="pageChange"
          @sizeChange="sizeChange"
          @radioChange="radioChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="providerVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import supplierType from '@/lib/supplier/supplierType'
import supplierState from '@/lib/supplier/supplierState'
import api from '@/api/provider/manage.js'
export default {
  name: 'ChooseProvider',
  mixins: [PageMixin],
  props: {
    // 分供商\分包商
    type: {}
  },
  data() {
    return {
      // 供应商类型
      supplierType: supplierType,
      // 状态列表
      stateList: supplierState,
      request: api.getSupplierManageList,
      providerVisible: false,
      pageQuery: {
        projectId: localStorage.getItem('projectId'),
        status: 2
      },
      tableColumn: [
        {
          type: 'radio',
          width: 50
        },
        {
          prop: 'name',
          label: '供应商名称',
          minWidth: 100
        },
        {
          prop: 'supplierType',
          label: '供应商类型',
          width: 100,
          formatter: ({ cellValue }) =>
            _.get(
              this.supplierType.find(item => item.value === cellValue),
              'label',
              '-'
            )
        },
        {
          prop: 'socialCreditCode',
          label: '社会统一信用代码',
          minWidth: 140
        },
        {
          prop: 'legalPerson',
          label: '公司法人',
          width: 100
        },
        {
          prop: 'businessScope',
          label: '经营范围',
          minWidth: 100
        },

        {
          prop: 'creatorName',
          label: '创建人',
          width: 100
        },
        {
          prop: 'createTime',
          label: '创建日期',
          width: 100,
          formatter: ({ cellValue }) => moment(cellValue).format('YYYY-MM-DD')
        }
      ]
    }
  },
  methods: {
    show() {
      this.providerVisible = true
      this.pageQuery.supplierType = this.type
      this.getList()
    },
    chooseSure() {
      if (_.isEmpty(this.radioRow)) return this.$message.error('请选择供应商')
      let copy = JSON.parse(JSON.stringify(this.radioRow))
      this.$emit('chooseSure', copy)
      this.$refs.pageQuery.resetFields()
      this.providerClose()
    },
    providerClose() {
      this.providerVisible = false
      this.radioRow = {}
    }
  }
}
</script>

<style lang="less" scoped></style>
