<template>
  <div class="main">
    <div class="tree-container">
      <div class="tooltips">
        <el-form ref="pageQuery" :model="pageQuery" inline>
          <el-form-item label="" prop="equipmentName">
            <el-input v-model="pageQuery.equipmentName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tree :expand-on-click-node="false" default-expand-all :data="treeData" :render-content="renderContent" />
    </div>
    <div class="tree-info">
      <div class="btn-box">
        <el-button type="primary" @click="edit">编辑</el-button>
      </div>
      <el-form
        ref="form"
        style="width: 400px;"
        :model="form"
        :rules="isEdit ? rules : {}"
        class="form"
        label-width="180px"
      >
        <el-form-item label="分部数量" prop="name">
          <span></span>
        </el-form-item>
        <el-form-item label="符合标准规定数量" prop="name">
          <span></span>
        </el-form-item>
        <el-form-item label="质量控制资料数量" prop="order">
          <el-input v-if="isEdit" v-model="form.order" />
          <span v-else></span>
        </el-form-item>
        <el-form-item label="符合标准规定数量" prop="order">
          <el-input v-if="isEdit" v-model="form.order" />
          <span v-else></span>
        </el-form-item>
        <el-form-item label="安全和使用功能核查数量" prop="order">
          <el-input v-if="isEdit" v-model="form.order" />
          <span v-else></span>
        </el-form-item>
        <el-form-item label="符合标准规定数量" prop="order">
          <el-input v-if="isEdit" v-model="form.order" />
          <span v-else></span>
        </el-form-item>
        <el-form-item label="安全和使用功能抽查数量" prop="order">
          <el-input v-if="isEdit" v-model="form.order" />
          <span v-else></span>
        </el-form-item>
        <el-form-item label="符合标准规定数量" prop="order">
          <el-input v-if="isEdit" v-model="form.order" />
          <span v-else></span>
        </el-form-item>
        <el-form-item label="观感质量验收数量" prop="order">
          <el-input v-if="isEdit" v-model="form.order" />
          <span v-else></span>
        </el-form-item>
        <el-form-item label="综合验收结论" prop="name">
          <span></span>
        </el-form-item>
      </el-form>
      <div v-if="isEdit" class="btn-box">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TargetResolve',
  data() {
    return {
      treeData: [
        {
          label: 'XX施工总进度计划',
          children: [
            {
              label: '2019年度计划',
              children: [
                {
                  label: '2019年1月计划'
                },
                {
                  label: '2019年2月计划'
                }
              ]
            },
            {
              label: '2020年度计划',
              children: [
                {
                  label: '2020年1月计划'
                },
                {
                  label: '2020年2月计划'
                }
              ]
            }
          ]
        }
      ],
      form: {},
      isEdit: false,
      rules: {},
      pageQuery: {}
    }
  },
  methods: {
    getList() {
      console.log(12)
    },
    reset() {
      console.log(123)
    },
    edit() {
      this.isEdit = true
    },
    cancel() {
      this.isEdit = false
    },
    submit() {
      this.$message.success('操作成功')
      this.isEdit = false
    },
    showAddDialog() {
      this.visible = true
    },
    rightClick() {
      console.log()
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span onClick={() => this.treeClick()}>{node.label}</span>
        </span>
      )
    }
  }
}
</script>

<style scoped lang="less">
div.main {
  display: flex;
  background: #f0f2f5;
  .tree-container {
    width: 400px;
    padding: 10px;
    margin-right: 20px;
    background-color: #fff;
  }
  .tree-info {
    flex: 1;
    padding: 10px;
    background: #fff;
  }
}
</style>
