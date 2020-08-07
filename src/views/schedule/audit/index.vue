<template>
  <div>
    <!--
/**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、修改代码（15行）
**/
-->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <!--
             /**
             bug名称：1307/ 进度管理-施工进度计划审核-搜索框中缺少【进度计划变更名称】
             开发人员：李建敏
             日期：2020-3月-26日
             任务类型：2、修改代码 (1行)
             **/
             -->
          <el-input
            v-model="filterForm.search"
            style="width: 300px;"
            placeholder="施工进度变更编号/施工进度变更名称/创建人"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" style="width: 120px;">
            <el-option label="已通过" :value="1"></el-option>
            <el-option label="已驳回" :value="2"></el-option>
            <el-option label="待审核" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filterForm.createAt"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @input="
              arr => {
                filterForm.beginTime = arr[0] + ' 00:00:00'
                filterForm.endTime = arr[1] + ' 23:59:59'
              }
            "
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
          <el-button @click="() => $refs.table.reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="进度计划变更编号" field="aaa"></vxe-table-column>
      <vxe-table-column title="进度计划变更名称" field="bbb"></vxe-table-column>
      <vxe-table-column title="现场签证编号" field="bbb"></vxe-table-column>
      <vxe-table-column title="备注" field="bbb"></vxe-table-column>
      <vxe-table-column title="创建人" field="ccc"></vxe-table-column>
      <vxe-table-column title="创建时间" formatter="toDateString" field="ddd"></vxe-table-column>
      <vxe-table-column title="状态" field="status"></vxe-table-column>
      <vxe-table-column title="操作">
        <span slot-scope="{ row }">
          <router-link :to="'/schedule/audit/' + row.id">审核</router-link>
        </span>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
export default {
  name: 'ScheduleAudit',
  data() {
    return {
      date: null,
      filterForm: {},
      request() {
        return Promise.resolve({
          total: 100,
          records: _.map(Array(10).fill(','), () => ({
            id: _.uniqueId(),
            aaa: '20020202',
            bbb: '整个项目的室外工作',
            ccc: '小明',
            ddd: '2019-01-09 10:00:00',
            status: '待审核'
          }))
        })
      }
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {}
  }
}
</script>

<style lang="less" scoped></style>
