<template>
  <div class="container">
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="选择单元">
          <el-select v-model="activeProcedureId">
            <el-option v-for="e in procedureList" :key="e.id" :label="e.name" :value="e.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="filterForm.value" placeholder="请选择合格标准">
            <el-option v-for="item in standardList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 200px;" placeholder="请输入">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
      </el-form>
    </div>
    <div class="procedure-status">
      <ul class="procedure-status-list">
        <li v-for="item in measureStatus" :key="item.label">
          <span class="square" :style="{ background: item.color }"></span>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>
    <br />
    <div class="table-list">
      <el-row :gutter="12">
        <el-col v-for="item in tableList" :span="8">
          <el-table
            ref="multipleTable"
            :data="item.tables"
            tooltip-effect="dark"
            :cell-class-name="tableRowClassName"
            max-height="500"
            border
            @cell-click="handleProcedureClick"
          >
            <el-table-column label="1#楼1单元" width="62px" type="index"> </el-table-column>
            <template v-for="col in tableData">
              <el-table-column :key="col.dataItem" :prop="col.dataItem" :label="col.dataName"> </el-table-column>
            </template>
          </el-table>
          <div class="measure-title">测量指标</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import measureStatus from '@/views/project-board-smart-decoration-partyA/lib/measureStatus'
import treeFilter from '@/utils/treeFilter'
import _ from 'lodash'
import toTree from '@/utils/toTree'
import treeForEach from '@/utils/treeForEach'

export default {
  name: 'MeasureQuantityModule',
  data() {
    return {
      filterForm: {},
      procedureList: [],
      activeProcedureId: '',
      measureStatus,
      standardList: [
        {
          value: '1',
          label: '合格标准1'
        },
        {
          value: '2',
          label: '合格标准1'
        }
      ],
      // tableData: [
      //   {
      //     title: '1单元一层'
      //   }
      // ],
      tableList: [
        {
          tables: [
            {
              1: '福兰',
              2: '加芳',
              3: '蒲庙',
              4: '西安'
            },
            {
              1: '南坊',
              2: '礼泉',
              3: '礼泉',
              4: '西安',
              5: '西安',
            },
            {
              1: '马山',
              2: '加芳',
              3: '蒲庙',
              4: '西安'
            }
          ]
        },
        {
          tables: [
            {
              1: '福兰',
              2: '加芳',
              3: '蒲庙',
              4: '西安'
            },
            {
              1: '南坊',
              2: '礼泉',
              3: '礼泉'
            },
            {
              1: '马山',
              2: '加芳',
              3: '蒲庙',
              4: '西安'
            }
          ]
        },
        {
          tables: [
            {
              1: '福兰',
              2: '加芳',
              3: '蒲庙',
              4: '西安'
            },
            {
              1: '南坊',
              2: '礼泉',
              3: '礼泉'
            },
            {
              1: '马山',
              2: '加芳'
            }
          ]
        }
      ],

      tableData: [
        {
          dataItem: '1',
          status: 1
        },
        {
          dataItem: '2',
          // dataName: '02'
          status: 2
        },
        {
          dataItem: '3',
          status: 2
          // dataName: '03'
        },
        {
          dataItem: '4',
          status: 3
          // dataName: '04'
        },
        {
          dataItem: '5',
          status: 2
          // dataName: '05'
        },
        {
          dataItem: '6'
          // dataName: '06'
        }
      ]
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    computedList() {
      const searchProps = ['name', 'mainProcedure', 'floorRule']
      if (this.debounceQ) {
        return treeFilter(this.list, (item, parent) => {
          searchProps.forEach(prop => {
            if (item[prop]) {
              item[prop] = item[prop].replace(
                new RegExp(this.debounceQ, 'gi'),
                // match => `<span class="keyword-lighten">${match}</span>`
                match => `${match}`
              )
            }
          })
          return (
            _.includes(item.name, this.debounceQ) ||
            _.includes(_.get(parent, 'name', ''), this.debounceQ) ||
            _.includes(item.mainProcedure, this.debounceQ)
          )
        })
      } else {
        return this.list
      }
    }
  },
  watch: {
    activeProcedureId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.refresh()
        }
      }
    }
  },
  created() {
    this.getProcedureList()
  },
  methods: {
    async refresh() {
      let res = await this.axios.decoration.get(`working/procedure/floor/schedule/start/list/${this.activeProcedureId}`)
      this.originData = _.cloneDeep(res.data)
      res.data.forEach(e => {
        if (e.volist) {
          e.children = e.volist
        }
      })
      let list = toTree(res.data, 'pid')
      treeForEach(list, (item, parent, index) => {
        if (index !== 0) {
          item.prevStatus = parent.children[index - 1].status
          item.prevActualStartTime = parent.children[index - 1].actualStartTime
        } else {
          item.isFirst = true
        }
      })
      this.list = list
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getProcedureList() {
      this.axios.decoration
        .post(`working/procedure/config/list`, {
          page: 1,
          rows: 1000,
          status: 1,
          projectId: localStorage.getItem('projectId')
        })
        .then(res => {
          if (!this.activeProcedureId && res.data.records.length) {
            this.activeProcedureId = _.first(res.data.records).id
          }
          this.procedureList = res.data.records
        })
    },
    reset() {},
    tableRowClassName({ row, rowIndex }) {},
    //  单击每个单元格触发
    handleProcedureClick() {
      this.procedureVisible = true
    }
  }
}
</script>

<style scoped lang="less">
.procedure-status {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 100px;
  .procedure-status-list {
    display: flex;
    li {
      padding: 0 5px;
      display: flex;
      align-items: center;
    }
    .square {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 1px solid #ccc;
      background: #ccc;
      margin-right: 3px;
    }
  }
}
.table-list {
  table {
    border-color: #f5f5f5;
    width: 30%;
    tr {
      td {
        padding: 5px 10px;
      }
    }
  }
}
/deep/ .el-table {
  .el-table__body {
    tbody {
      .red_row {
        background: #f56c6c;
      }
      .yellow_row {
        background: #daf56c;
      }
    }
  }
}
.measure-title {
  margin-top: 15px;
  text-align: center;
}
</style>
