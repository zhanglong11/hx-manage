<template>
  <el-dialog
    width="1000px"
    :modal="true"
    top="10vh"
    title="选择验收依据"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.search" placeholder="规范名称/规范编号/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <SelectList v-model="pageQuery.category" type="standardTypeList" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
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
      @radioChange="radioChange"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/quality/plan/checkStandard'
export default {
  name: 'CheckStandard',
  mixins: [PageMixin],
  props: {
    visible: {}
  },
  data() {
    return {
      time: null,
      pageQuery: {
        search: '',
        category: ''
      },
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'specificationNumber',
          title: '规范编号'
        },
        {
          field: 'specificationName',
          title: '规范名称'
        },
        {
          field: 'category',
          title: '类别',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.standardTypeList, { value: row.category }), 'label')}</span>
            ]
          }
        },
        {
          field: 'creatorName',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间'
        }
      ]
    }
  },
  watch: {
    time(val) {
      this.pageQuery.beginTime = val ? moment(val[0]).format('YYYY-MM-DD') : null
      this.pageQuery.endTime = val ? moment(val[1]).format('YYYY-MM-DD') : null
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      this.radioRow = {}
    },
    submit() {
      this.$emit('update:visible', false)
      this.$emit('choose', this.radioRow)
    }
  }
}
</script>

<style scoped></style>
