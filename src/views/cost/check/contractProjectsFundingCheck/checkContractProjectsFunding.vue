<!--
@bug名称: 1236/界面开始加载的时候，树表格内容比较长，右侧没有滚动栏
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，树表格添加auto-resize属性，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: d0418ae2f5e7ab1a5488ee930102f9d76857a2e0
@代码提交修改日期: 2020-03-10
@任务类型: 修改代码，合同项目经费核算审核 对接 审核列表页接口、新增审核页和详情页
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <!-- 流程图 start -->
      <ViewFlow :id="$route.params.id" />
      <!-- 流程图 end -->
      <div style="text-align: right; padding-bottom: 16px;">
        <span style="color: #999999;">项目经费核算状态：</span>
        <span style="color: #333333;">待审核12321</span>
      </div>
      <vxe-table
        ref="xTable"
        border
        resizable
        show-overflow
        :data="tableData"
        :tree-config="{ children: 'children', expandAll: true }"
        auto-resize
      >
        <vxe-table-column type="seq" tree-node title="序号"></vxe-table-column>
        <vxe-table-column field="code" title="项目编号"></vxe-table-column>
        <vxe-table-column field="name" title="项目名称"></vxe-table-column>
        <vxe-table-column field="unit" title="单位"></vxe-table-column>
        <vxe-table-column field="money" title="测算金额(元)"></vxe-table-column>
        <vxe-table-column field="fullMoney" title="本期实际金额(元)"></vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </div>

    <div class="audit-a">
      <div class="audit-a-head">审核结果</div>
      <el-form ref="form" class="audit-a-form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div style="display: flex;">
          <div style="flex: 1;">
            <el-form-item label="审核结果" prop="auditStatus">
              <el-radio-group v-model="form.auditStatus">
                <el-radio :label="2">已通过</el-radio>
                <el-radio :label="3">已驳回</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="auditOpinion">
              <el-input v-model="form.auditOpinion" type="textarea" :rows="2" placeholder="请输入审核意见"></el-input>
            </el-form-item>
          </div>
          <div style="flex: 1;">
            <el-form-item label="文件上传">
              <FileUpload @input="setFileId" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div class="detail-c">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/cost/contractProjectsFunding'
import projectFundList from '@/lib/projectFundList'
import _ from 'lodash'
export default {
  name: 'CheckContractProjectsFunding',
  data() {
    return {
      tableData: [],
      form: {
        auditStatus: '',
        auditOpinion: '',
        auditFileId: null
      },
      formRules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      }
    }
  },
  mounted() {
    this.tableData = _.cloneDeep(projectFundList)

    //预算项目明细信息回显
    let id = this.$route.params.id
    Api.getExpenditureDetailByExpenditureId(id).then(res => {
      //console.log(res)
      let data = res.data
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let node = this.getNodeInfo(data[i].itemCode, this.tableData)
          node.fullMoney = data[i].accountingMoney
          node.remark = data[i].accountingRemark
          node.money = data[i].calculateMoney
        }
      }
    })
  },
  methods: {
    getNodeInfo(code, data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].code === code) {
          return data[i]
        }
        if (data[i].children && data[i].children.length) {
          let result = this.getNodeInfo(code, data[i].children)
          if (result) {
            return result
          }
        }
      }
    },
    handleCancel() {
      this.$router.push({ name: 'ContractProjectsFundingCheck' })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //等待后台提供接口
        }
      })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.auditFileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
