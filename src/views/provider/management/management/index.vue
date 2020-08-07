<!--
 * @Description: 供应商管理
 * @Version: 1.0
 * @Autor:
 * @Date: 2020-02-08 15:46:40
 * @LastEditTime: 2020-03-25 11:29:58
 -->
<!--
    任务名称：bug#1278 | 跟产品商量之后，所有的创建时间都改为精确至时分秒，其他页面同样处理，在此统一说明
    开发人员：申豪强
    日期：2020-03-25
    任务类型：测试人员提出的系统性BUG
  -->
<!--
    任务名称：无任务号 |  在页面中当宽度不够，左侧操作栏固定的时候，插件自动计算高度失败，其他页面同样操作，在此统一说明
    开发人员：申豪强
    日期：2020-03-25
    任务类型：自测bug
  -->
<template>
  <div>
    <Title title="供应商管理" />
    <el-form ref="pageQuery" :model="pageQuery">
      <el-row :gutter="20">
        <el-col :xl="10" :lg="10" :md="12">
          <el-form-item prop="keyWord" label-width="0">
            <el-input
              v-model="pageQuery.keyWord"
              suffix-icon="el-icon-search"
              placeholder="供应商名称/社会统一信用代码/公司法人/经营范围"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="9" :lg="9" :md="12">
          <el-form-item label="创建时间" label-width="82px">
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

        <el-col :xl="24" :lg="24" :md="24">
          <div class="tooltips">
            <el-button
              v-if="$hasPower('ProviderManagementCreate')"
              type="primary"
              icon="el-icon-plus"
              @click="toEdit(null)"
              >新建</el-button
            >
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
import api from '@/api/provider/manage.js'
export default {
  name: 'ProviderManagementList',
  mixins: [PageMixin],

  data() {
    return {
      // 供应商类型
      supplierType: supplierType,
      // 状态列表
      stateList: supplierState,
      request: api.getSupplierManageList,
      time: null,
      /*
       * @bug编号:1197|| 供应商管理-选择供应商类型-选中后选择框中仍显示请选择
       * @开发人员:申豪强
       * @日期:2020-03-19
       * @bug类型: 测试提bug
       */
      pageQuery: {
        projectId: localStorage.getItem('projectId'),
        supplierType: null,
        keyWord: null,
        status: null
      },
      conclusions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '通过',
          value: 1
        },
        {
          label: '不通过',
          value: 2
        }
      ],
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
          width: 100

          // formatter: ({ cellValue }) => moment(cellValue).format('YYYY-MM-DD hh:mm:ss')
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
              let btnWatch = this.$hasPower('ProviderManagementDetails') ? (
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  查看
                </el-button>
              ) : null
              let btnEdit = this.$hasPower('ProviderManagementEdit') ? (
                <el-button type="text" onClick={() => this.toEdit(row.id)}>
                  编辑
                </el-button>
              ) : null
              let btnDetele = this.$hasPower('ProviderManagementDelete') ? (
                <el-button type="text" onClick={() => this.remove(row.id)}>
                  删除
                </el-button>
              ) : null
              // 注意：三元后边不能是null，这是render函数的变异，vxetable会报警告;编辑按钮：草稿+已驳回；删除按钮：草稿状态
              return [btnWatch, row.status === 0 ? btnEdit : '', row.status === 0 ? btnDetele : '']
            }
          }
        }
      ],
      tableData: []
    }
  },
  watch: {
    time(val) {
      console.log(val)
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
    toDetail(id) {
      this.$router.push({ name: 'ProviderManagementDetails', query: { isEdit: true }, params: { id } })
    },
    resetHandle() {
      this.time = null
      this.reset()
    },
    toEdit(id) {
      this.$router.push({
        name: 'ProviderManagementCreate',
        query: {
          id: id
        }
      })
    },
    async remove(id) {
      let res = await api.supplierManageDelete(id)
      this.$message.success('删除成功')
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped></style>
