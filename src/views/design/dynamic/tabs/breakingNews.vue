<!--
 * @Description: 项目大事记
 * @Author: 
 * @Date: 2020-01-19 08:58:04
 -->
<template>
  <div>
    <div class="form">
      <el-form ref="pageQuery" :model="pageQuery" label-width="100px">
        <el-row :gutter="3">
          <el-col :span="6">
            <el-form-item label="标题" prop="title">
              <el-input v-model="pageQuery.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button v-access="'project-bigNews-search'" type="primary" icon="el-icon-search" @click="search"
                >查询</el-button
              >
              <el-button v-access="'project-bigNews-search'" icon="el-icon-refresh-right" @click="reset"
                >重置</el-button
              >
              <el-button v-access="'project-bigNews-created'" type="primary" @click="add">新建大事记</el-button>
              <el-button v-access="'project-bigNews-preview'" type="primary" @click="preview">大事记预览</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <Table
      ref="table"
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      rowId="id"
      :columns="tableColumn"
      @selectionChange="selectionChange"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    />
    <el-dialog :visible.sync="newsVisible" width="60%">
      <p class="news-title">{{ newsContent.title }}</p>
      <div class="news-content" v-html="newsContent.content"></div>
    </el-dialog>
  </div>
</template>
<script>
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/design/dynamic'
export default {
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: { projectId: localStorage.getItem('projectId'), title: '' },
      tableColumn: [
        { prop: 'createTime', label: '时间' },
        { prop: 'creatorName', label: '发布人' },
        { prop: 'title', label: '标题' },
        {
          prop: 'handle',
          label: '操作',
          render: (h, { row }) => {
            return h('div', [
              h(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  directives: [
                    {
                      name: 'access',
                      value: 'project-bigNews-details'
                    }
                  ],
                  on: {
                    click: e => {
                      e.stopPropagation()
                      this.getDetails(row.id)
                    }
                  }
                },
                '详情'
              ),
              h(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  directives: [
                    {
                      name: 'access',
                      value: 'project-bigNews-edit'
                    }
                  ],
                  on: {
                    click: e => {
                      e.stopPropagation()
                      this.edit(row.id)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  directives: [
                    {
                      name: 'access',
                      value: 'project-bigNews-delete'
                    }
                  ],
                  on: {
                    click: e => {
                      e.stopPropagation()
                      this.$confirm('是否要删除此大事记', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        this.deleteSure(row.id)
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      request: api.getBreakList,
      newsContent: {},
      newsVisible: false
    }
  },
  methods: {
    preview() {
      if (this.tableData.length === 0) return this.$message.error('尚没有大事记')
      this.$router.push({ name: 'BreakingNewPreview' })
    },
    add() {
      this.$router.push({ name: 'BreakingNew' })
    },
    async getDetails(id) {
      let res = await api.breakingNewsDetails(id)
      this.newsContent = res.data
      this.newsVisible = true
    },
    edit(id) {
      this.$router.push({
        name: 'BreakingNew',
        query: {
          id: id
        }
      })
    },
    async deleteSure(id) {
      let res = await api.deleteBreak(id)
      this.$message.success('删除成功')
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
.news-title {
  text-align: center;
  font-size: 23px;
  font-weight: 800;
}
.news-content {
  max-height: 400px;
}
</style>
