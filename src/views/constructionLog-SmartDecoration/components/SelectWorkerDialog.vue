<template>
  <el-dialog
    :visible="visible"
    width="40%"
    top="10vh"
    title="请选择"
    style="margin-left: 150px;"
    :modal-append-to-body="false"
    @close="cancelDialog"
  >
    <div class="container">
      <el-row :gutter="20">
        <el-form ref="formRefs" :model="formData" label-width="200px" class="form-con">
          <el-col :md="24">
            <el-form-item label="选择工种" prop="copyToPersonIds">
              <SelectArg
                v-model="formData.workTypeId"
                style="width: 100%;"
                argGroup="workType"
                @input="getWorkTypeValue"
              ></SelectArg>
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="选择施工人员" prop="constructionPersonIds">
              <SelectWorker
                :id.sync="formData.constructionPersonIds"
                :multiple="true"
                :value="
                  formData.constructionPersonIds
                    ? { id: formData.constructionPersonIds, label: formData.constructionPersonNames }
                    : null
                "
                :workTypeId="workTypeId"
                :name.sync="formData.constructionPersonNames"
                @close="handleUserSelected"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <footer slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import SelectWorker from './SelectWorker'
export default {
  name: 'AddMaterialDialog',
  components: {
    SelectWorker
  },
  props: {
    visible: {},
    detailList: {
      type: Array
    }
  },

  data() {
    // 这里存放数据
    return {
      formData: {
        workTypeName: ''
      },
      workTypeId: ''
    }
  },

  created() {
    // this.refresh()
  },
  methods: {
    submit() {
      this.$emit('getTarget', { checked: this.formData })
      this.$emit('close')
    },
    cancelDialog() {
      this.$emit('close')
      // this.$emit('update:visible', false)
    },
    getWorkTypeValue(e) {
      this.$set(this.formData, 'constructionPersonNames', '')
      this.$set(this.formData, 'constructionPersonIds', '')
      this.workTypeId = e
      this.formData.workTypeName = this.$getLabelFromArg('workType', e)
    },
    handleUserSelected(e) {
      console.log('施工人员', e)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .treeView {
    margin-bottom: 15px;
  }
  .buttons {
    margin: 10px 0;
  }
}
</style>
