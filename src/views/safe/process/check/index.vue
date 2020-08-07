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
            style="width: 400px;"
            placeholder="安全检查记录编号/安全计划/关键部位/检查单位/受检单位"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="检查日期" prop="checkTime">
          <DateRange :startTime.sync="pageQuery.checkDateStart" :endTime.sync="pageQuery.checkDateEnd" />
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.createTimeStart" :endTime.sync="pageQuery.createTimeEnd" />
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
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/safe/process/check'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {},
      request: api.list,
      // 表格表头
      /*
       * @任务编号:#2686 || table配置修改
       * @开发人员:张龙
       * @日期:2020-03-23
       * @任务类型: 全新代码
       */
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkNumber',
          title: '安全检查编号',
          minWidth: 100
        },
        //无数据
        {
          field: 'safetyPlanId',
          title: '安全计划编号',
          slots: {
            default: ({ row }) => {
              return [
                <el-link underline={false} type="primary" onClick={() => this.toPlan(row.safetyPlanId)}>
                  {row.safetyPlanNum}
                </el-link>
              ]
            }
          },
          minWidth: 100
        },
        {
          field: 'placeNames',
          title: '关键部位',
          minWidth: 100
        },
        {
          field: 'checkCompanyName',
          title: '检查单位',
          minWidth: 100
        },
        {
          field: 'checkedCompanyName',
          title: '受检单位',
          minWidth: 100
        },
        {
          field: 'checkedRepresentativeName',
          title: '受检方代表',
          minWidth: 100
        },
        {
          field: 'checkDate',
          title: '检查日期',
          minWidth: 100
        },
        {
          field: 'checkPersonName',
          title: '检查人员',
          minWidth: 100
        },
        {
          field: 'checkResult',
          title: '检查结果',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.safeCheckStandard, { value: row.checkResult }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: 'draftFlag',
          title: '状态',
          slots: {
            default: ({ row }) => [<span>{row.draftFlag ? '已提交' : '草稿'}</span>]
          },
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
          //日期显示问题 张龙 3-30
          minWidth: 160
        },
        {
          field: '',
          label: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                // row.checkResult === 2 ? (
                //   <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                //     编辑
                //   </el-button>
                // ) : null,
                // row.checkResult === 2 ? (
                //   <el-button type="text" onClick={() => this.remove(row.id)}>
                //     删除
                //   </el-button>
                // ) : null,
                // row.checkResult !== 0 ? (
                //   <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                //     查看
                //   </el-button>
                // ) : null,
                // row.checkResult === 0 ? (
                //   <el-button type="text" onClick={() => this.toTidy(row.id)}>
                //     安全整改
                //   </el-button>
                // ) : null
                !row.draftFlag ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                !row.draftFlag ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  查看
                </el-button>,
                row.draftFlag && row.checkResult === 0 ? (
                  <el-button type="text" onClick={() => this.toTidy(row.id)}>
                    安全整改
                  </el-button>
                ) : null
              ]
            }
          }
        }
      ]
    }
  },
  methods: {
    toEdit(id) {
      this.$router.push({ path: 'processCheckEdit', query: { id } })
    },
    toDetail(id) {
      this.$router.push({ path: 'processCheckDetail', query: { id } })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await api.delete(row.id)
      this.$message.success('删除成功')
      this.getList()
    },
    toPlan(id) {
      this.$router.push({ path: '/safe/safePlan/safePlanDetail', query: { id } })
    },
    toTidy(id) {
      this.$router.push({ path: '/safe/process/tidy', query: { id } })
    }
  }
}
</script>

<style scoped></style>
