<template>
  <div>
    <p>
      <span class="value-text"><slot></slot></span><a @click="visible = true">点击选择</a>
    </p>
    <el-dialog top="50px" width="1368px" :visible.sync="visible" title="选择位置、构件">
      <div class="content">
        <div class="tree-wrap">
          <section>
            <h3>单体楼层</h3>
            <TreeData class="scroll-beauty" type="space" @handleCheckChange="singleChange" />
          </section>
          <section>
            <h3>专业构件</h3>
            <TreeData class="scroll-beauty" type="special" @handleCheckChange="specialChange" />
          </section>
        </div>

        <Bim ref="BIM" autoChangeModel hideAll class="bim" idSelect="qualityAcceptance" style="height: 800px;"></Bim>
      </div>
      <footer slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handleBind">确定</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import Bim from '@/components/Bim'
import TreeData from '@/views/model/manage/components/TreeData'
import toFlat from '@/utils/toFlat'
export default {
  name: 'SelectBimComponent',
  components: { Bim, TreeData },
  data() {
    return {
      visible: false,
      selectedFloor: []
    }
  },
  created() {},
  methods: {
    singleChange(checked) {
      this.selectedFloor = checked.filter(f => f.isFloor)
      this.$store.commit('bim/changeSingle', checked)
      this.$refs.BIM.watchModal()
    },
    specialChange(e) {
      this.$store.commit('bim/changeMajor', e)
      this.$refs.BIM.watchModal()
    },
    async handleBind() {
      this.loading = true
      let componentList = await this.$refs.BIM.relevance()
      if (componentList.length === 0) {
        this.loading = false
        return this.$message.error('请先选择构件')
      }
      let guidList = []
      componentList.forEach(item => {
        guidList.push(item.componentId)
      })
      const bindDTOList = _.map(_.groupBy(componentList, 'modelId'), (v, k) => ({
        entityId: k + '_null',
        componentIdList: _.map(v, 'componentId')
      }))
      this.$emit('change', {
        bindDTOList,
        componentIdLength: guidList.length,
        floorNameList: this.selectedFloor.map(e => e.label).join(',')
      })
      this.close()
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.value-text:empty + span {
  margin-right: 15px;
}
.content {
  display: flex;
  .tree-wrap {
    width: 300px;
    padding-right: 15px;
    margin-right: 10px;
    max-height: 800px;
    section {
      height: 50%;
      > .scroll-beauty {
        overflow: auto;
        height: calc(100% - 40px);
      }
    }
  }
  .bim {
    background-color: #00f2;
    flex: 1;
    height: calc(100vh - 340px);
  }
  .selected-list {
    padding-left: 15px;
    width: 260px;
    h6 {
      font-size: 16px;
      color: @main-color;
    }
    li {
      margin-left: 20px;
    }
    h6,
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-right: 10px;
      }
    }
    .el-icon-close {
      cursor: pointer;
      color: #f00;
      font-size: 14px;
      font-weight: bold;
      &:hover {
        transform: scale(1.35);
      }
    }
  }
}
h3 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
