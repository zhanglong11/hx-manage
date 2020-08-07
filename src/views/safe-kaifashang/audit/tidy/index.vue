<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 460px;"
            placeholder="整改编号/安全检查记录编号/检查单位/受检单位/受检方代表/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="问题等级" prop="status">
          <SelectList v-model="pageQuery.status" type="questionLevel" />
        </el-form-item>
        <el-form-item label="紧急程度" prop="status">
          <SelectList v-model="pageQuery.status" type="harmTypeList" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="riskTypeList" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <div>
      <VXTable ref="table" :columns="tableColumn" :tableData="tableList" />
    </div>
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
export default {
  name: 'CheckPlan',
  mixins: [PageMixin],
  data() {
    return {
      selectedList: [],
      pageQuery: {
        equipmentName: '',
        status: null,
        time: null
      },
      tableList: [
        {
          id: 1,
          number: 'JC0001',
          name: '2月份检查计划',
          count: '300',
          harmType: 0,
          riskType: 0,
          planTime: '2019-2-30',
          check: '',
          file: '',
          creator: '张佑轩',
          time: '2020/1/11'
        }
      ],
      requestFlag: false,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '安全检查记录编号'
        },
        {
          field: 'name',
          title: '安全计划'
        },
        {
          field: 'count',
          title: '关键部位',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.harmTypeList, { value: row.harmType }), 'label')}</span>
            ]
          }
        },
        {
          field: 'count',
          title: '检查单位',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.riskTypeList, { value: row.riskType }), 'label')}</span>
            ]
          }
        },
        {
          field: 'planTime',
          title: '受检单位'
        },
        {
          field: 'planTime',
          title: '受检方代表'
        },
        {
          field: 'planTime',
          title: '检查日期'
        },
        {
          field: 'planTime',
          title: '检查人员'
        },
        {
          field: 'check',
          title: '检查结果'
        },
        {
          field: 'check',
          title: '是否需要整改'
        },
        {
          field: 'check',
          title: '严重程度'
        },
        {
          field: 'check',
          title: '整改人员'
        },
        {
          field: 'check',
          title: '整改措施'
        },
        {
          field: 'check',
          title: '整改期限'
        },
        {
          field: 'check',
          title: '复检人员'
        },
        {
          field: 'check',
          title: '复检结果'
        },

        {
          field: 'creator',
          title: '创建人'
        },
        {
          field: 'time',
          title: '创建时间'
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  审核
                </el-button>,
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
    toDetail(id) {
      this.$router.push({ path: 'auditTidyDetail', params: { id } })
    }
  }
}
</script>

<style scoped></style>
