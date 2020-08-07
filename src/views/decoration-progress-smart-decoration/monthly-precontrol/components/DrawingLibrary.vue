<template>
  <div class="wrap">
    <nav>
      <div class="control control-left">
        <i class="prev-year el-icon-d-arrow-left" @click="prevYear"></i>
        <i class="prev-month el-icon-arrow-left" @click="prevMonth"></i>
      </div>
      <h2>{{ year }}年{{ month + 1 }}月</h2>
      <div class="control control-right">
        <i
          class="next-month el-icon-arrow-right"
          :class="{ disabled: year === currentYear && month === currentMonth }"
          @click="nextMonth"
        ></i>
        <i class="next-year el-icon-d-arrow-right" :class="{ disabled: year === currentYear }" @click="nextYear"></i>
      </div>
    </nav>
    <el-tree
      ref="tree"
      show-checkbox
      default-expand-all
      :expand-on-click-node="false"
      :data="treeData"
      @check="handleCheck"
    ></el-tree>
  </div>
</template>

<script>
import treeForEach from '@/utils/treeForEach'

export default {
  name: 'DrawingLibrary',
  data() {
    return {
      treeData: [],
      year: moment().year(),
      month: moment().month(),
      currentYear: moment().year(),
      currentMonth: moment().month(),
      activeNodeIds: []
    }
  },
  computed: {
    beginTime() {
      return moment().year(this.year).month(this.month).startOf('month').format('YYYY-MM-DD')
    },
    endTime() {
      return moment().year(this.year).month(this.month).endOf('month').format('YYYY-MM-DD')
    }
  },
  watch: {
    year() {
      this.refresh()
    },
    month() {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.activeNodeIds = []
      this.handleChange()
      this.axios.working
        .post('working/procedure/schedule/consume/tree', {
          page: 1,
          rows: 10000,
          projectId: localStorage.getItem('projectId'),
          beginTime: this.beginTime,
          endTime: this.endTime
        })
        .then(res => {
          treeForEach(res.data, item => {
            item.label = item.name
            item.value = item.id
          })
          this.treeData = res.data
        })
    },
    async handleCheck(data, { checkedNodes }) {
      this.activeNodeIds = _.map(checkedNodes, 'id')
      this.handleChange()
    },
    handleChange() {
      this.$emit('change', {
        beginTime: this.beginTime,
        endTime: this.endTime,
        ids: this.activeNodeIds.length ? this.activeNodeIds : null
      })
    },
    prevYear() {
      this.year -= 1
    },
    prevMonth() {
      if (this.month === 0) {
        this.year -= 1
        this.month = 11
      } else {
        this.month -= 1
      }
    },
    nextMonth() {
      if (this.month === 11) {
        this.year += 1
        this.month = 0
      } else {
        this.month += 1
      }
    },
    nextYear() {
      this.year += 1
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.wrap {
  background-color: #fff;
  padding: 0 10px;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  .control {
    i {
      color: #0079fe;
      margin: 0 3px;
      cursor: pointer;
      &:hover {
        font-weight: bold;
      }
      &.disabled {
        font-weight: normal;
        color: #777;
        pointer-events: none;
      }
    }
  }
}
</style>
