<!--
* @任务编号: 2824 || 列表页显示问题
* @开发人员:张龙
* @日期:2020-03-05
* @任务类型:修改代码
-->
<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 420px;"
            placeholder="危险源/关键部位/项目责任领导/责任人/责任人联系方式/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="伤害类别" prop="category">
          <SelectList v-model="pageQuery.category" :multiple="true" :hasAllOption="false" type="harmTypeList" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="safeCommonStatus" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="btn-add">
      <el-button type="primary" icon="el-icon-plus" @click="toEdit(null)">新建</el-button>
    </div>
    <div>
      <VXTable
        v-loading="tableLoading"
        :tableData="tableData"
        :pageQuery="pageQuery"
        :total="total"
        :columns="tableColumn"
        @getList="getList"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/safe/plan/dangerous'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {},
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'dangerSource',
          title: '危险源',
          minWidth: 100
        },
        {
          field: 'placeName',
          title: '关键部位',
          minWidth: 100
        },
        {
          field: 'harmCategoryNames',
          title: '伤害类别',
          minWidth: 100
        },
        {
          field: 'precautionaryMeasure',
          title: '防范措施',
          minWidth: 100
        },
        {
          field: 'principalLeaderName',
          title: '项目责任领导',
          minWidth: 100
        },
        {
          field: 'principalName',
          title: '责任人',
          minWidth: 100
        },
        {
          field: 'principalContact',
          title: '责任人联系方式',
          minWidth: 100
        },
        {
          field: 'remark',
          title: '备注',
          minWidth: 100
        },
        {
          field: 'creatorName',
          title: '创建人',
          minWidth: 100
        },
        {
          field: 'createTime',
          title: '创建时间',
          //字段显示问题
          minWidth: 160
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.safeCommonStatus, { value: row.status }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                row.status === 0 && !this.isAudit ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                row.status !== 1 || !this.isAudit ? (
                  <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                    查看
                  </el-button>
                ) : null
              ]
            }
          }
        }
      ]
    }
  },
  computed: {
    isAudit() {
      return this.$route.meta.isAudit
    }
  },
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `dangerousEdit/${id}` }) : this.$router.push({ path: `dangerousEdit` })
    },
    toDetail(id) {
      this.$router.push({ name: 'SafePlanDangerousDetail', params: { id } })
      // this.isAudit
      //   ? this.$router.push({ path: `auditDangerousDetail/${id}` })
      //   : this.$router.push({ path: `dangerousDetail/${id}` })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await api.delete(row.id)
      this.$message.success('删除成功')
      this.getList()
    }
  }
}
</script>

<style scoped></style>
