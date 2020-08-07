<template>
  <div class="indexWrapper">
    <el-form ref="form" :model="form" :rules="formRule" label-positon="left" label-width="180px">
      <el-form-item label="材料名称" prop="materialName">
        <el-input v-model="form.materialName" :readonly="true" style="width: 400px;" placeholder="请选择"> </el-input
        >&nbsp;
        <a @click="showModalMaterial">选择原材料</a>
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="form.specification" disabled style="width: 400px;" placeholder="请选择"></el-input>
      </el-form-item>
      <el-form-item label="检验内容" prop="inspectContent">
        <el-input v-model="form.inspectContent" disabled style="width: 400px;" placeholder="请选择"></el-input>
      </el-form-item>
      <el-form-item label="实际采样量" prop="actualSamplingSize">
        <el-input v-model.number="form.actualSamplingSize" style="width: 400px;" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="检验机构" prop="inspectOrgan">
        <el-input v-model="form.inspectOrgan" style="width: 400px;" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="检验时间" prop="inspectTime">
        <el-date-picker
          v-model="form.inspectTime"
          style="width: 400px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="检验结果" prop="inspectResult">
        <el-select v-model="form.inspectResult" style="width: 400px;" placeholder="请选择检查结果">
          <el-option label="合格" :value="0"></el-option>
          <el-option label="不合格" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传">
        <FileUploadWithImg
          v-model="fileList"
          :fileRecover="fileUrlList"
          :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
        ></FileUploadWithImg>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          style="width: 400px;"
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right; padding-top: 10px;" class="footerButton">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <!--
          /**
           任务名称：2700/原材料检验单修改
           开发人员：崔洛宜
           日期：2020-03-24
           任务类型：修改逻辑结构
           **/
      -->
      <!--<el-button type="primary" @click="handleSubmit">保存并提交</el-button>-->
    </div>
    <ModalMaterial
      v-if="visibleMaterial"
      :visible.sync="visibleMaterial"
      @disposeSelectRow="disposeSelectMaterial"
    ></ModalMaterial>
  </div>
</template>

<script>
import ModalMaterial from './modalMaterial'
import FileUploadWithImg from '@/components/FileUploadWithImg'
import Api from '@/api/device/material/checkOrder'
import FileApi from '@/api/file'
export default {
  name: 'AddCheckOrder',
  components: { ModalMaterial, FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      visibleMaterial: false,
      form: {
        /**
         任务名称：2700/原材料检验单修改
         开发人员：崔洛宜
         日期：2020-03-24
         任务类型：修改逻辑结构(字段修改)
         **/
        materialName: '',
        materialId: '',
        inspectRuleId: '',
        specification: '',
        inspectContent: '',
        actualSamplingSize: null,
        inspectOrgan: '',
        inspectTime: null,
        inspectResult: null
      },
      formRule: {
        /**
         任务名称：BUG#1374 物资与设备管理-材料管理-原材料校验单-必填项要加上必填标识，保存时校验必填项
         开发人员：崔洛宜
         日期：2020-03-30
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
        materialName: [{ required: true, message: '请选择材料', trigger: 'change' }],
        inspectOrgan: [{ required: true, message: '检验机构不能为空', trigger: 'blur' }],
        inspectTime: [{ required: true, message: '请选择检验日期', trigger: 'change' }],
        inspectResult: [{ required: true, message: '请选择检验结果', trigger: 'change' }],
        actualSamplingSize: [
          { required: true, message: '实际采样量不能为空', trigger: 'blur' },
          { type: 'number', message: '实际采样量必须为数字值' }
        ]
      },
      fileList: [],
      fileUrlList: [],
      tableData: []
    }
  },
  created() {
    let { id, isEdit } = this.$route.params
    this.id = id
    this.isEdit = isEdit
    if (isEdit) {
      Api.getDetailById(id).then(res => {
        if (res.code === 200) {
          this.form = res.data
          this.fileList = res.data.fileId.split(',')
          if (this.fileList.length > 0) {
            FileApi.getFileList(this.fileList).then(res => {
              if (res.data) {
                this.fileUrlList = res.data
              }
            })
          }
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    }
  },
  methods: {
    showModalMaterial() {
      this.visibleMaterial = true
    },
    disposeSelectMaterial(selectRow) {
      /**
       任务名称：2700/原材料检验单修改
       开发人员：崔洛宜
       日期：2020-03-24
       任务类型：修改逻辑结构
       **/
      this.form.materialName = selectRow.materialName
      this.form.materialId = selectRow.materialId
      this.form.specification = selectRow.specification
      this.form.inspectContent = selectRow.inspectContent
      this.form.inspectRuleId = selectRow.id
      this.tableData = selectRow.fileList
    },
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        console.log(row)
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    deleteRowEvent(row) {
      this.$refs.xTable.remove(row)
      this.$refs.xTable.updateFooter()
    },
    countNet(row) {
      return this.XEUtils.toNumber(row.rough) - this.XEUtils.toNumber(row.tare)
    },
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['totalPrice'].includes(column.property)) {
            return this.XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
      return result
    },
    onCancel() {
      this.$router.back()
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              projectId: this.projectId,
              fileId: this.fileList.join(','),
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addOrder({
              ...this.form,
              projectId: this.projectId,
              fileId: this.fileList.join(','),
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          console.log('请正确填写')
          return false
        }
      })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateOrder({
              ...this.form,
              projectId: this.projectId,
              fileId: this.fileList.join(','),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addOrder({
              ...this.form,
              projectId: this.projectId,
              fileId: this.fileList.join(','),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          console.log('请正确填写')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
