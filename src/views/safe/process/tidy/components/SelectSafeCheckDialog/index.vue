<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="选择安全检查"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="tooltips">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="equipmentName">
          <el-input
            v-model="pageQuery.equipmentName"
            placeholder="安全检查记录编号/安全计划/关键部位/检查单位/受检单位/受检方代表/检查人员/创建人"
          />
        </el-form-item>
        <el-form-item label="检查日期" prop="planDate">
          <el-date-picker
            v-model="pageQuery.time"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="伤害类别" prop="status">
          <SelectList v-model="pageQuery.status" type="peopleStatusList" />
        </el-form-item>
        <el-form-item label="风险类别" prop="status">
          <SelectList v-model="pageQuery.status" type="peopleStatusList" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <VXTable ref="table" :columns="tableColumn" :tableData="tableList" />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
export default {
  name: 'SelectSafeCheckDialog',
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
      requestFlag: false,
      tableList: [
        {
          id: 1,
          number: 'JC0001',
          name: '2月份检查计划',
          person: '张静茹',
          depart: '研发部',
          date: '2020-02-07'
        }
      ],
      // 表格表头
      tableColumn: [
        { type: 'checkbox', width: 80 },
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
          field: 'name',
          title: '关键部位'
        },
        {
          field: 'depart',
          title: '检查单位'
        },
        {
          field: 'depart',
          title: '受检单位'
        },
        {
          field: 'person',
          title: '受检方代表'
        },
        {
          field: 'date',
          title: '检查日期'
        },
        {
          field: 'person',
          title: '检查人员'
        },
        {
          field: 'result',
          title: '检查结果'
        },
        {
          field: 'date',
          title: '整改期限'
        }
      ]
    }
  },
  methods: {
    handleTabClick(tab) {},
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$message.success('操作成功')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
