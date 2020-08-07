<!--
/**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、移动代码
**/
-->
<template>
  <div>
    <div class="tooltips">
      <div>
        <el-form inline>
          <el-form-item>
            <el-input
              v-model="filterForm.search"
              style="width: 300px;"
              placeholder="进度计划变更编号/进度计划变更名称/创建人"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" style="width: 120px;">
              <el-option v-for="e in planAuditStatus" :key="e.key" :value="e.value" :label="e.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="filterForm.date"
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
      <div>
        <el-button
          v-if="$hasPower('SchedulePlanChangeLogAdd')"
          type="primary"
          @click="
            () => {
              form = {}
              editDialogVisible = true
            }
          "
          >新建进度计划变更</el-button
        >
      </div>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="施工进度变更编号" field="planNum"></vxe-table-column>
      <vxe-table-column title="施工进度变更名称" field="planName"></vxe-table-column>
      <vxe-table-column title="现场签证编号">
        <template v-slot="{ row }">
          <router-link :to="{ name: 'SceneVisaDetail', params: { id: row.visaId } }">{{ row.visaNum }}</router-link>
        </template>
      </vxe-table-column>
      <vxe-table-column title="备注" field="remark"></vxe-table-column>
      <vxe-table-column title="创建人" field="creatorName"></vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
      <vxe-table-column
        title="状态"
        field="status"
        :formatter="({ cellValue }) => planAuditStatus.getLabel(cellValue)"
      ></vxe-table-column>
      <vxe-table-column title="操作">
        <span slot-scope="{ row }">
          <router-link v-if="$hasPower('SchedulePlanChangeLogDetail')" :to="'/schedule/changeLog/' + row.id + '/detail'"
            >查看</router-link
          >
          <el-button
            v-if="$hasPower('SchedulePlanChangeLogEdit') && row.status === 0"
            style="margin-left: 10px;"
            type="text"
            @click="
              () => {
                form = row
                editDialogVisible = true
              }
            "
            >编辑</el-button
          >
          <el-button v-if="$hasPower('SchedulePlanChangeRemove') && row.status === 0" type="text" @click="remove(row)"
            >删除</el-button
          >
        </span>
      </vxe-table-column>
    </Grid>
    <el-dialog :title="(form.id ? '编辑' : '新建') + '进度计划变更'" width="600px" :visible.sync="editDialogVisible">
      <el-form ref="form" label-width="150px" :model="form" :rules="rules">
        <el-form-item label="进度计划变更名称" prop="planName">
          <el-input v-model="form.planName"></el-input>
        </el-form-item>
        <el-form-item label="选择现场签证" prop="visaId">
          <!--
/**
bug名称：1299/进度管理-施工进度计划变更-新建-选择现场签证-只可选择审核通过的现场签证
开发人员：李建敏
日期：2020-3月-26日
任务类型：2、移动代码 (1行)
**/
-->
          <SceneVisaSelect
            v-model="form.visaId"
            :status="2"
            :hasAll="false"
            class="inputStyle"
            @accessNumber="e => (form.visaNum = e)"
            @accessName="e => (form.visaName = e)"
          ></SceneVisaSelect>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import sceneVisaApi from '@/api/contract/sceneVisa'
import planAuditStatus from '../lib/planAuditStatus'
export default {
  name: 'PlanChange',
  data() {
    return {
      planAuditStatus,
      editDialogVisible: false,
      date: null,
      form: {},
      rules: {
        planName: [{ required: true, message: '必填' }]
      },
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return this.axios.schedule.post('construct/plan/list', body).then(res => res.data)
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    async remove(row) {
      await this.$confirm(`确定要删除${row.planName}吗?`)
      await this.axios.schedule.post('construct/plan/delete/' + row.id)
      this.$message.success('删除成功')
      this.refresh()
    },
    async next() {
      await this.$refs.form.validate()
      localStorage.setItem('lastAddSchedulePlanInfo', JSON.stringify(this.form))
      this.editDialogVisible = false
      this.$router.push({
        path: this.form.id ? 'changeLog/' + this.form.id + '/edit' : 'changeLog/new',
        query: { isNew: this.form.id ? 'false' : 'true' }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
