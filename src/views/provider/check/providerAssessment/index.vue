<!--
 * @Description: 供应商考核审核
 * @Version:
 * @Autor:
 * @Date: 2020-02-08 15:46:40
 * @LastEditTime: 2020-03-25 09:40:20
 -->
<template>
  <div>
    <Title title="供应商考核审核" />
    <el-form ref="pageQuery" :model="pageQuery" class="search-form">
      <el-row :gutter="10">
        <el-col :xl="11" :lg="11" :md="12">
          <el-form-item prop="keyWord" label-width="0">
            <el-input
              v-model="pageQuery.keyWord"
              suffix-icon="el-icon-search"
              placeholder="分供商名称/被考核部门/考核部门/考核人/考核描述/创建人"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item label="创建时间" prop="time" label-width="82px">
            <el-date-picker
              v-model="pageQuery.time"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="datetimerange"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :xl="5" :lg="5" :md="12">
          <el-form-item label="状态" prop="status" label-width="50px">
            <el-select v-model="pageQuery.status" placeholder="请选择" style="width: 100%;">
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
      <el-row :gutter="10">
        <el-col :xl="7" :lg="7" :md="12">
          <el-form-item label="供应商类型" prop="type" label-width="94px">
            <el-select v-model="pageQuery.type" placeholder="请选择" style="width: 100%;">
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
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
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
      />
    </div>
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import supplierType from '@/lib/supplier/supplierType'
import supplierState from '@/lib/supplier/supplierState'
import api from '@/api/provider/check.js'
export default {
  name: 'ProviderAssessment',
  mixins: [PageMixin],
  data() {
    return {
      noDraft: true,
      // 供应商类型
      supplierType: supplierType,
      // 状态列表
      stateList: supplierState.filter(item => item.label !== '草稿'),
      request: api.getSupplierCheckList,
      pageQuery: {
        projectId: localStorage.getItem('projectId'),
        time: null
      },
      tableData: [],
      tableColumn: [
        {
          type: 'index',
          label: '序号',
          width: 50
        },
        {
          prop: 'supplierName',
          label: '供应商名称',
          minWidth: 100,
          showOverflow: false
        },
        {
          prop: 'type',
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
          prop: 'startTime',
          label: '考核开始日期',
          width: 100
        },
        {
          prop: 'endTime',
          label: '考核结束日期',
          width: 100
        },
        {
          prop: 'beCheckedOrganName',
          label: '被考核部门',
          width: 100,
          showOverflow: false
        },
        {
          prop: 'checkDeptName',
          label: '考核部门',
          width: 100,
          showOverflow: false
        },
        {
          prop: 'checkerName',
          label: '考核人',
          minWidth: 120,
          showOverflow: false
        },
        {
          prop: 'checkDesc',
          label: '考核描述',
          width: 100,
          showOverflow: false
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
                <el-button type="text" onClick={() => this.toDetail(row.id, row.type)}>
                  查看
                </el-button>
              )
              let btnCheck = (
                <el-button type="text" onClick={() => this.check(row.id, row.type)}>
                  审核
                </el-button>
              )

              return [row.status === 2 || row.status === 3 ? btnWatch : '', row.status === 1 ? btnCheck : '']
            }
          }
        }
      ]
    }
  },
  watch: {
    'pageQuery.time': {
      handler: function (n, o) {
        console.log(n)
        if (n[0] !== null) {
          this.pageQuery.startTime = moment(n[0]).format('YYYY-MM-DD HH:MM:SS')
          this.pageQuery.endTime = moment(n[1]).format('YYYY-MM-DD HH:MM:SS')
        } else {
          this.pageQuery.startTime = ''
          this.pageQuery.endTime = ''
        }
      }
    }
  },
  methods: {
    toDetail(id, type) {
      if (type === 1) {
        //分包商考核详情
        this.$router.push({
          name: 'SubContractorrAssessmentDetails',
          query: { id: id, isCheck: false }
        })
      } else {
        //分供商考核详情
        this.$router.push({
          name: 'ProviderAssessmentDetails',
          query: { id: id }
        })
      }
    },
    check(id, type) {
      if (type === 1) {
        //分包商考核详情
        this.$router.push({
          name: 'SubContractorrAssessmentDetails',
          query: { id: id, type: 'check', isCheck: true }
        })
      } else {
        //分供商考核详情
        this.$router.push({
          name: 'ProviderAssessmentDetails',
          query: { id: id, type: 'check', isCheck: true }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
