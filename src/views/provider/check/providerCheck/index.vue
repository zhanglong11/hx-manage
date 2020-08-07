<!--
 * @Description: 供应商审核
 * @Version:
 * @Autor:
 * @Date: 2020-02-08 15:46:40
 * @LastEditTime: 2020-03-25 09:49:20
 -->
<template>
  <div>
    <Title title="供应商审核" />
    <el-form ref="pageQuery" :model="pageQuery">
      <el-row :gutter="20">
        <el-col :xl="11" :lg="11" :md="12">
          <el-form-item prop="keyWord" label-width="0">
            <el-input
              v-model="pageQuery.keyWord"
              suffix-icon="el-icon-search"
              placeholder="供应商名称/社会统一信用代码/公司法人/经营范围"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item label="创建时间" prop="status" label-width="82px">
            <el-date-picker
              v-model="time"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="datetimerange"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="5" :lg="5" :md="12">
          <el-form-item label="状态" prop="status" label-width="54px">
            <el-select v-model="pageQuery.status" placeholder="请选择" class="width100">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xl="7" :lg="7" :md="12">
          <el-form-item label="供应商类型" prop="supplierType" label-width="96px">
            <el-select v-model="pageQuery.supplierType" placeholder="请选择" class="width100">
              <el-option
                v-for="item in supplierType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="17" :lg="17" :md="12">
          <div class="tooltips end">
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetHandle">重置</el-button>
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
      />
    </div>
  </div>
</template>

<script>
import supplierType from '@/lib/supplier/supplierType'
import supplierState from '@/lib/supplier/supplierState'
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/provider/manage.js'
export default {
  name: 'ProviderAudit',
  mixins: [PageMixin],
  data() {
    return {
      noDraft: true,
      // 供应商类型
      supplierType: supplierType,
      // 状态列表:不要草稿
      stateList: supplierState.filter(item => item.label !== '草稿'),
      request: api.getSupplierManageList,
      pageQuery: {
        projectId: localStorage.getItem('projectId')
      },

      tableColumn: [
        {
          type: 'index',
          label: '序号',
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
          showOverflow: false
          // formatter: ({ cellValue }) => moment(cellValue).format('YYYY-MM-DD')
        },
        {
          prop: 'status',
          label: '状态',
          width: 80,
          formatter: ({ cellValue }) =>
            _.get(
              this.stateList.find(item => item.value === cellValue),
              'label',
              '-'
            )
        },
        {
          field: '',
          label: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              // 已通过+已驳回
              let btnWatch = (
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  查看
                </el-button>
              )
              let btnCheck = (
                <el-button type="text" onClick={() => this.check(row.id)}>
                  审核
                </el-button>
              )

              return [row.status === 2 || row.status === 3 ? btnWatch : '', row.status === 1 ? btnCheck : '']
            }
          }
        }
      ],
      tableData: [],
      time: null
    }
  },
  watch: {
    time(val) {
      if (val) {
        this.pageQuery.startTime = moment(val[0]).format('YYYY-MM-DD HH:MM:SS')
        this.pageQuery.endTime = moment(val[1]).format('YYYY-MM-DD HH:MM:SS')
      } else {
        this.pageQuery.startTime = ''
        this.pageQuery.endTime = ''
      }
    }
  },
  methods: {
    resetHandle() {
      this.time = null
      this.reset()
    },

    toEdit(id) {
      this.$router.push({ name: 'SubContractorEnterEdit', query: { id } })
    },
    toDetail(id) {
      this.$router.push({ name: 'ProviderAuditDetails', query: { id: id, isCheck: false } })
    },
    check(id) {
      this.$router.push({ name: 'ProviderAuditDetails', query: { id, type: 'check', isCheck: true } })
    }
  }
}
</script>

<style lang="less" scoped></style>
