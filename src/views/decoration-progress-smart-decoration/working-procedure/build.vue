<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :md="14">
        <el-card class="box-card aside">
          <div>
            <div class="treeView">
              <el-input
                v-model="filterName"
                placeholder="请输入"
                style="width: 180px; margin-right: 10px;"
                @keyup="searchEvent"
              >
              </el-input>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </div>

            <vxe-table
              ref="xTree"
              resizable
              keep-source
              row-id="id"
              :radio-config="{
                labelField: 'label',
                showHeader: false,
                checkStrictly: true,
                checkMethod: checkMethod
              }"
              :tree-config="treeConfig"
              :edit-config="{ trigger: 'click', mode: 'row', showStatus: true, expandAll: true }"
              :data="tableData"
              @cell-dblclick="handleEditNode"
              @radio-change="handleRadioChange"
            >
              <vxe-table-column
                type="radio"
                title="建筑结构"
                tree-node
                field="label"
                :edit-render="{ name: '$input' }"
              ></vxe-table-column>
              <vxe-table-column field="drawingName" title="关联图纸">
                <template v-slot="{ row }">
                  <a href="javascript:void(0);" @click="lookImg(row)">{{ row.drawingName }}</a>
                </template>
              </vxe-table-column>
              <vxe-table-column field="mode" title="关联BIM模型"></vxe-table-column>
            </vxe-table>
          </div>
        </el-card>
      </el-col>
      <el-col :md="10">
        <el-image style="width: 100%; height: 600px;" :src="DrawImgUrl" :fit="fit"></el-image>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/views/measureQuantity/api/measure'
import XEUtils from 'xe-utils'
import _ from 'lodash'
import treeForEach from '@/utils/treeForEach'

export default {
  name: 'BuildListSmartDecoration',
  props: {
    entityId: {
      type: String,
      default: ''
    }
  },
  data() {
    // 这里存放数据
    return {
      treeConfig: {
        children: 'children'
      },
      filterName: '',
      /*图纸列表*/
      tableData: [],
      fit: 'fill',
      DrawImgUrl: '@/assets/images/empty.png',
      loading: false,
      checkAll: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      originData: [],
      form: {
        count: '',
        pid: '0',
        type: 0,
        underCount: '',
        projectId: localStorage.getItem('projectId')
      },

      // type: '',
      projectId: localStorage.getItem('projectId'),
      drawId: '',
      //所选中图纸的id
      drawIds: '',
      fileList: '',
      expandRows: ''
    }
  },
  watch: {
    entityId(val) {
      console.log('watch')
      this.handleSetRowSelected()
    }
  },
  created() {
    console.log('build created')
    this.init()
    // this.findList().then(data => {
    //   this.originData = data
    //   this.handleSearch()
    // })
  },
  methods: {
    init() {
      this.getTreeListInfo()
    },
    /*单体树形结构列表*/
    async getTreeListInfo() {
      this.loading = true
      let res = await Api.getTreeListInfo(this.projectId).finally(() => {
        this.loading = false
      })
      treeForEach(res.data, (item, parent) => {
        if (item.type === 3) {
          item.parentName = parent.label
        }
      })
      this.tableData = res.data || []
      let name = localStorage.getItem('projectName')
      this.tableData = [
        {
          label: name,
          children: this.tableData
        }
      ]
      this.originData = _.cloneDeep(this.tableData)
      // 设置单体项展开
      let expandRowKeys = [this.tableData[0]]
      console.log(this.tableData)
      // this.tableData[0].children.forEach(item => {
      //   expandRowKeys.push(item)
      // })

      this.$nextTick(() => {
        this.$refs.xTree.setTreeExpansion(expandRowKeys, true)
      })
      this.handleSetRowSelected()
    },
    // checkboxConfig配置参数，用来设置这一行的 checkbox 是否可以勾选
    checkMethod({ row }) {
      return row.type === 3 && row.isBind === false
    },
    // 设置默认选中项
    handleSetRowSelected() {
      if (this.entityId && this.tableData) {
        let entityList = (this.tableData[0] && this.tableData[0].children) || []
        let selectedRow = _.find(entityList, { id: this.entityId })
        console.log('设置默认选中项', selectedRow)
        this.$refs.xTree.setRadioRow(selectedRow)
      }
    },
    //取消关闭dialog
    handleCancel() {
      this.$emit('cancel')
    },
    //提交选中项
    handleSubmit() {
      let selectedItem = this.$refs.xTree.getRadioRecord()
      if (!selectedItem) {
        this.$message.warning('您当前没有选中项')
        return
      }
      this.$emit('submit', {
        id: selectedItem.id,
        name: selectedItem.parentName + '-' + selectedItem.label
      })
    },
    handleRadioChange({ row }) {
      this.lookImg(row)
    },
    /*过滤树形结构数据查询*/
    // findList() {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       Api.getTreeListInfo(this.projectId).then(res => {
    //         let list = res.data || []
    //         let name = localStorage.getItem('projectName')
    //         list = [
    //           {
    //             label: name,
    //             children: list
    //           }
    //         ]
    //         resolve(list)
    //       })
    //     }, 300)
    //   })
    // },
    handleSearch() {
      // console.log(this.originData)
      let filterName = XEUtils.toString(this.filterName).trim()
      if (filterName) {
        let options = {
          children: 'children'
        }
        let searchProps = ['label']
        this.tableData = XEUtils.searchTree(
          this.originData,
          item => {
            if (searchProps.some(key => XEUtils.toString(item[key]).indexOf(filterName) > -1)) {
              return item
            }
          },
          options
        )
        this.treeConfig.expandRowKeys = []
        this.tableData.forEach(item => {
          if (item.type !== 2) return
          this.treeConfig.expandRowKeys.push(item.id)
        })
        // console.log(this.tableData)
        // 搜索之后默认全部展开子节点
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true)
        })
        this.handleSetRowSelected()
      } else {
        this.tableData = this.originData
      }
    },
    // 创建一个防反跳策略函数，调用频率间隔 500 毫秒
    searchEvent: XEUtils.debounce(
      function () {
        this.handleSearch()
      },
      500,
      {
        leading: false,
        trailing: true
      }
    ),

    lookImg(row) {
      // console.log(row)
      this.DrawImgUrl = row.drawingUrl
    },

    reset() {
      this.filterName = ''
      this.$refs.xTree.setFilter('')
      this.init()
    },

    /*双击编辑节点*/
    handleEditNode(data, node) {
      this.open(data.row)
    },
    open(value) {
      this.$prompt('请输入节点的名字', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value.label,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let param = {
              ids: [value.id],
              name: instance.inputValue
            }
            /*修改节点图纸节点名称*/
            Api.getDrawingLibraryUpdate(param).then(res => {
              if (res.code === 200) {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '提交中...'
                setTimeout(() => {
                  done()
                  setTimeout(() => {
                    instance.confirmButtonLoading = false
                    this.init()
                  }, 300)
                }, 2000)
              }
            })
          } else {
            done()
          }
        }
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: '节点的名字: ' + value
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .treeView {
    margin-bottom: 15px;
  }

  .buttons {
    margin: 10px 0;
  }

  .headerBox {
    display: flex;
    justify-content: space-between;
  }
}
</style>
