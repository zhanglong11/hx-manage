<template>
  <el-dialog
    width="1000px"
    :modal="true"
    top="10vh"
    title="选择人员"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="tooltips">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="equipmentName">
          <el-input v-model="pageQuery.equipmentName" placeholder="工号/员工名称/手机号/职位/所属部门" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <SelectList v-model="pageQuery.status" type="peopleStatusList" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
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
import paramList from '@/lib/paramList'
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/safe/common'
export default {
  name: 'SelectPeopleDialog',
  mixins: [PageMixin],
  props: {
    visible: {}
  },
  data() {
    return {
      pageQuery: {
        equipmentName: '',
        status: null,
        time: null
      },
      request: api.userList,
      // 表格表头
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'userCode',
          title: '工号'
        },
        {
          field: 'realName',
          title: '人员名称'
        },
        {
          field: 'mobile',
          title: '手机号'
        },
        {
          field: 'roleTexts',
          title: '职位'
        },
        {
          field: 'departmentList',
          title: '所属部门',
          slots: {
            default: ({ row }) => [<span>{this.formatterDepart(row.departmentList)}</span>]
          }
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.peopleStatusList, { value: row.loginStatus }), 'label')}</span>
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
    formatterDepart(departList) {
      return departList ? departList[0].departmentName : ''
    },
    submit() {
      this.$emit('update:visible', false)
      this.$emit('choose', this.radioRow)
    }
  }
}
</script>

<style scoped></style>
