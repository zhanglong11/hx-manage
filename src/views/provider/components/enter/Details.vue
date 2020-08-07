<!--
 * @Description: 进场进本信息
 * @Version: 
 * @Autor: 
 * @Date: 2020-02-19 16:13:34
 * @LastEditTime: 2020-02-21 13:55:08
 -->
<template>
  <div>
    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <div>{{ form.id ? form.supplierName : '分包商基本信息' }}</div>
        </div>
        <el-form ref="form" label-width="110px" :model="form">
          <el-row>
            <el-col :span="20">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="进场日期">
                    {{ form.enterTime }}
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="计划退场日期">
                    {{ form.estimatedLeaveTime }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="进场所在地">
                    {{ form.location }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="机械设备数量">
                    {{ form.equipmentNum }}
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="劳务人员数量">
                    {{ form.employeeNum }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="进场负责人">
                    {{ form.principalName }}
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="备注">
                    {{ form.remark }}
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="附件">
                    <FileList :ids="form.fileId" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="item-status">
              <p>状态</p>
              <p class="status">{{ stateFilter(form.status) }}</p>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </section>
  </div>
</template>

<script>
import supplierType from '@/lib/supplier/supplierType'
import supplierState from '@/lib/supplier/supplierState'
export default {
  props: {
    form: {
      type: Object
    },
    // 编辑页面name
    editName: {
      type: String
    }
  },
  data() {
    return {
      fileList: [
        {
          name: '文件1',
          value: '23'
        }
      ]
    }
  },
  methods: {
    stateFilter(state) {
      return _.get(
        supplierState.find(item => item.value === state),
        'label',
        '-'
      )
    },
    download(item) {},
    goEdit() {
      this.$router.push({ name: this.editName, query: { id: this.form.id } })
    }
  }
}
</script>

<style lang="less" scoped></style>
