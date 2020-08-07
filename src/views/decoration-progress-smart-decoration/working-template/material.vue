<template>
  <section>
    <!-- 甲供材table start -->
    <el-table
      v-if="dataList.length"
      ref="materialTable"
      :data="dataList"
      border
      stripe
      size="small"
      @select="handleSelect"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" align="center" label="序号" />
      <el-table-column prop="code" label="材料编码" min-width="180" />
      <el-table-column prop="name" label="材料名称" min-width="180"> </el-table-column>
      <el-table-column prop="models" label="规格型号" min-width="180"> </el-table-column>
      <!-- <el-table-column prop="unit" label="单位" width="60"> </el-table-column>
      <el-table-column prop="brand" label="品牌" width="180" /> -->
      <el-table-column prop="inventoryNumber" label="库存量" width="100" />
      <el-table-column label="计划用量" align="center" width="150">
        <template slot-scope="scope">
          <el-form v-if="scope.row.checked" :ref="scope.row.id" :model="scope.row" :rules="rules">
            <el-form-item prop="planConsumeNum">
              <el-input v-model.number="scope.row.planConsumeNum" size="mini" placeholder="请输入计划用量"> </el-input>
            </el-form-item>
          </el-form>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    details: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      list: [], //所有的材料列表
      dataList: [],
      total: 0,
      queryForm: {
        projectId: this.$store.state.project.projectId,
        page: 1,
        // rows: this.$pageConfig.pageSize
        rows: 5
      },
      rules: {
        planConsumeNum: [
          {
            required: true,
            message: '请输入计划用量',
            trigger: 'blur'
          }
        ]
      },
      checkedItems: [], //所有选中行的数据
      checkedValue: [] //所有选中行的ID
    }
  },
  watch: {
    details: {
      handler(val) {
        this.checkedValue = this._.map(val, 'materialId')
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    //查询所有的材料列表
    async queryList() {
      let param = this._.cloneDeep(this.queryForm)
      param.rows = 9999
      let result = await this.axios.material.post('/material/list', param)
      let data = result.data.records || []
      this.list = data.map(item => {
        /**
         * 用于编辑时初始化选中项
         * **/
        if (this.checkedValue.includes(item.id)) {
          let itemConsumeInfo = this._.find(this.details, subItem => {
            return subItem.materialId === item.id
          })
          let itemInfo = Object.assign(item, {
            checked: true,
            planConsumeNum: itemConsumeInfo.planConsumeNum
          })
          this.checkedItems.push(itemInfo)
          return itemInfo
        } else {
          return Object.assign(item, {
            checked: false,
            planConsumeNum: null
          })
        }
      })
      this.total = result.data.total || 0
      this.formatterPageData()
    },
    /**
     * 获取当前页的数据
     * 2.如果当前页中包含之前的选中项,设置选中状态并填充计划用量，如果材料没有选中,添加相应字段
     * **/

    formatterPageData() {
      let start = (this.queryForm.page - 1) * this.queryForm.rows
      let end = this.queryForm.page * this.queryForm.rows
      let pageData = this.list.slice(start, end)
      let selected = [] //当前页选中项构成的数组，用于设置行的选中状态
      console.log('选中项', this.checkedItems)
      this.dataList = pageData.map(item => {
        if (this.checkedValue.includes(item.id)) {
          let matchedItem = this._.find(this.checkedItems, subItem => {
            return subItem.id === item.id
          })
          selected.push(matchedItem)
          return matchedItem
        } else {
          return item
        }
      })
      console.log('page', this.dataList)
      this.$nextTick(() => {
        selected.forEach(item => this.$refs.materialTable.toggleRowSelection(item, true))
      })
    },
    // async queryList() {
    //   let param = this._.cloneDeep(this.queryForm)
    //   param.rows = 9999
    //   let result = await this.axios.material.post('/material/list', param)
    //   let data = result.data.records || []
    //   let selected = [] //当前页选中项构成的数组，用于设置行的选中状态
    //   let selectedIDS = []
    //   this.dataList = data.map(item => {
    //     if (this.checkedValue.includes(item.id)) {
    //       let matchedItem = this._.find(this.checkedItems, subItem => {
    //         return subItem.id === item.id
    //       })
    //       selectedIDS.push(item.id)
    //       selected.push(matchedItem)
    //       return matchedItem
    //     } else {
    //       return Object.assign(item, {
    //         checked: false,
    //         planConsumeNum: item.planConsumeNum || null
    //       })
    //     }
    //   })
    //   this.total = result.data.total || 0
    //   this._.remove(this.checkedValue, item => {
    //     return selectedIDS.includes(item)
    //   })
    //   this._.remove(this.checkedItems, item => {
    //     return selectedIDS.includes(item.id)
    //   })
    //   this.$nextTick(() => {
    //     selected.forEach(item => this.$refs.materialTable.toggleRowSelection(item, true))
    //   })
    // },
    /***
     * 选中或取消选中材料-判断是选中操作还是取消选中操作
     * 如果是选中操作，无需处理，当切换分页或点击提交时处理
     * 如果取消，设置checked和planConsumeNum
     * **/
    handleSelect(selection, row) {
      let pageCheckedItem = this._.map(selection, 'id') //操作完成后当前页的选中项id组成的数组
      row.checked = pageCheckedItem.includes(row.id)
      if (!pageCheckedItem.includes(row.id)) {
        row.planConsumeNum = null
      }
    },
    /***
     * 当离开当前页或点击提交时触发
     * 1.验证当前页选中项的的计划用量必填
     * 2.移除之前当前页面的选中项，并添加当前页面新的选中项
     * **/
    handleGetPageCheckedItems() {
      let pageChecked = []
      console.log('')
      this.dataList.forEach(item => {
        if (this.checkedValue.includes(item.id)) {
          this._.remove(this.checkedValue, subItem => {
            return subItem === item.id
          })
          this._.remove(this.checkedItems, subItem => {
            return subItem.id === item.id
          })
        }
        if (item.checked) {
          pageChecked.push(item)
        }
      })
      if (pageChecked.length) {
        pageChecked.forEach(item => {
          this.$refs[item.id].validate((valid, object) => {
            if (valid) {
              this.checkedItems.push(item)
              this.checkedValue.push(item.id)
            } else {
              item.checked = false
              this.$refs.materialTable.toggleRowSelection(item, false)
              this.$message.warning(`【${item.name}】的计划用量未填写，如有需要，请重新选择`)
            }
          })
        })
      }
    },
    // 关闭dialoag
    handleCancel() {
      this.$emit('cancel')
    },
    // 提交数据
    handleSubmit() {
      this.handleGetPageCheckedItems()
      if (this.checkedItems.length === 0) {
        this.$message.warning(`当前没有选中项`)
        return
      }
      let params = this.checkedItems.map(item => {
        return {
          materialId: item.id,
          name: item.name,
          planConsumeNum: item.planConsumeNum,
          raw: item
        }
      })
      // console.log('选中项的长度', this.checkedItems, this.checkedItems.length)
      this.$emit('submit', params)
    },
    // 当前页码改变
    changePageNumber(page) {
      this.handleGetPageCheckedItems()
      // console.log('选中项的长度', this.checkedItems, this.checkedItems.length)
      this.queryForm.page = page
      this.formatterPageData()
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.handleGetPageCheckedItems()
      this.queryForm.page = 1
      this.queryForm.row = pageSize
      this.formatterPageData()
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  /deep/ .cell {
    line-height: 28px;
  }

  /deep/ td,
  /deep/ th {
    padding: 5px 0;
  }

  .el-form-item {
    margin-bottom: 0;

    /deep/ .el-form-item__content,
    /deep/ .el-form-item__label {
      line-height: 28px;
    }
  }
}

.dialog-footer {
  text-align: right;
  margin-top: 15px;
}
</style>
