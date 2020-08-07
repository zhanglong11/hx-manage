<template>
  <el-steps :active="activeIndex" align-center status="success" success class="detail-icon">
    <el-step v-for="(item, index) of list" :key="'item' + index" icon="el-icon-upload">
      <div slot="icon">
        <span :class="['stepIcon', index < activeIndex ? 'isFinish' : '']"></span>
      </div>
      <div slot="title">{{ item.name }}</div>
      <div v-if="index > 0" slot="description">
        <p class="desc"><span class="label">审核结果</span>{{ $getLabel(auditStatus, item.auditStatus) }}</p>
        <p class="desc"><span class="label">审核时间</span>{{ item.aduitTime }}</p>
        <p class="desc"><span class="label">审核意见</span>{{ item.auditOpinion }}</p>
        <p class="desc"><span class="label">附件</span> <FileList :ids="item.auditFileId" /></p>
      </div>
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: 'Step',
  props: {
    info: {
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      activeIndex: 1,
      auditStatus: [
        { label: '通过', value: 2 },
        { label: '驳回', value: 3 }
      ]
    }
  },
  computed: {
    list() {
      return [{ name: '发起人' }, this.info]
    }
  },
  watch: {
    info(v) {
      console.log(v)
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.detail-icon {
  /deep/ .el-step__icon.is-icon {
    width: 10px;
  }

  /deep/ .desc {
    display: flex;
    justify-content: center;
    color: #8d8d8d;
    margin-bottom: 10px;
    line-height: 20px;
    .label {
      display: inline-block;
      width: 60px;
      margin-right: 10px;
      text-align: right;
    }
  }
}

.stepIcon {
  display: block;
  width: 10px;
  height: 10px;
  background: #e9e9e9;
  border-radius: 5px;

  &.isFinish {
    background: #1890ff;
  }
}

.el-step__icon {
  width: 10px !important;
  height: 10px;
  margin-top: 7px;
}
</style>
