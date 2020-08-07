<template>
  <div class="container no-padding">
    <el-row :gutter="20">
      <el-col :md="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix details-header">
            <span class="details-title">所有分组</span>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem(true)">新增分组</el-button>
          </div>
          <ul class="group">
            <li v-for="item in groupList" :key="item.id" @click="viewGroup(item)">
              <span class="label">{{ item.argText }}</span>
              <el-button type="text" size="mini" @click="editItem(item, true)">编辑</el-button>
              <el-button v-if="groupList.length > 1" type="text" size="mini" @click="deleteItem(item.id, true)"
                >删除</el-button
              >
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :md="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix details-header">
            <span class="details-title current-group">
              <span class="label">当前分组：</span>
              {{ currentGroup.argText }}
            </span>
          </div>
          <!-- 工具栏 start -->
          <div class="tooltips">
            <el-form inline>
              <el-form-item>
                <el-input v-model="queryForm.argText" placeholder="参数值" />
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                  <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
                </el-button-group>
              </el-form-item>
              <el-form-item>
                <el-button v-if="groupList.length > 0" type="primary" icon="el-icon-plus" @click="addItem()"
                  >新增参数</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <!-- 工具栏 end -->
          <el-table :data="dataList" border stripe size="small">
            <el-table-column type="index" width="120" align="center" label="序号" />
            <el-table-column prop="argText" label="参数值" min-width="140" />
            <el-table-column prop="argGroupText" label="参数分组" min-width="140" />
            <el-table-column prop="module" label="模块" min-width="140" />
            <el-table-column prop="updateTime" label="最近更新时间" min-width="140" />
            <el-table-column prop="creatorName" label="提交人" min-width="140" />
            <el-table-column label="操作" width="160" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="editItem(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <p class="total">
              共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }}
              <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
            </p>
            <el-pagination
              background
              layout="sizes, prev, pager, next, jumper"
              :total="total"
              :current-page="queryForm.page"
              :page-size="queryForm.rows"
              :page-sizes="$pageConfig.pageSizes"
              @size-change="changePageSize"
              @current-change="changePageNumber"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <AddConfig
      v-model="modalStatus"
      :modalTitle="modalTitle"
      :modalData="modalData"
      :isGroup="isGroup"
      @onClose="modalStatus = false"
      @onChange="search"
    />
  </div>
</template>

<script>
/**
  任务名称：【智慧工地2.0-前端】系统参数模块切图及功能开发
  开发人员：耿为刚
  日期：2020-04-02
  任务类型：全新代码
**/
/**
  任务名称：task#2869 【智慧工地2.0-前端】系统参数模块切图及功能开发
  开发人员：耿为刚
  日期：2020-04-04
**/
import { systemConfigApi } from './api/system-config'
import AddConfig from './components/add-config'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ConfigList',
  components: {
    AddConfig
  },
  data() {
    // 这里存放数据
    return {
      modalStatus: false,
      modalTitle: '新增参数',
      modalData: {},
      queryForm: {
        // 查询条件
        argCode: '',
        argGroup: '',
        argFlag: 0,
        argText: '',
        module: '',
        page: 1,
        rows: this.$pageConfig.pageSize,
        projectId: this.$store.state.project.projectId
      },
      queryFormBack: {},
      dataList: [],
      total: 0,
      currentGroup: {}, // 当前选中的分组
      isGroup: false,
      groupForm: {
        argFlag: 1,
        page: 1,
        rows: 200,
        projectId: this.$store.state.project.projectId
      },
      groupList: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryGroupList()
  },
  // 方法集合
  methods: {
    // 查询分组数据
    queryGroupList() {
      this.queryList(true)
    },
    // 查看分组下数据
    viewGroup(item) {
      this.queryForm.argGroup = item.argGroup
      this.currentGroup = Object.assign({}, item)
      Object.assign(this.queryFormBack, this.queryForm)
      this.queryList()
    },
    // 查询列表
    async queryList(group = false) {
      const result = await systemConfigApi.queryListArg(group ? this.groupForm : this.queryForm)
      const datas = result.data
      const list = datas.records || []
      if (group) {
        // 查询分组
        this.groupList = list
        if (list.length > 0) {
          this.viewGroup(list[0])
        }
      } else {
        // 查询分组下数据
        this.total = datas.total
        list.forEach(e => {
          let groupBelongsTo = _.find(this.groupList, { argCode: e.argGroup })
          if (groupBelongsTo) {
            e.argGroupText = groupBelongsTo.argText
          }
        })
        this.dataList = list
      }
    },
    // 搜索
    search(group = false) {
      this.queryForm.page = 1
      this.queryList(group)
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.pageNumber = pageNumber
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.pageNumber = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 新增 分组/参数
    addItem(isGroup) {
      this.modalTitle = isGroup ? '新增分组' : '新增参数'
      this.isGroup = isGroup
      if (!isGroup) {
        this.modalData.parentId = this.currentGroup.id
        this.modalData.argGroup = this.currentGroup.argGroup
      } else {
        this.modalData.parentId = 0
        this.modalData.argGroup = ''
      }
      this.modalData.argText = ''
      this.modalData.argCode = ''
      this.modalData.field = ''
      this.modalStatus = true
      this.modalData.id = ''
    },
    // 编辑 分组/参数
    editItem(item, isGroup) {
      this.modalTitle = isGroup ? '编辑分组' : '编辑参数'
      this.isGroup = isGroup
      this.modalStatus = true
      this.modalData = Object.assign({}, item)
    },
    // 报错参数回调事件
    changeModel() {
      this.modalStatus = false
      this.search()
    },
    // 删除 分组/参数
    deleteItem(id, isGroup) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItemSuccess(id, isGroup)
        })
        .catch(() => {})
    },
    // 删除参数 - 异步
    async deleteItemSuccess(id, isGroup = false) {
      await systemConfigApi.deleteArg(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search(isGroup)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@import url('../../styles/color.less');
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
    background: @sub-base-color;
  }
  &.status-3 i {
    background: #ff9900;
  }
  &.status-4 i {
    background: #ff0000;
  }
}
.group {
  li {
    font-size: 14px;
    display: flex;
    align-items: center;
    height: 40px;
    border-bottom: 1px @line solid;
    cursor: pointer;
    .label {
      flex: 1;
    }
    &:hover {
      color: @main-color;
    }
    &:last-child {
      border: 0;
    }
  }
}
.current-group {
  font-size: 18px !important;
  .label {
    font-size: 14px;
  }
}
</style>
