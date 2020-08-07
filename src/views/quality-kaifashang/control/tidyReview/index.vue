<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="equipmentName">
          <el-input v-model="pageQuery.equipmentName" placeholder="检查项目/检查部位/检查人" />
        </el-form-item>
        <el-form-item label="严重程度" prop="status">
          <SelectList v-model="pageQuery.status" type="standardTypeList" />
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
  name: 'CheckStandard',
  mixins: [PageMixin],
  data() {
    return {
      selectedList: [],
      pageQuery: {
        equipmentName: '',
        status: null,
        time: null,
        type: null
      },
      tableList: [
        {
          id: 1,
          number: 'GB50300-2013',
          name: '《建筑工程施工质量验收统一标准》',
          type: 1,
          creator: '张佑轩',
          time: '2020/1/1110:11'
        },
        {
          id: 1,
          number: 'GB50202-2002',
          name: '《建筑地基基础工程施工质量验收规范》',
          type: 2,
          creator: '张佑轩',
          time: '2020/1/1110:11'
        },
        {
          id: 1,
          number: 'GB50203-2011',
          name: '《砌体工程施工质量验收规范》',
          type: 0,
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
          title: '检查部位'
        },
        {
          field: 'name',
          title: '检查项目'
        },
        {
          field: 'name',
          title: '问题描述'
        },
        {
          field: 'name',
          title: '问题等级'
        },
        {
          field: 'name',
          title: '紧急程度'
        },
        {
          field: 'name',
          title: '整改人'
        },
        {
          field: 'name',
          title: '状态'
        },
        {
          field: 'creator',
          title: '整改时间'
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
      this.$router.push({ path: 'tidyReviewEdit', params: { id } })
    },
    toDetail(id) {
      this.$router.push({ path: 'tidyReviewDetail', params: { id } })
    },
    remove(rows) {
      this.$message.success('删除成功')
      // this.$remove(troubleRepairApi.equipmentRepairDel, rows, 'faultNum', this.getList)
    }
  }
}
</script>

<style scoped></style>
