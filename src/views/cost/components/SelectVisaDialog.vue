<template>
  <el-dialog title="选择签证" :visible="visible" width="1400px" top="10px" @close="$emit('close')">
    <div class="contentWrapper">
      <div class="headContainer">
        <div class="formWrapper">
          <el-form ref="form" :inline="true" :model="filter">
            <div>
              <el-form-item label="" label-width="0" prop="keyword" style="margin-right: 20px;">
                <el-input
                  v-model="filter.keyword"
                  placeholder="现场签证编号/现场签证名称/合同编号/创建人"
                  style="width: 250px;"
                >
                  <i slot="suffix" class="el-icon-search"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="filter.createTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="请选择"
                  end-placeholder="请选择"
                  style="width: 400px;"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="现场签证状态" label-width="120px" prop="status">
                <BasicStatusSelect v-model="filter.status"></BasicStatusSelect>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
                <el-button @click="$refs.form.resetFields()">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="tableWrapper">
        <vxe-table ref="xTable" border :data="tableData" @radio-change="radioChangeEvent">
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column type="radio" width="60"></vxe-table-column>
          <vxe-table-column field="accessNumber" title="现场签证编号" />
          <vxe-table-column field="accessName" title="现场签证名称" />
          <vxe-table-column field="place" title="部位" />
          <vxe-table-column field="accessDate" title="日期" />
          <vxe-table-column field="accessReason" title="签证原因" />
          <vxe-table-column field="contractCode" title="合同编号" />
          <vxe-table-column field="status" title="现场签证状态">
            <template slot-scope="{ row }">
              <span>{{
                row.status !== null && row.status !== undefined
                  ? sceneVisaStatus.filter(item => item.value === row.status)[0].label
                  : ''
              }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="creatorName" title="创建人" />
          <vxe-table-column field="createTime" title="创建时间" />
        </vxe-table>
        <div style="margin-top: 10px;">
          <div class="toolbar" style="display: flex; justify-content: space-between;">
            <div class="num">
              共 {{ total }} 条记录 第 {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }} 页
              <el-button type="text primary" class="el-icon-refresh" @click="refresh(false)"></el-button>
            </div>
            <el-pagination
              class="pagination"
              :total="total"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="sizes, prev, pager, next, jumper"
              @current-change="handlePageChange"
              @size-change="handlePageSizeChange"
            />
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import sceneVisaStatus from '@/lib/basicStatus'
import Api from '@/api/contract/sceneVisa'
export default {
  name: 'SelectVisaDialog',
  props: ['visible'],
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      selectRow: null,
      filter: {
        keyword: '',
        status: '',
        createTime: []
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      sceneVisaStatus: sceneVisaStatus
    }
  },
  created() {
    this.refresh(true)
  },
  methods: {
    refresh(isFirstPage) {
      if (isFirstPage) {
        this.currentPage = 1
      }
      Api.getSceneVisaList({
        ...this.filter,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        createStartTime: this.filter.createTime[0] || '',
        createEndTime: this.filter.createTime[1] || ''
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh(true)
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh(true)
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    handleSubmit() {
      if (this.selectRow) {
        this.$emit('submit', this.selectRow)
      } else {
        this.$message.error('请选择一个签证')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
