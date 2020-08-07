<template>
  <div>
    <!--    /**
    任务名称：2868/添加3月注释
    开发人员：李建敏
    日期：2020-3月-4日
    任务类型：2、复制修改代码 （5行）
    **/-->
    <!--    /**
任务名称：2868/添加3月注释
开发人员：李建敏
日期：2020-3月-6日
任务类型：2、复制修改代码 （30行）
**/-->
    <!--    /**
任务名称：2868/添加3月注释
开发人员：李建敏
日期：2020-3月-6日
任务类型：2、复制修改代码 （50行）
**/-->
    <!--
/**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、修改代码（30行）
**/
-->
    <div class="tooltips">
      <div>
        <el-form inline>
          <el-form-item>
            <el-input
              v-model="filterForm.search"
              style="width: 350px;"
              placeholder="进度计划变更编号/实际进度填报任务编号/施工影响名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="影响开始日期">
            <el-date-picker
              v-model="filterForm.affectStart"
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
          <el-form-item label="影响结束日期">
            <el-date-picker
              v-model="filterForm.affectEnd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @input="
                arr => {
                  filterForm.endBeginTime = arr[0] + ' 00:00:00'
                  filterForm.endEndTime = arr[1] + ' 23:59:59'
                }
              "
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="filterForm.createDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @input="
                arr => {
                  filterForm.createBeginTime = arr[0] + ' 00:00:00'
                  filterForm.createEndTime = arr[1] + ' 23:59:59'
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
    </div>
    <Grid ref="table" :showHeaderOverflow="false" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column width="60px" title="序号" type="seq"></vxe-table-column>
      <vxe-table-column width="160px" title="进度计划变更编号/实际进度填报任务编号">
        <template v-slot="{ row }">
          <span>{{ row.planNum || row.number }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column min-width="120px" title="施工影响名称" field="effectName"></vxe-table-column>
      <vxe-table-column width="100px" title="影响范围" field="effectScope"></vxe-table-column>
      <vxe-table-column width="60px" title="单位" field="unit"></vxe-table-column>
      <vxe-table-column
        width="100px"
        title="影响开始日期"
        field="beginDate"
        :formatter="['toDateString', 'yyyy-MM-dd']"
      ></vxe-table-column>
      <vxe-table-column
        width="100"
        title="影响结束日期"
        field="endDate"
        :formatter="['toDateString', 'yyyy-MM-dd']"
      ></vxe-table-column>
      <vxe-table-column width="120px" title="影响工期（天）" field="effectDuration"></vxe-table-column>
      <vxe-table-column title="影响值" field="effectValue" :editRender="{ name: 'ElInputNumber' }"></vxe-table-column>
      <vxe-table-column
        width="100px"
        title="施工影响类型"
        field="type"
        :formatter="({ cellValue }) => ['计划调整', '实际填报'][cellValue - 1]"
      ></vxe-table-column>
      <vxe-table-column width="100px" title="创建人" field="creatorName"></vxe-table-column>
      <vxe-table-column width="140px" title="创建时间" field="createTime"></vxe-table-column>
      <vxe-table-column width="100px" title="操作" fixed="right">
        <template v-slot="{ row }">
          <router-link :to="'/schedule/affect/' + row.id">查看</router-link>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
export default {
  name: 'AffectList',
  data() {
    return {
      date: null,
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return this.axios.schedule.post('construct/effect/list', body)
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
