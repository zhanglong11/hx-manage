<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="filterForm.cateogry" clearable placeholder="模板分类">
            <el-option v-for="item in cateogryList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filterForm.name" style="width: 360px;" placeholder="按模板名称搜索" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="() => $refs.table.reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPower('DecorationProgressAddTemplateSmartDecoration')"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddItem"
          >
            新建模板
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" width="120" align="center" title="序号" />
      <vxe-table-column field="name" title="模板名称" />
      <vxe-table-column field="cateogry" title="模板分类">
        <template slot-scope="scope">
          {{ $getLabelFromArg('templateCategory', scope.row.cateogry) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="sort" title="工序数量">
        <template slot-scope="scope">{{ scope.row.totalProcedureCount || 0 }}</template>
      </vxe-table-column>
      <vxe-table-column field="status" title="模版状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">启用</div>
          <div v-else-if="scope.row.status === 2">停用</div>
          <div v-else-if="scope.row.status === 0">未启用</div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column field="updateTime" title="最近更新时间" />
      <vxe-table-column field="creatorName" title="提交人" />
      <vxe-table-column title="操作" width="280" fixed="right" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 0">
            <el-button
              v-if="$hasPower('DecorationProgressInterleavingSmartDecoration')"
              type="text"
              @click="interleaving(scope.row)"
              >穿插工序</el-button
            >
            <el-button
              v-if="$hasPower('DecorationProgressEditTemplateSmartDecoration')"
              type="text"
              @click="handleEditItem(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-if="$hasPower('DecorationProgressDeleteTemplateSmartDecoration')"
              type="text"
              @click="remove(scope.row)"
              >删除</el-button
            >
          </template>
          <el-button
            v-if="$hasPower('ProgressUpdateStatusTemplateSmartDecoration')"
            type="text"
            @click="updateItemStatus(scope.row)"
          >
            {{ scope.row.status === 1 ? '停用' : '启用' }}
          </el-button>
          <el-button
            v-if="$hasPower('DecorationProgressTemplateDetailSmartDecoration')"
            type="text"
            @click="handleItemView(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('DecorationProgressTemplateCloneSmartDecoration')"
            type="text"
            @click="cloneItem(scope.row.id)"
            >复制</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import { processProgressApi } from '../api/process-progress'
export default {
  name: 'DecorationProgressTemplateListSmartDecoration',
  components: {},
  data() {
    return {
      cateogryList: this.$getArgList('templateCategory'), // 模板分类下拉框数据
      filterForm: {
        projectId: this.$store.state.project.projectId,
        cateogry: '',
        name: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      dataList: [],
      total: 0,
      request: body => {
        return processProgressApi.queryTemplateListWorking(body)
      }
    }
  },
  methods: {
    async refresh() {
      this.$refs.table.refresh()
    },
    // 新建模板
    handleAddItem() {
      this.$router.push({
        name: 'DecorationProgressAddTemplateSmartDecoration'
      })
    },
    // 编辑模板
    handleEditItem(id) {
      this.$router.push({
        name: 'DecorationProgressEditTemplateSmartDecoration',
        query: {
          id
        }
      })
    },
    handleItemView(id) {
      this.$router.push({
        name: 'DecorationProgressTemplateDetailSmartDecoration',
        query: {
          id
        }
      })
    },

    // 穿插工序
    interleaving(data) {
      this.$router.push({
        // path: `/decoration-progress-smart-decoration/interleaving?id=${data.id}&cateogry=${data.cateogry}`
        name: 'DecorationProgressInterleavingSmartDecoration',
        query: {
          id: data.id,
          cateogry: data.cateogry
        }
      })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await processProgressApi.deleteTemplateWorking(row.id)
      this.$message.success('删除成功')
      this.refresh()
    },
    //修改模板的状态信息
    async updateItemStatus(data) {
      let { status, id } = data
      let result
      let res
      if (status === 0) {
        res = await this.$confirm('启用后将不能编辑, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
        if (!res) return
      }
      if (status === 1) {
        result = await processProgressApi.updateTemplateStatusStopWorking(id)
      } else {
        result = await processProgressApi.updateTemplateStatusStartWorking(id)
      }
      this.$message.success('修改成功')
      data.status = status === 1 ? 2 : 1
    },
    // 复制一个模板
    async cloneItem(id) {
      await processProgressApi.copyTemplateWorking(id)
      this.$message.success('保存成功')
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;

  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }

  &.status-2 i {
    background: #999;
  }

  &.status-3 i {
    background: #ff9900;
  }

  &.status-4 i {
    background: #ff0000;
  }
}
</style>
