<template>
  <div>
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="110px">
        <el-form-item label="单位编号" prop="qualityTargetDecomposeId">
          <el-input v-model="form.qualityTargetDecomposeId" disabled />
        </el-form-item>
        <el-form-item label="单位名称" prop="engineeringName">
          <div style="display: flex;">
            <el-input v-model="form.engineeringName" disabled />
            <el-button type="text" @click="showTargetDialog(1)"> 选择</el-button>
          </div>
        </el-form-item>
        <el-form-item label="资料类型" prop="materialType">
          <SelectList
            v-model="form.materialType"
            :hasAllOption="false"
            type="infoDataType"
            @change="() => (isRefresh = false)"
          />
        </el-form-item>
        <el-form-item label="项目种类" prop="projectType">
          <SelectList
            v-model="form.projectType"
            :hasAllOption="false"
            type="projectTypeList"
            @change="() => (isRefresh = false)"
          />
        </el-form-item>
      </el-form>
    </section>
    <EditTable
      ref="table"
      v-model="detailList"
      :isRemove="false"
      :isAdd="false"
      :tableColumn="type === 1 ? infoColumn : recordColumn"
      :validRules="validRules"
      :show-footer="true"
      :footer-method="footerMethod"
    />
    <!--    添加表尾计算方法-->
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <FileListDialog :visible.sync="fileVisible" :fileIds="fileIds" />
    <SelectTargetResolveDialog :visible.sync="targetVisible" :targetType="targetType" @getTarget="getTarget" />
  </div>
</template>

