<template>
  <el-dialog
    width="1200px"
    :title="'选择领料单'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <el-form ref="form" :model="form" :inline="true">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="content">
            <el-input
              v-model="form.content"
              placeholder="领料单编号/领料单位/领料人/创建人"
              style="width: 260px;"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="领料日期" prop="checkTime">
            <el-date-picker
              v-model="form.checkTime"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 220px;"
              value-format="yyyy-MM-dd 00:00:00"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              style="width: 220px;"
              value-format="yyyy-MM-dd 00:00:00"
            ></el-date-picker>
          </el-form-item>
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>
    <!--
    /**
    任务名称：2709/取样单修改
    开发人员：崔洛宜
    日期：2020-03-25
    任务类型：修改逻辑
    **/
-->
    <vxe-table ref="xTable" border resizable show-overflow :data="tableData" @radio-change="radioChangeEvent">
      <vxe-table-column type="radio" width="50"> </vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="receiveBillCode" title="领料单编号"></vxe-table-column>
      <vxe-table-column field="receiveOrganName" title="领料单位"></vxe-table-column>
      <vxe-table-column field="receiverName" title="领料人"></vxe-table-column>
      <vxe-table-column field="receiveTime" title="领料日期"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template slot-scope="{ row }">
          <span>{{
            row.status !== null && row.status !== undefined
              ? baseStatus.filter(item => item.value === row.status)[0].label
              : ''
          }}</span>
        </template>
      </vxe-table-column>
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

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/device/material/pickOrder'
import baseStatus from '@/lib/basicStatus'
export default {
  name: 'ModalPickOrder',
  props: {
    visible: Boolean
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {
        content: '',
        checkTime: [],
        createTime: []
      },
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectRow: null,
      baseStatus
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
      Api.getList({
        ...this.form,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId,
        receiveBeginTime: this.form.checkTime[0],
        receiveEndTime: this.form.checkTime[1],
        createBeginTime: this.form.createTime[0],
        createEndTime: this.form.createTime[1]
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh(true)
    },
    radioChangeEvent({ row }) {
      this.selectRow = row
    },
    onOk() {
      if (this.selectRow) {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRow)
      } else {
        this.$message.error('请选择一条记录，再做该操作')
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.refresh()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
