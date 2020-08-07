<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.search" placeholder="检查项目/检查部位/检查人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="问题等级" prop="problemGrade">
          <SelectList v-model="pageQuery.problemGrade" type="questionLevel" />
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgencyDegree">
          <SelectList v-model="pageQuery.urgencyDegree" type="urgencyDegree" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="qualityCheckStatus" />
        </el-form-item>
        <el-form-item label="检查时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
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
    <QuestionTidyDialog :visible.sync="questionVisible" :curId="curId" />
    <TidyResetDialog :visible.sync="resetVisible" :curId="curId" />
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/quality/control/qualityCheck'
import paramList from '@/lib/paramList'
import QuestionTidyDialog from './components/QuestionTidyDialog'
import TidyResetDialog from './components/TidyResetDialog'
export default {
  name: 'CheckStandard',
  components: {
    QuestionTidyDialog,
    TidyResetDialog
  },
  mixins: [PageMixin],
  data() {
    return {
      questionVisible: false,
      resetVisible: false,
      pageQuery: {},
      curId: null,
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkPoint',
          title: '检查部位',
          minWidth: 100
        },
        {
          field: 'checkItem',
          title: '检查项目',
          minWidth: 100
        },
        {
          field: 'problemDesc',
          title: '问题描述',
          minWidth: 100
        },
        {
          field: 'planTime',
          title: '问题等级',
          minWidth: 100,
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.questionLevel, { value: row.problemGrade }), 'label')}</span>
            ]
          }
        },
        {
          field: 'planTime',
          title: '紧急程度',
          minWidth: 100,
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.urgencyDegree, { value: row.urgencyDegree }), 'label')}</span>
            ]
          }
        },
        {
          field: 'checkManName',
          title: '检查人',
          minWidth: 100
        },
        {
          field: 'checkTime',
          title: '检查时间',
          minWidth: 100
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.qualityCheckStatus, { value: row.status }), 'label')}</span>
            ]
          },
          minWidth: 100
        },
        {
          field: '',
          title: '操作',
          fixed: 'right',
          width: 200,
          slots: {
            default: ({ row }) => {
              return [
                row.status === 0 ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    检查
                  </el-button>
                ) : null,
                row.status === 2 ? (
                  <el-button type="text" onClick={() => this.showQuestionDialog(row.id)}>
                    问题整改
                  </el-button>
                ) : null,
                row.status === 3 ? (
                  <el-button type="text" onClick={() => this.showResetDialog(row.id)}>
                    整改复查
                  </el-button>
                ) : null,
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  查看
                </el-button>
              ]
            }
          }
        }
      ]
    }
  },
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `qualityCheckEdit/${id}` }) : this.$router.push({ path: `qualityCheckEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'qualityCheckDetail', query: { id } })
    },
    showQuestionDialog(id) {
      this.curId = id
      this.questionVisible = true
    },
    showResetDialog(id) {
      this.curId = id
      this.resetVisible = true
    }
  }
}
</script>

<style scoped></style>
