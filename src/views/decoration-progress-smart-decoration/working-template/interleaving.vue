<template>
  <div class="container is-footer">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.q" style="width: 360px;" placeholder="输入施工阶段/工序名称搜索" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="filterForm.q = ''">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-dropdown>
            <el-button type="primary" icon="el-icon-plus">
              添加工序<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu v-if="$hasPower('DecorationProgressAddInterleavingSmartDecoration')" slot="dropdown">
              <el-dropdown-item @click.native="addItem">
                {{ total === 0 ? '添加初始工序' : '添加工序' }}
              </el-dropdown-item>
              <el-dropdown-item @click.native="addMilepostItem">添加里程碑工序</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 end -->
    <!-- 模板分类 start -->
    <div class="u-tab">
      <div class="u-tab-item">{{ $getLabelFromArg('templateCategory', cateogry) }}</div>
    </div>

    <!-- 模板分类 end -->
    <vxe-table ref="table" :data="computedList">
      <vxe-table-column type="seq" width="60" align="center" title="序号" />
      <vxe-table-column type="html" field="floorRule" title="工序规则" />
      <vxe-table-column type="html" field="constructStage" title="施工阶段"> </vxe-table-column>
      <vxe-table-column type="html" field="mainProcedure" title="工序名称" />
      <vxe-table-column field="duration" title="工期(天)" />
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column title="操作" width="260" fixed="right" align="center">
        <template v-slot="{ row, $rowIndex }">
          <el-button
            v-if="$hasPower('DecorationProgressEditInterleavingSmartDecoration')"
            type="text"
            size="mini"
            @click="editItem(row.id)"
            >编辑</el-button
          >
          <template v-if="$hasPower('DecorationProgressEditFloorRuleSmartDecoration')">
            <el-button
              type="text"
              size="mini"
              :disabled="$rowIndex === 0"
              @click="swapWorking(row.id, list[$rowIndex - 1].id) || list.length === 0"
              >上移</el-button
            >
            <el-button
              type="text"
              size="mini"
              :disabled="$rowIndex === list.length - 1 || list.length === 0"
              @click="swapWorking(row.id, list[$rowIndex + 1].id)"
              >下移</el-button
            >
          </template>
          <el-button
            v-if="$hasPower('ProgressDeleteInterleavingSmartDecoration')"
            type="text"
            size="mini"
            @click="deleteItem(row.id)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>

    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { processProgressApi } from '../api/process-progress'
import treeFilter from '@/utils/treeFilter'
import _ from 'lodash'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DecorationProgressInterleavingSmartDecoration',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      cateogry: this.$route.query.cateogry,
      cateogryList: this.$getArgList('templateCategory'), // 模板分类下拉框数据
      filterForm: {
        q: ''
      },
      list: []
    }
  },
  computed: {
    total() {
      return this.list.length
    },
    computedList() {
      let result = this.list
      if (this.filterForm.q) {
        const searchProps = ['floorRule', 'constructStage', 'mainProcedure']
        result = treeFilter(this.list, (item, parent) => {
          searchProps.forEach(prop => {
            if (item[prop]) {
              item[prop] = item[prop].replace(
                new RegExp(this.filterForm.q, 'gi'),
                match => `<span class="keyword-lighten">${match}</span>`
              )
            }
          })
          return (
            _.includes(item.name, this.filterForm.q) ||
            _.includes(_.get(parent, 'name', ''), this.filterForm.q) ||
            _.includes(item.mainProcedure, this.filterForm.q)
          )
        })
      }
      return result
    }
  },
  created() {
    this.refresh()
  },

  methods: {
    async refresh() {
      processProgressApi
        .queryListWorking({
          page: 1,
          rows: 1000,
          templateId: this.$route.query.id
        })
        .then(res => {
          this.list = res.data.records
        })
    },
    // 添加工序
    addItem() {
      const floorRule = this.total === 0 ? 'N' : `N-${this.total}`
      this.$router.push({
        name: 'DecorationProgressAddInterleavingSmartDecoration',
        query: {
          templateId: this.id,
          floorRule,
          milestone: 0
        }
      })
    },
    // 添加里程碑工序
    addMilepostItem() {
      const floorRule = this.total === 0 ? 'N' : `N-${this.total}`
      // 里程碑字段名称
      this.$router.push({
        name: 'DecorationProgressAddInterleavingSmartDecoration',
        query: {
          templateId: this.id,
          floorRule,
          milestone: 1
        }
      })
    },
    // 编辑工序
    editItem(id) {
      this.$router.push({
        // path: `/decoration-progress-smart-decoration/edit-interleaving?id=${id}`
        name: 'DecorationProgressEditInterleavingSmartDecoration',
        query: {
          id
        }
      })
    },
    // 上移 / 下移
    async swapWorking(source, target) {
      await processProgressApi.swapWorking(source, target)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.refresh()
    },
    // 删除工序
    deleteItem(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItemSuccess(id)
        })
        .catch(() => {})
    },
    // 删除工序 - 异步
    async deleteItemSuccess(id) {
      await processProgressApi.deleteWorking(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../../styles/color.less'); //引入公共css类

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

.u-tab {
  margin-bottom: 15px;
  border-bottom: solid 2px #e4e7ed;
  padding: 0 20px;
  .u-tab-item {
    padding: 0 20px;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: @main-color;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;

      background-color: @main-color;
      bottom: -2px;
      z-index: 5;
    }
  }
}
</style>
