<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="选择设备"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="synthesize">
          <el-input
            v-model="pageQuery.synthesize"
            placeholder="编码/名称/规格及型号/使用人/安装地点/创建人"
            style="width: 314px;"
            suffix-icon="el-icon-search"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="pageQuery.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择"
            end-placeholder="请选择"
            style="width: 220px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="pageQuery.status" placeholder="请选择状态" style="width: 120px;">
            <el-option label="草稿" value="1"></el-option>
            <el-option label="待审核" value="2"></el-option>
            <el-option label="已通过" value="3"></el-option>
            <el-option label="已驳回" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="equipmentStatus">
          <el-select v-model="pageQuery.equipmentStatus" placeholder="请选择状态" style="width: 120px;">
            <el-option label="在用" value="1"></el-option>
            <el-option label="进场" value="2"></el-option>
            <el-option label="退场" value="3"></el-option>
            <el-option label="故障维修" value="4"></el-option>
            <el-option label="设备保养" value="5"></el-option>
            <el-option label="报废停用" value="6"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <VXTable
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      :columns="tableColumn"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      @radioChange="radioChange"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import api from '@/api/device/equipment/standingBook'
export default {
  name: 'SelectSafePlanDialog',
  mixins: [PageMixin],
  props: {
    visible: {}
  },
  data() {
    return {
      pageQuery: {},
      request: api.list,
      // 表格表头
      tableColumn: [
        { type: 'radio', width: 50 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'equipmentNum',
          title: '编码'
        },
        {
          field: 'equipmentName',
          title: '名称'
        },
        {
          field: 'specification',
          title: '规格及型号'
        },
        {
          field: 'useStatus',
          title: '设备状态'
        },
        {
          field: 'equipmentType',
          title: '设备属性'
        },
        {
          field: 'principalName',
          title: '使用人'
        },
        {
          field: 'depositLocation',
          title: '安装地点'
        },
        {
          field: 'creatorName',
          title: '创建人'
        },
        {
          field: 'createTime',
          title: '创建时间'
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                  编辑
                </el-button>,
                <el-button type="text" onClick={() => this.remove([row.id])}>
                  删除
                </el-button>,
                <el-button type="text" onClick={() => this.toDetail(row.id, row)}>
                  查看
                </el-button>
              ]
            }
          }
        }
      ]
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      this.radioRow = {}
    },
    submit() {
      this.$emit('update:visible', false)
      this.$emit('choose', this.radioRow)
    }
  }
}
</script>

<style scoped></style>