<script>
import api from '@/api/quality/acceptance/projectInfo'
import infoData from './infoData'
import XEUtils from 'xe-utils'
import FileListDialog from './components/FileListDialog'
export default {
  name: 'Edit',
  components: { FileListDialog },
  data() {
    return {
      isRefresh: false,
      detailList: [],
      type: 1,
      fileIds: null,
      fileVisible: false,
      targetVisible: false,
      targetType: null,
      infoData,
      form: {
        materialType: 1,
        projectType: 1
      },

      /*
       * @任务编号:验证功能
       * @开发人员:张龙
       * @日期:2020-03-30
       * @任务类型: 修改代码
       */
      rules: {
        qualityTargetDecomposeId: [{ required: true, message: '必填' }],
        engineeringName: [{ required: true, message: '必填' }],
        materialType: [{ required: true, message: '必填' }],
        projectType: [{ required: true, message: '必填' }]
      },
      infoColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'materialName',
          title: '资料名称  '
        },
        {
          field: 'materialCopies',
          title: '份数',
          width: 140,
          slots: {
            default: ({ row }) => [
              <InputNumber
                v-model={row.materialCopies}
                onInput={() => {
                  this.updateFooter()
                }}
              />
            ]
          }
        },
        {
          field: 'remark',
          title: '备注',
          slots: {
            default: ({ row }) => [<el-input v-model={row.remark} />]
          }
        },
        {
          field: 'remark',
          title: '文件',
          slots: {
            default: ({ row }) => [
              row.fileIds ? (
                <el-link
                  underline={false}
                  type="primary"
                  onClick={() => {
                    this.showFileDialog(row.fileIds)
                  }}
                >
                  查看文件
                </el-link>
              ) : (
                <span>暂无文件</span>
              )
            ]
          }
        },
        {
          field: 'fileIds',
          title: '操作',
          slots: {
            default: ({ row }) => [
              <div style="display:flex">
                <FileEdit v-model={row.fileIds} isButton={true} />
              </div>
            ]
          }
        }
      ],
      recordColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'checkItem',
          title: '资料名称  '
        },
        {
          field: 'checkPointNum',
          title: '检查点'
        },
        {
          field: 'better',
          title: '好点',
          slots: {
            default: ({ row }) => [
              <el-input-number
                v-model={row.better}
                controls={false}
                controls-position="right"
                min={0}
                onInput={() => {
                  this.getPointNum(row)
                }}
              />
            ]
          }
        },
        {
          field: 'generalNum',
          title: '一般点',
          slots: {
            default: ({ row }) => [
              <el-input-number
                v-model={row.generalNum}
                controls={false}
                controls-position="right"
                min={0}
                onInput={() => {
                  this.getPointNum(row)
                }}
              />
            ]
          }
        },
        {
          field: 'almostNum',
          title: '差点',
          slots: {
            default: ({ row }) => [
              <el-input-number
                v-model={row.almostNum}
                controls={false}
                controls-position="right"
                min={0}
                onInput={() => {
                  this.getPointNum(row)
                }}
              />
            ]
          }
        },
        {
          field: 'remark',
          title: '备注',
          slots: {
            default: ({ row }) => [<el-input v-model={row.remark} />]
          }
        }
      ],
      validRules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {
    'form.materialType'() {
      this.makeData()
    },
    'form.projectType'() {
      this.makeData()
    }
  },
  created() {
    if (this.$route.params.id) {
      this.isRefresh = true
      this.refresh()
    } else {
      this.makeData()
    }
  },
  methods: {
    makeData() {
      let form = this.form
      let o = {
        materialName: '',
        checkItem: '',
        checkPointNum: 0,
        materialCopies: 0,
        better: 0,
        generalNum: 0,
        almostNum: 0,
        remark: ''
      }
      let data = []
      if (form.materialType === 1 && form.projectType === 1) {
        this.type = 1
        data = infoData.controlBuild
      } else if (form.materialType === 1 && form.projectType === 2) {
        this.type = 1
        data = infoData.controlWater
      } else if (form.materialType === 1 && form.projectType === 3) {
        this.type = 1
        data = infoData.controlWind
      } else if (form.materialType === 1 && form.projectType === 4) {
        this.type = 1
        data = infoData.controlElectric
      } else if (form.materialType === 1 && form.projectType === 5) {
        this.type = 1
        data = infoData.controlSmart
      } else if (form.materialType === 1 && form.projectType === 6) {
        this.type = 1
        data = infoData.controlEnergy
      } else if (form.materialType === 1 && form.projectType === 7) {
        this.type = 1
        data = infoData.controlElevator
      } else if (form.materialType === 2 && form.projectType === 1) {
        this.type = 2
        data = infoData.recordBuild
      } else if (form.materialType === 2 && form.projectType === 2) {
        this.type = 2
        data = infoData.recordWater
      } else if (form.materialType === 2 && form.projectType === 3) {
        this.type = 2
        data = infoData.recordWind
      } else if (form.materialType === 2 && form.projectType === 4) {
        this.type = 2
        data = infoData.recordElectric
      } else if (form.materialType === 2 && form.projectType === 5) {
        this.type = 2
        data = infoData.recordSmart
      } else if (form.materialType === 2 && form.projectType === 6) {
        this.type = 2
        data = infoData.recordEnergy
      } else if (form.materialType === 2 && form.projectType === 7) {
        this.type = 2
        data = infoData.recordElevator
      } else if (form.materialType === 3 && form.projectType === 1) {
        this.type = 1
        data = infoData.safeBuild
      } else if (form.materialType === 3 && form.projectType === 2) {
        this.type = 1
        data = infoData.safeWater
      } else if (form.materialType === 3 && form.projectType === 3) {
        this.type = 1
        data = infoData.safeWind
      } else if (form.materialType === 3 && form.projectType === 4) {
        this.type = 1
        data = infoData.safeElectric
      } else if (form.materialType === 3 && form.projectType === 5) {
        this.type = 1
        data = infoData.safeSmart
      } else if (form.materialType === 3 && form.projectType === 6) {
        this.type = 1
        data = infoData.safeEnergy
      } else if (form.materialType === 3 && form.projectType === 7) {
        this.type = 1
        data = infoData.safeElevator
      }
      if (this.isRefresh) {
        return
      }
      this.detailList = data.map(item => {
        let insetData = this.type === 1 ? { materialName: item } : { checkItem: item }
        return { ...o, ...insetData, ...{ type: this.type } }
      })
    },
    async refresh() {
      let res = await api.detail(this.$route.params.id, {})
      this.form = res.data
      this.detailList = res.data.detailList
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = this.$route.params.id
            ? await api.update({ ...this.form, ...{ detailList: this.detailList } })
            : await api.add({ ...this.form, ...{ detailList: this.detailList } })
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    showTargetDialog(type) {
      this.form.qualityTargetDecomposeId = null
      this.form.qualityTargetDecomposeName = null
      this.targetType = type
      this.targetVisible = true
    },
    getTarget(o) {
      this.form = {
        ...this.form,
        ...{
          qualityTargetDecomposeId: o.id,
          engineeringName: o.name
        }
      }
    },
    //获取检查点
    getPointNum(row) {
      row.checkPointNum = row.better + row.generalNum + row.almostNum
      this.$refs.table.$refs.table.$refs.vxeTable.reloadRow(row)
      this.updateFooter()
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['materialCopies'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          if (['checkPointNum'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          if (['better'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          if (['generalNum'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          if (['almostNum'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
    },
    updateFooter() {
      this.$refs.table.$refs.table.$refs.vxeTable.updateFooter()
    },
    showFileDialog(fileIds) {
      this.fileVisible = true
      this.fileIds = fileIds
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.edit-section {
  width: 400px;
}

.btn-box {
  margin-top: 10px;
  text-align: left;
}
</style>
