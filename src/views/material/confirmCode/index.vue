<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item prop="keyword">
          <el-input
            v-model="pageQuery.keyword"
            style="width: 360px;"
            placeholder="材料确认单编号/甲供材计划名称/供应商名称/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createStartTime" :endTime.sync="pageQuery.createEndTime" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="pageQuery.status" clearable>
            <el-option value="null" label="全部" />
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('MaterialConfirmCodeAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <VXTable
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      :border="true"
      :columns="tableColumn"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import Api from '../api/confirmCode'
import PageMixin from '@/mixins/pageMixin'
import statusList from './lib/statusList'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ConfirmCode',
  mixins: [PageMixin],
  data() {
    // 这里存放数据
    return {
      request: Api.list,
      statusList,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'confirmCode',
          title: '材料确认单编号',
          minWidth: 120
        },
        {
          field: 'supplyPlanCode',
          title: '甲供材计划编号',
          minWidth: 120
        },
        {
          field: 'supplyPlanName',
          title: '甲供材计划名称',
          minWidth: 120
        },
        {
          field: 'secondParty',
          title: '供应商名称',
          minWidth: 140
        },
        {
          field: 'secondPartyLinkman',
          title: '联系人',
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
          minWidth: 140
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 140
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(this.statusList, { value: row.status }), 'label')}</span>]
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
              let btns = []
              if (this.$hasPower('MaterialConfirmCodeDetail')) {
                btns.push(
                  <el-button type="text" onClick={() => this.toDetail(row.id)}>
                    查看
                  </el-button>
                )
              }
              if (this.$hasPower('MaterialConfirmCodeEdit') && row.status === 0) {
                btns.push(
                  <el-button type="text" onClick={() => this.toEdit(row.id)}>
                    编辑
                  </el-button>
                )
              }
              if (this.$hasPower('MaterialConfirmCodeDelete') && row.status === 0) {
                btns.push(
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                )
              }
              return btns
            }
          }
        }
      ]
    }
  },
  created() {
    const { supplyPlanId = null, contractId = null, status } = this.$route.query
    if (supplyPlanId || contractId) {
      this.pageQuery = { ...this.pageQuery, ...{ supplyPlanId, contractId, status: +status || null } }
    }
  },
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `confirmCodeEdit/${id}` }) : this.$router.push({ path: `confirmCodeEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: `confirmCodeDetail/${id}` })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await Api.delete(row.id)
      this.$message.success('删除成功')
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped></style>
