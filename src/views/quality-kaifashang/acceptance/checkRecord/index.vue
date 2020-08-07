<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="equipmentName">
          <el-input v-model="pageQuery.equipmentName" style="width: 280px;" placeholder="验收编号/验收名称/验收人" />
        </el-form-item>
        <el-form-item label="验收日期" prop="time">
          <el-date-picker
            v-model="pageQuery.time"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="验收类型" prop="status">
          <SelectList v-model="pageQuery.status" type="selfCheckTypeList" />
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

export default {
  name: 'FinishProtect',
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
          name: '控制点',
          count: '300',
          planTime: '2019-2-30',
          check: '符合设计要求',
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
          title: '验收编号'
        },
        {
          field: 'number',
          title: '验收名称'
        },
        {
          field: 'name',
          title: '验收类型'
        },
        {
          field: 'time',
          title: '验收日期'
        },
        {
          field: 'time',
          title: '状态'
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                  编辑
                </el-button>,
                <el-button type="text" onClick={() => this.remove(row)}>
                  删除
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
    toEdit(id) {
      this.$router.push({ path: 'checkRecordEdit', params: { id } })
    },
    toDetail(id) {
      this.$router.push({ path: 'checkRecordDetail', params: { id } })
    },
    remove(rows) {
      this.$message.success('删除成功')
      // this.$remove(troubleRepairApi.equipmentRepairDel, rows, 'faultNum', this.getList)
    }
  }
}
</script>

<style scoped></style>
