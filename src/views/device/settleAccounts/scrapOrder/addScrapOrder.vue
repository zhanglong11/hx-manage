<!--
@任务名称: 2623/物资报废处理单遗留问题
@开发人员: 董渊海
@创建日期: 2020-02-12
@任务类型: 全新代码

@修改日期: 2020-03-13
@任务类型: 修改代码，新增物资报废处理单界面样式调整，修改比例(20%)

@修改日期: 2020-03-16
@任务类型: 修改代码，新增、编辑、保存提交、详情接口对接，修改比例(90%)

@修改日期: 2020-03-16
@任务类型: 修改代码，添加报废处理数量校验、报废处理单价校验，修改比例(35%)

@任务名称: 1355/开发环境input事件类型没有报错，但是线上环境报错
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，将input事件类型修改为change，修改比例(2%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 1d1dc3029f349f97ee597e982bfb6edb5d8220c9
@代码提交修改日期: 2020-03-13
@任务类型: 修改代码，物资报废处理单 列表接口对接(50%)、新增报废处理单页面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: c168eaca35978f92de892657dd54701bdaaed203
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单 对接 列表接口(100%)、新增接口、编辑接口、保存提交功能、删除接口、详情接口、模态框选择剩余库存物资列表接口
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 8da7d9a2516771f5ef9782fc514be72d8c3514da
@代码提交修改日期: 2020-03-16
@任务类型: 修改代码，物资报废处理单 添加报废处理数量校验、报废处理单价校验、选择报废物资明细记录是否重复校验
@补加代码注释日期: 2020-04-11

@bug名称: 1682/物资与设备管理->物资结算->新增物资报废处理单：报废物资明细部分，删除了第二行明细信息后保存，保存不了
@开发人员: 董渊海
@修改日期: 2020-04-16
@任务类型: 修改代码，修复该bug，修改比例(5%)
-->
<template>
  <div class="right-panel">
    <div class="form-a">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="180px">
        <el-form-item label="报废处理日期" prop="scrapTime">
          <el-date-picker
            v-model="form.scrapTime"
            type="datetime"
            style="width: 400px;"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报废处理金额" prop="scrapAmount">
          <el-input v-model="form.scrapAmount" style="width: 400px;" placeholder="报废处理金额" readonly></el-input>
        </el-form-item>
        <el-form-item label="报废原因" prop="scrapReason">
          <el-input
            v-model="form.scrapReason"
            style="width: 400px;"
            type="textarea"
            :rows="2"
            placeholder="请输入报废原因"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传" prop="fileId" :show-message="form.fileId ? false : true">
          <FileUpload :fileRecover="fileList" @input="setFileId" />
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
    </div>

    <div class="form-b">
      <div class="form-b-head">报废物资明细</div>
      <div class="form-b-table">
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          keep-source
          :data="tableData"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
          show-footer
          :footer-method="footerMethod"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="materialCode" title="编码"></vxe-table-column>
          <vxe-table-column field="materialName" title="名称"></vxe-table-column>
          <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="contractAmount" title="合同数量"></vxe-table-column>
          <vxe-table-column field="contractUnitPrice" title="合同单价(元)"></vxe-table-column>
          <vxe-table-column field="contractTotalPrice" title="合价">
            <template v-slot="{ row }">
              <span>{{ totalPrice(row) }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="materialType" title="类别">
            <template v-slot="{ row }">
              <span v-if="row.materialType === 1">材料</span>
              <span v-else-if="row.materialType === 2">机械</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="materialSource" title="物资来源">
            <template v-slot="{ row }">
              <span v-if="row.materialSource === 1">自购</span>
              <span v-else-if="row.materialSource === 2">租赁</span>
              <span v-else-if="row.materialSource === 3">自购+租赁</span>
              <span v-else-if="row.materialSource === 4">甲供</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="materialKind" title="物资种类">
            <template v-slot="{ row }">
              <span v-if="row.materialKind === 1">耗材</span>
              <span v-else-if="row.materialKind === 2">周材</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="currentScrapNum"
            title="报废处理数量"
            :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: changeCurrentScrapNum } }"
          ></vxe-table-column>
          <vxe-table-column
            field="scrapUnitPrice"
            title="报废处理单价"
            :edit-render="{ name: 'input', attrs: { type: 'number' }, events: { change: changeScrapUnitPrice } }"
          ></vxe-table-column>
          <vxe-table-column field="currentTotalScrapAmount" title="报废处理合价">
            <template v-slot="{ row }">
              <span>{{ totalScrapMoney(row) }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" width="120">
            <template v-slot="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <a @click="saveRowEvent(row)">保存</a>
                <a @click="cancelRowEvent(row)">取消</a>
              </template>
              <template v-else>
                <a @click="editRowEvent(row)">编辑</a>
                <a @click="deleteRowEvent(row)">删除</a>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div class="form-b-table-foot">
          <el-button class="btn-add" @click="showModalInventory">添加</el-button>
        </div>
      </div>
    </div>

    <div class="detail-c">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="
          () => {
            handleSave(0)
          }
        "
        >保存</el-button
      >
      <el-button type="primary" @click="handleSaveSubmit">保存并提交</el-button>
    </div>

    <ModalInventory
      :visible.sync="visibleInventory"
      :validList="tableData"
      @optionSelectRecord="optionSelectRecordInventory"
    ></ModalInventory>
  </div>
</template>

<script>
import Api from '@/api/device/settleAccounts/scrapOrder'
import FileApi from '@/api/file'
import ModalInventory from './modalInventory'
export default {
  name: 'AddScrapOrder',
  components: { ModalInventory },
  data() {
    return {
      fileList: [],
      form: {
        id: '',
        projectId: localStorage.getItem('projectId'),
        scrapTime: '',
        scrapAmount: '',
        scrapReason: '',
        status: 0,
        list: [],
        remark: '',
        fileId: null
      },
      formRules: {
        scrapTime: [{ required: true, message: '请选择报废处理日期' }],
        scrapReason: [{ required: true, message: '请输入报废原因' }],
        fileId: [{ required: true, message: '请上传单据附件' }]
      },
      visibleInventory: false,
      tableData: []
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getScrapOrderDetail(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
          this.tableData = this.form.list
          if (this.form.fileId) {
            let fileIds = this.form.fileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.fileList = res.data
              }
            })
          }
        }
      })
    }
  },
  methods: {
    showModalInventory() {
      this.visibleInventory = true
    },
    totalPrice(row) {
      return this.XEUtils.toNumber(row.contractAmount) * this.XEUtils.toNumber(row.contractUnitPrice)
    },
    totalScrapMoney(row) {
      return this.XEUtils.toNumber(row.currentScrapNum) * this.XEUtils.toNumber(row.scrapUnitPrice)
    },
    footerMethod({ columns, data }) {
      let result = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['contractTotalPrice'].includes(column.property)) {
            let sum = 0
            data.map(item => {
              sum += item.contractAmount * item.contractUnitPrice
            })
            return sum
          }
          if (['currentTotalScrapAmount'].includes(column.property)) {
            let sum = 0
            data.map(item => {
              sum += item.currentScrapNum * item.scrapUnitPrice
            })
            return sum
          }
          return null
        })
      ]
      return result
    },
    optionSelectRecordInventory(record) {
      //console.log(record)
      let obj = {
        materialId: record.id,
        materialCode: record.materialCode,
        materialName: record.materialName,
        specification: record.specification,
        unit: record.unit,
        contractAmount: record.contractAmount,
        contractUnitPrice: record.unitPrice,
        contractTotalPrice: 0,
        materialType: record.materialType,
        materialSource: record.materialSource,
        materialKind: record.materialKind,
        currentScrapNum: 0,
        scrapUnitPrice: 0,
        currentTotalScrapAmount: 0
      }
      this.tableData.push(obj)
    },

    changeCurrentScrapNum({ row }, e) {
      row.currentScrapNum = e.target.value
    },
    changeScrapUnitPrice({ row }, e) {
      row.scrapUnitPrice = e.target.value
    },
    saveRowEvent(row) {
      let currentScrapNum = row.currentScrapNum + ''
      let scrapUnitPrice = row.scrapUnitPrice + ''

      if (
        currentScrapNum === '0' ||
        currentScrapNum === '' ||
        currentScrapNum.indexOf('0') === 0 ||
        currentScrapNum.indexOf('.') !== -1 ||
        currentScrapNum.indexOf('-') !== -1
      ) {
        this.$message.error('报废处理数量不合法')
        return
      }
      if (scrapUnitPrice === '0' || scrapUnitPrice === '' || scrapUnitPrice.indexOf('-') !== -1) {
        this.$message.error('报废处理单价不合法')
        return
      }

      //这里暂时注释：因为后台返回物资的合同数量和合同单价都是0，没有具体的数值，所以下面的校验暂时注释
      /*if (parseFloat(currentScrapNum) > parseFloat(row.contractAmount)) {
        this.$message.error('报废处理数量不能超过合同数量')
        return
      }
      if (parseFloat(scrapUnitPrice) > parseFloat(row.contractUnitPrice)) {
        this.$message.error('报废处理单价不能超过合同单价')
        return
      }*/

      this.$refs.xTable.clearActived().then(() => {
        row.currentTotalScrapAmount = parseFloat(row.currentScrapNum) * parseFloat(row.scrapUnitPrice)
        row.contractTotalPrice = parseFloat(row.contractAmount) * parseFloat(row.contractUnitPrice)

        let total = 0
        this.tableData.map(item => {
          total += item.currentTotalScrapAmount
        })
        this.form.scrapAmount = total
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
        this.$refs.xTable.updateFooter()
      })
    },
    editRowEvent(row) {
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }
      this.$refs.xTable.setActiveRow(row)
    },
    deleteRowEvent(row) {
      //this.$refs.xTable.remove(row)
      //this.$refs.xTable.updateFooter()
      let index = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].materialId === row.materialId) {
          index = i
          break
        }
      }
      if (index !== null) {
        this.tableData.splice(index, 1)
      }
    },

    validSaveStatus() {
      let indexActive = null
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.$refs.xTable.isActiveByRow(this.tableData[i])) {
          indexActive = i + 1
          break
        }
      }
      if (indexActive) {
        this.$message.error(`请保存 报废物资明细 第${indexActive}行记录，再做该操作`)
        return true
      } else {
        return false
      }
    },
    handleSave(isSubmit) {
      //校验保存状态是否关闭
      if (this.validSaveStatus()) {
        return
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          //校验报废处理数量是否合法、报废处理单价是否合法
          let indexAmount1 = null
          let indexAmount2 = null
          let indexPrice1 = null
          let indexPrice2 = null
          for (let i = 0; i < this.tableData.length; i++) {
            let currentScrapNum = this.tableData[i].currentScrapNum + ''
            if (
              currentScrapNum === '0' ||
              currentScrapNum === '' ||
              currentScrapNum.indexOf('0') === 0 ||
              currentScrapNum.indexOf('.') !== -1 ||
              currentScrapNum.indexOf('-') !== -1
            ) {
              indexAmount1 = i + 1
              break
            }

            let scrapUnitPrice = this.tableData[i].scrapUnitPrice + ''
            if (scrapUnitPrice === '0' || scrapUnitPrice === '' || scrapUnitPrice.indexOf('-') !== -1) {
              indexPrice1 = i + 1
              break
            }

            //这里暂时注释：因为后台返回物资的合同数量和合同单价都是0，没有具体的数值，所以下面的校验暂时注释
            /*if (parseFloat(currentScrapNum) > parseFloat(this.tableData[i].contractAmount)) {
              indexAmount2 = i + 1
              break
            }
            if (parseFloat(scrapUnitPrice) > parseFloat(this.tableData[i].contractUnitPrice)) {
              indexPrice2 = i + 1
              break
            }*/
          }

          if (indexAmount1) {
            this.$message.error(`报废物资明细 第${indexAmount1}行记录的报废处理数量不合法`)
            return
          }
          if (indexAmount2) {
            this.$message.error(`报废物资明细 第${indexAmount2}行记录的报废处理数量不能超过合同数量`)
            return
          }
          if (indexPrice1) {
            this.$message.error(`报废物资明细 第${indexPrice1}行记录的报废处理单价不合法`)
            return
          }
          if (indexPrice2) {
            this.$message.error(`报废物资明细 第${indexPrice2}行记录的报废处理单价不能超过合同单价`)
            return
          }

          if (this.tableData.length === 0) {
            this.$message.error('请至少添加一条报废物资明细')
            return
          }

          let list = []
          this.tableData.map(item => {
            list.push({
              materialId: item.materialId,
              currentScrapNum: item.currentScrapNum,
              scrapUnitPrice: item.scrapUnitPrice,
              currentTotalScrapAmount: item.currentTotalScrapAmount,
              contractAmount: item.contractAmount,
              contractUnitPrice: item.contractUnitPrice,
              contractTotalPrice: item.contractTotalPrice
            })
          })
          this.form.list = list
          //console.log(this.form)
          if (isSubmit) {
            //是否提交
            this.form.status = 1
          }
          if (this.form.id) {
            Api.editScrapOrder(this.form).then(res => {
              this.$message.success('编辑成功')
              this.$router.push({ name: 'ScrapOrder' })
            })
          } else {
            Api.addScrapOrder(this.form).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'ScrapOrder' })
            })
          }
        }
      })
    },
    handleSaveSubmit() {
      this.handleSave(1)
    },
    handleCancel() {
      this.$router.push({ name: 'ScrapOrder' })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
