<template>
  <div class="main">
    <el-tree node-key="id" highlight-current :data="treeData" @node-click="handleNodeClick"> </el-tree>
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="60px">
      <el-form-item label="名称" prop="groupName">
        <el-input v-model="form.groupName"></el-input>
      </el-form-item>
      <el-form-item label="父级" prop="pid">
        <el-cascader v-model="form.pid" :props="{ emitPath: false }" :options="list"></el-cascader>
      </el-form-item>
      <el-form-item label="code" prop="groupCode">
        <el-input v-model="form.groupCode"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button v-if="form.id" type="danger">删除</el-button>
        <el-button type="primary" @click="submit">{{ form.id ? '保存' : '新建' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import toTree from '@/utils/toTree'
export default {
  name: 'Category',
  data() {
    return {
      list: [],
      form: {},
      rules: {
        groupName: { required: true, message: '必填' },
        groupCode: { required: true, message: '必填' }
      }
    }
  },
  computed: {
    treeData() {
      return this.$store.state.design.processGroupListTree
    }
  },
  methods: {
    refresh() {
      this.$store.dispatch('design/getProcessGroup')
    },
    async submit() {
      await this.$refs.form.validate()
      await this.axios.design
        .post('process/group/add', { projectId: localStorage.getItem('projectId'), ...this.form })
        .then(() => {
          this.$message.success(this.form.id ? '保存成功' : '创建')
        })
      this.refresh()
    },
    remove() {
      this.axios.design.post('process/group/delete' + this.form.id).then(res => this.$message.success('删除成功'))
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
    flex: 1;
  }
}
</style>
