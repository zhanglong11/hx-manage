<template>
  <div class="main">
    <div class="tree-container">
      <div class="tooltips">
        <el-form ref="pageQuery" :model="pageQuery" inline>
          <el-form-item label="" prop="search">
            <el-input v-model="pageQuery.search" placeholder="请输入">
              <i slot="suffix" class="el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            <el-button v-if="$hasPower('QualityPlanTargetResolveAdd')" @click="showAddDialog(0)">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tree
        :expand-on-click-node="false"
        default-expand-all
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        @node-contextmenu="handleContextMenu"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.engineeringNumber }}</span>
          <span> {{ data.engineeringName }}</span>
        </span>
      </el-tree>
    </div>
    <div v-if="showInfo" class="tree-info">
      <div class="btn-box">
        <el-button v-if="$hasPower('QualityPlanTargetResolveEdit')" type="primary" @click="edit">编辑</el-button>
      </div>
      <el-form
        ref="form"
        style="width: 400px;"
        :model="form"
        :rules="isEdit ? rules : {}"
        class="form"
        label-width="110px"
      >
        <el-form-item label="工程编码" prop="engineeringNumber">
          <el-input v-if="isEdit" v-model="form.engineeringNumber" />
          <span v-else>{{ form.engineeringNumber }}</span>
        </el-form-item>
        <el-form-item label="工程名称" prop="engineeringName">
          <el-input v-if="isEdit" v-model="form.engineeringName" />
          <span v-else>{{ form.engineeringName }}</span>
        </el-form-item>
        <el-form-item label="工程划分" prop="engineeringDivide">
          <template v-if="isEdit">
            <el-select v-model="form.engineeringDivide" style="width: 100%;">
              <el-option
                v-for="item in engineeringDivideTypeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </template>
          <span v-else>{{ $getLabel(engineeringDivideTypeList, form.engineeringDivide) }}</span>
        </el-form-item>
        <el-form-item label="点号" prop="pointNumber">
          <el-input v-if="isEdit" v-model="form.pointNumber" />
          <span v-else>{{ form.pointNumber }}</span>
        </el-form-item>
        <el-form-item label="控制点" prop="controlPoint">
          <el-input v-if="isEdit" v-model="form.controlPoint" />
          <span v-else>{{ form.controlPoint }}</span>
        </el-form-item>
        <el-form-item label="质量目标" prop="qualityTarget">
          <el-input v-if="isEdit" v-model="form.qualityTarget" />
          <span v-else>{{ form.qualityTarget }}</span>
        </el-form-item>
        <el-form-item label="要求" prop="claim">
          <el-input v-if="isEdit" v-model="form.claim" />
          <span v-else>{{ form.claim }}</span>
        </el-form-item>
        <el-form-item label="验收规范" prop="acceptanceSpecificationId">
          <template v-if="isEdit">
            <el-select v-model="form.acceptanceSpecificationId" style="width: 100%;">
              <el-option
                v-for="item in acceptanceSpecificationList"
                :key="item.id"
                :value="item.id"
                :label="item.specificationName"
              />
            </el-select>
          </template>
          <span v-else>{{ form.specificationName }}</span>
        </el-form-item>
        <el-form-item label="质量样板" prop="constructionTemplateId">
          <template v-if="isEdit">
            <el-select v-model="form.constructionTemplateId" style="width: 100%;">
              <el-option
                v-for="item in constructionTemplateList"
                :key="item.id"
                :value="item.id"
                :label="item.templateName"
              />
            </el-select>
          </template>
          <span v-else>{{ form.templateName }}</span>
        </el-form-item>
        <el-form-item label="质量负责人" prop="qualityPrincipalId">
          <SelectUser
            v-if="isEdit"
            :id.sync="form.qualityPrincipalId"
            :value="form.qualityPrincipalId ? { id: form.qualityPrincipalId, label: form.qualityPrincipalName } : null"
            :name.sync="form.qualityPrincipalName"
            :multiple="false"
          />
          <span v-else>{{ form.qualityPrincipalName }}</span>
        </el-form-item>
      </el-form>
      <div v-if="isEdit" class="btn-box footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
    <ul v-if="showContextMenu" class="contextMenu" :style="{ top: top + 'px', left: left + 'px' }">
      <li v-if="$hasPower('QualityPlanTargetResolveAdd')" @click="showAddDialog(curPid)">添加同级节点</li>
      <li v-if="$hasPower('QualityPlanTargetResolveAdd')" @click="showAddDialog(curId)">添加子级节点</li>
      <li v-if="$hasPower('QualityPlanTargetResolveDelete')" @click="remove(curId)">删除此节点</li>
    </ul>
    <AddDialog
      v-if="visible"
      :visible.sync="visible"
      :pid="pid"
      :acceptanceSpecificationList="acceptanceSpecificationList"
      :constructionTemplateList="constructionTemplateList"
    />
  </div>
