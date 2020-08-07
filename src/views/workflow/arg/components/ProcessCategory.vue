<template>
  <div class="main">
    <el-tree
      :expand-on-click-node="false"
      node-key="id"
      highlight-current
      :data="list"
      @node-click="handleNodeClick"
    ></el-tree>
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="60px">
      <el-form-item label="名称" prop="argText">
        <el-input v-model="form.argText"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="argCode" :disabled="form.id">
        <el-input v-model="form.argCode"></el-input>
      </el-form-item>
      <el-form-item label="父级" prop="pid">
        <SelectProcessCategory
          v-model="form.pid"
          :list="list"
          valueKey="id"
          appendToBody
          :disable-keys="[form.id]"
        ></SelectProcessCategory>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button v-if="form.id" size="mini" type="danger" @click="remove">删除</el-button>
        <el-button size="mini" type="primary" @click="submit">{{ form.id ? '保存' : '新建' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import toTree from '@/utils/toTree'
import treeForEach from '@/utils/treeForEach'
import SelectProcessCategory from '../../components/SelectProcessCategory'
export default {
  name: 'ProcessCategory',
  components: { SelectProcessCategory },
  props: {
    argGroup: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {},
      rules: {
        argText: { required: true, message: '必填' },
        argCode: { required: true, message: '必填' }
      }
    }
  },
  computed: {
    list() {
      return treeForEach(this.$store.state.workflow.processCategoryTree, e => {
        e.label = e.argText
        e.value = e.id
      })
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      // this.$store.dispatch('workflow/getProcessCategory')
    },
    async submit() {
      await this.$refs.form.validate()
      await this.axios.workflow
        .post('activiti/process/type/add', { ...this.form, argGroup: this.argGroup })
        .then(() => {
          this.$message.success(this.form.id ? '保存成功' : '创建')
        })
      this.refresh()
    },
    remove() {
      this.$remove([this.form]).then(async () => {
        await this.axios.workflow
          .get('activiti/process/type/delete/' + this.form.id)
          .then(res => this.$message.success('删除成功'))
        this.refresh()
        this.form = {}
        this.$refs.form.resetFields()
      })
    },
    handleNodeClick(data, node) {
      if (this.form.id === data.id) {
        this.form = {}
        node.isCurrent = false
        this.$refs.form.resetFields()
      } else {
        this.form = _.cloneDeep(data)
      }
    }
  }
}
</script>

<style scoped lang="less">
.main {
  display: flex;
  .el-tree {
    width: 200px;
    margin-right: 25px;
    /deep/ .el-tree-node.is-current > div:first-child {
      background-color: lighten(#5a92ff, 5%);
      color: #fff;
    }
  }
  .el-form {
    width: 300px;
  }
}
</style>
