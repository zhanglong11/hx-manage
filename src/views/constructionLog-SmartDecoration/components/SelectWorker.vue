<template>
  <TreeSelect
    :value="value"
    :options="treeData"
    label="name"
    :multiple="multiple"
    :valueFormat="valueFormat"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    :disabled="disabled || (elForm || {}).disabled"
    placeholder="请选择"
    disable-branch-nodes
    @close="
      val => {
        $emit('close', val)
      }
    "
    @select="
      node => {
        if (!multiple) {
          $emit('update:id', node.id)
          $emit('update:name', node.label)
          $emit('update:departId', node.organId)
          $emit('update:departName', node.organName)
          $emit('update:mobile', node.mobile)
          $emit('change', node)
        }
      }
    "
    @input="
      val => {
        $emit('input', val)
        if (multiple) {
          $emit('update:id', val && val.map(item => item.id).join(','))
          $emit('update:name', val && val.map(item => item.label).join(','))
        }
      }
    "
  />
</template>

<script>
export default {
  name: 'SelectWorker',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    },
    appendToBody: {
      default: true
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    value: [String, Number, Array, Object],
    disabled: {
      type: Boolean,
      default: false
    },
    valueFormat: {
      type: String,
      default: 'object',
      enum: ['id', 'object']
    },
    workTypeId: {
      type: String
    },
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  watch: {
    workTypeId(val) {
      if (val) {
        this.getList(val)
      }
    }
  },
  created() {
    if (!this.workTypeId) {
      this.$message.info('请先选择工种')
    }
  },
  methods: {
    getList(workType) {
      this.axios.labour
        .post('employee/list', {
          projectId: localStorage.getItem('projectId'),
          jobStatus: 'jobStatus_1',
          workType: workType
        })
        .then(res => {
          res.data.records.forEach(e => {
            e.label = e.name
            e.id = e.id
          })
          this.treeData = res.data.records
        })
    }
  }
}
</script>
<style lang="less">
.vue-treeselect {
  display: inline-block;
  width: 100%;
  font-size: unset;
}
.el-form--inline {
  .vue-treeselect {
    width: 215px;
  }
}
</style>