</template>

<script>
import Api from '../../api'
import paramList from '@/lib/paramList'
import AddDialog from './components/AddDialog'
import toTree from '@/utils/toTree'
import engineeringDivideTypeList from '../../lib/engineeringDivideTypeList'
export default {
  name: 'TargetResolve',
  components: { AddDialog },
  data() {
    return {
      acceptanceSpecificationList: [], //验收规范列表
      constructionTemplateList: [], //施工样板列表
      engineeringDivideTypeList, //工程划分
      showInfo: false,
      paramList,
      treeData: [],
      top: 100,
      left: 200,
      showContextMenu: false,
      form: {},
      info: {},
      visible: false,
      isEdit: false,
      rules: {
        engineeringNumber: [{ required: true, message: '必填' }],
        engineeringName: [{ required: true, message: '必填' }],
        engineeringDivide: [{ required: true, message: '必填' }],
        pointNumber: [{ required: true, message: '必填' }],
        controlPoint: [{ required: true, message: '必填' }],
        claim: [{ required: true, message: '必填' }],
        qualityTarget: [{ required: true, message: '必填' }],
        acceptanceSpecificationId: [{ required: true, message: '必填' }],
        specificationName: [{ required: true, message: '必填' }],
        qualityPrincipalId: [{ required: true, message: '必填' }]
      },
      pageQuery: {
        search: ''
      },
      treeId: null,
      defaultProps: {
        label: 'engineeringName'
      },
      pid: 0,
      curId: null,
      curPid: 0
    }
  },
  created() {
    Api.standard.list().then(res => (this.acceptanceSpecificationList = res.data.records))
    Api.qualityModel.list().then(res => (this.constructionTemplateList = res.data.records))
    this.refresh()
    document.querySelector('body').addEventListener('click', () => {
      this.showContextMenu = false
    })
  },
  methods: {
    async refresh() {
      let res = await Api.targetResolve.tree(this.pageQuery)
      this.treeData = toTree(res.data)
    },
    reset() {
      this.$refs.pageQuery.resetFields()
      this.refresh()
    },
    edit() {
      this.isEdit = true
    },
    cancel() {
      this.isEdit = false
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await Api.targetResolve.update({ ...this.form, ...{ id: this.treeId } })
          this.$message.success('保存成功')
          this.refresh()
          this.isEdit = false
        }
      })
    },
    async remove(id) {
      if (_.size(this.cur.children)) {
        this.$message.error('请先删除子节点')
        return false
      }
      let res = await Api.targetResolve.delete(id)
      this.$message.success('删除成功')
      this.refresh()
    },
    showAddDialog(id) {
      this.pid = id
      this.visible = true
    },
    handleContextMenu(e, data, node, ss) {
      this.curId = data.id
      this.cur = data
      this.curPid = data.pid
      this.showContextMenu = true
      const outLeft = document.querySelector('.main-container').offsetLeft
      this.left = e.clientX - outLeft + 20
      this.top = e.clientY - 70
    },
    handleNodeClick(e, node) {
      this.showContextMenu = false
      this.treeId = node.data.id
      this.showInfo = true
      this.getDetail(node.data.id)
    },
    async getDetail(id) {
      let res = await Api.targetResolve.detail(id)
      this.form = res.data
    }
  }
}
</script>

<style scoped lang="less">
div.main {
  display: flex;
  background: #f0f2f5;
  .btn-box {
    text-align: right;
  }
  .btn-box.footer {
    text-align: right;
    padding: 0 20px;
    height: 60px;
    background: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .tree-container {
    width: 500px;
    padding: 10px;
    margin-right: 20px;
    background-color: #fff;
  }
  .tree-info {
    flex: 1;
    padding: 10px;
    background: #fff;
    position: relative;
  }
}
.contextMenu {
  background-color: #5a5e66;
  width: 120px;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  li {
    height: 30px;
    line-height: 30px;
    color: rgba(255, 255, 255, 0.65);
    &:hover {
      cursor: pointer;
      color: #fff;
    }
  }
}
</style>
