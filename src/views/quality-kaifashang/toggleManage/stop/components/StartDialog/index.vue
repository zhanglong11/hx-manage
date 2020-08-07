<template>
  <el-dialog :visible="visible" title="选择开工申请" width="70%" top="10vh" @close="cancelDialog">
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
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/quality/toggleManage/start'
export default {
  name: 'StartDialog',
  mixins: [PageMixin],
  props: {
    visible: {}
  },
  data() {
    return {
      request: api.list,
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'startApplyNumber',
          title: '开工编号'
        },
        {
          field: 'engineeringNumber',
          title: '工程编码'
        },
        {
          field: 'engineeringName',
          title: '工程名称'
        },
        {
          field: 'planStartDate',
          title: '开工日期'
        },
        {
          field: 'creatorName',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间'
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.startCheckStatus, { value: row.status }), 'label')}</span>
            ]
          }
        }
      ]
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      this.radioRow = {}
    },
    submit() {
      this.$emit('update:visible', false)
      this.$emit('chooseStart', this.radioRow)
    }
  }
}
</script>

<style scoped></style>
