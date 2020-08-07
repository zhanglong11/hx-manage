<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="equipmentName">
          <el-input v-model="pageQuery.equipmentName" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="施工单位验收结果" prop="status">
          <SelectList v-model="pageQuery.status" type="selfCheckTypeList" />
        </el-form-item>
        <el-form-item label="监理单位验收结果" prop="status">
          <SelectList v-model="pageQuery.status" type="selfCheckTypeList" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="selfCheckTypeList" />
        </el-form-item>
        <el-form-item label="验收日期" prop="status">
          <el-date-picker
            v-model="pageQuery.time"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="status">
          <el-date-picker
            v-model="pageQuery.time"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="类别" prop="status">
          <SelectList v-model="pageQuery.status" type="standardTypeList" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <VXTable ref="table" :columns="tableColumn" :tableData="tableList" />
    </div>
    <AuditDialog :visible.sync="auditVisible" />
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'

export default {
  name: 'CheckStandard',
  mixins: [PageMixin],
  data() {
    return {
      selectedList: [],
      auditVisible: false,
      pageQuery: {
        equipmentName: '',
        status: null,
        type: null
      },
      tableList: [
        {
          id: 1,
          number: 'GB50300-2013',
          name: '《建筑工程施工质量验收统一标准》',
          type: '国家标准',
          creator: '张佑轩',
          time: '2020/1/1110:11'
        }
      ],
      requestFlag: false,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '检验批编号'
        },
        {
          field: 'name',
          title: '所属分项工程'
        },
        {
          field: 'type',
          title: '检验批名称'
        },
        {
          field: 'type',
          title: '检验批部位'
        },
        {
          field: 'type',
          title: '检验批容量'
        },
        {
          field: 'type',
          title: '施工依据'
        },
        {
          field: 'type',
          title: '验收依据'
        },
        {
          field: 'type',
          title: '验收日期'
        },
        {
          field: 'type',
          title: '施工单位验收结果'
        },
        {
          field: 'audit',
          title: '监理单位验收结果'
        },
        {
          field: 'status',
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
                <el-button type="text" onClick={() => this.showAuditDialog(row.id, row)}>
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
      this.$router.push({ path: 'checkRecord', params: { id } })
    },
    showAuditDialog() {
      this.auditVisible = true
    },
    remove(rows) {
      this.$message.success('删除成功')
      // this.$remove(troubleRepairApi.equipmentRepairDel, rows, 'faultNum', this.getList)
    }
  }
}
</script>

<style scoped></style>
