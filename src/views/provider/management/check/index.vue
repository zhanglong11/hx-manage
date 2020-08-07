<!--
 * @Description: 供应商考核
 * @Version:
 * @Autor:
 * @Date: 2020-02-08 15:46:40
 * @LastEditTime: 2020-03-25 11:30:20
 -->

<template>
  <!-- 供应商考核 -->
  <div>
    <Title title="供应商考核" />
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
        <el-col :span="24">
          <!-- <div class="tooltips"> -->
          <el-dropdown @command="AddSelect">
            <el-button
              v-if="$hasPower('SubContractorAdd') || $hasPower('SubsuppliersAdd') || $hasPower('ProviderCheckAdd')"
              type="primary"
              style="margin-bottom: 10px;"
            >
              新建
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$hasPower('SubContractorAdd')" command="addSubContractor"
                >新建分包商考核</el-dropdown-item
              >
              <el-dropdown-item v-if="$hasPower('SubsuppliersAdd')" command="addProvider"
                >新建分供商考核</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <!-- </div> -->
        </el-col>
      </el-row>
    </el-form>
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
</template>

<script>
import supplierType from '@/lib/supplier/supplierType'
import supplierState from '@/lib/supplier/supplierState'
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/provider/check.js'
export default {
  name: 'ProviderCheck',
  mixins: [PageMixin],
  data() {
    return {
      // 供应商类型
      supplierType: supplierType,
      // 状态列表
      stateList: supplierState,
      request: api.getSupplierCheckList,
      pageQuery: {
        starDate: null,
        endDate: null,
        time: null,
        projectId: localStorage.getItem('projectId')
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
          minWidth: 100
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
          width: 100
        },
        {
          prop: 'checkDeptName',
          label: '考核部门',
          width: 100
        },
        {
          prop: 'checkerName',
          label: '考核人',
          minWidth: 120
        },
        {
          prop: 'checkDesc',
          label: '考核描述',
          width: 100
        },
        {
          prop: 'creatorName',
          label: '创建人',
          width: 100
        },
        {
          prop: 'createTime',
          label: '创建日期',
          width: 100

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
          showOverflow: true,
          slots: {
            default: ({ row }) => {
              let btnWatch =
                this.$hasPower('SubContractorDetails') || this.$hasPower('SubsuppliersDetails') ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id, row.type)}>
                    查看
                  </el-button>
                ) : (
                  ''
                )
              let btnEdit =
                this.$hasPower('SubContractorEdit') || this.$hasPower('SubsuppliersEdit') ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row.type)}>
                    编辑
                  </el-button>
                ) : (
                  ''
                )
              let btnDetele = this.$hasPower('ProviderCheckDelete') ? (
                <el-button type="text" onClick={() => this.remove(row)}>
                  删除
                </el-button>
              ) : (
                ''
              )
              // 注意：三元后边不能是null，这是render函数的变异，vxetable会报警告;编辑按钮：草稿+已驳回；删除按钮：草稿状态
              return [btnWatch, row.status === 0 ? btnEdit : '', row.status === 0 ? btnDetele : '']
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
    AddSelect(e) {
      if (e === 'addSubContractor') {
        this.$router.push({ name: 'SubContractorAdd' })
      } else {
        this.$router.push({ name: 'SubsuppliersAdd' })
      }
    },
    toEdit(e, type) {
      if (type === 1) {
        //分包商考核
        this.$router.push({
          name: 'SubContractorAdd',
          query: { id: e }
        })
      } else {
        //分供商考核
        this.$router.push({
          name: 'SubsuppliersAdd',
          query: { id: e }
        })
      }
    },

    async remove(row) {
      await this.$tipRemove([row])
      let res = await api.deleteSupplierCheck(row.id)
      this.$message.success('删除成功')
      this.getList()
    },
    toDetail(e, type) {
      if (type === 1) {
        //分包商考核详情
        this.$router.push({
          name: 'SubContractorDetails',
          query: { id: e, isBao: true }
        })
      } else {
        //分供商考核详情
        this.$router.push({
          name: 'SubsuppliersDetails',
          query: { id: e, isBao: false }
        })
      }
    },
    add() {
      this.$router.push({
        name: 'ProviderManagementCreate'
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
