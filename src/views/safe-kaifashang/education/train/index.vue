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
            style="width: 530px;"
            placeholder="培训编号/培训主题/培训地点/培训组织单位/授课人/培训主题/培训接受单位/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <DateRange :startTime.sync="pageQuery.startStartTime" :endTime.sync="pageQuery.startEndTime" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <DateRange :startTime.sync="pageQuery.endStartTime" :endTime.sync="pageQuery.endEndTime" />
        </el-form-item>
        <el-form-item label="培训主题" prop="trainTopic">
          <SelectList v-model="pageQuery.trainTopic" type="trainThemeType" />
        </el-form-item>
        <el-form-item label="培训类别" prop="trainType">
          <SelectList v-model="pageQuery.trainType" type="trainType" />
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
      <el-button v-if="$hasPower('SafeEducationTrainAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
        >新建</el-button
      >
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
import api from '@/api/safe/education/train'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        keyWords: '',
        status: null
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'trainNumber',
          title: '培训编号'
        },
        {
          field: 'trainTopic',
          title: '培训主题',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.trainThemeType, { value: row.trainTopic }), 'label')}</span>
            ]
          }
        },
        {
          field: 'count',
          title: '培训类型',
          slots: {
            default: ({ row }) => [<span>{_.get(_.find(paramList.trainType, { value: row.trainType }), 'label')}</span>]
          }
        },
        {
          field: 'startTime',
          title: '开始时间',
          minWidth: 160
        },
        {
          field: 'endTime',
          title: '结束时间',
          minWidth: 160
        },
        {
          field: 'trainAddress',
          title: '培训地点'
        },
        {
          field: 'trainCompany',
          title: '培训组织单位'
        },
        {
          field: 'lecturer',
          title: '授课人'
        },
        {
          field: 'recieveTrainCompany',
          title: '接受培训单位'
        },
        {
          field: 'recieveTrainNumber',
          title: '接受培训人数'
        },
        {
          field: 'passExaminationNumber',
          title: '考核合格人数'
        },
        {
          field: 'creatorName',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                this.$hasPower('SafeEducationTrainEdit') ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                this.$hasPower('SafeEducationTrainDelete') ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
                this.$hasPower('SafeEducationTrainDetail') ? (
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
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `trainEdit/${id}` }) : this.$router.push({ path: `trainEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'trainDetail', query: { id } })
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
