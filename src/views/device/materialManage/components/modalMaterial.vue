<template>
  <el-dialog
    width="1080px"
    :title="'请选择'"
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
              placeholder="编码/名称/规格型号/单位/库存数量/库存数量/平均单价/合价"
              style="width: 260px;"
              suffix-icon="el-icon-search"
            />
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
    <vxe-table
      ref="xTable"
      border
      resizable
      show-overflow
      :data="tableData"
      @checkbox-change="checkboxChangeEvent"
      @checkbox-all="selectAllEvent"
    >
      <vxe-table-column type="checkbox" width="50">
        <!--<template v-slot:header>
          <vxe-button type="text" :disabled="!selectRows.length" @click="clearCheckboxEvent">取消</vxe-button>
        </template>-->
      </vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
      <vxe-table-column field="materialName" title="名称"></vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="materialAmount" title="库存数量"></vxe-table-column>
      <vxe-table-column field="unitPrice" title="平均单价(元)"></vxe-table-column>
      <vxe-table-column field="totalPrice" title="合价(元)">
        <template slot-scope="{ row }">
          <span>{{ row.unitPrice && row.materialAmount ? row.unitPrice * row.materialAmount : 0 }}</span>
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
  name: 'ModalMaterial',
  props: {
    visible: Boolean
  },
  data() {
    return {
      /**
      任务名称：2709/取样单修改
    开发人员：崔洛宜
    日期：2020-03-25
    任务类型：修改逻辑
    **/
      projectId: localStorage.getItem('projectId'),
      form: {
        content: ''
      },
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      baseStatus,
      selectRows: []
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
      /**
      任务名称：2709/取样单修改
      开发人员：崔洛宜
      日期：2020-03-25
      任务类型：修改逻辑
      **/
      Api.getMaterialList({
        ...this.form,
        rows: this.pageSize,
        page: this.currentPage,
        projectId: this.projectId
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
    checkboxChangeEvent({ selection }) {
      this.selectRows = selection
    },
    selectAllEvent({ checked, records }) {
      this.selectRows = records
    },
    clearCheckboxEvent() {
      this.selectRows = []
      this.$refs.xTable.clearCheckboxRow()
    },
    onOk() {
      if (this.selectRows.length > 0) {
        this.$emit('update:visible', false)
        this.$emit('disposeSelectRow', this.selectRows)
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
