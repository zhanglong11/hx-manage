<!--
* @任务编号:多选危险源
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 全新代码
-->
<template>
  <el-dialog
    width="1100px"
    :modal="true"
    top="10vh"
    title="选择危险源"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="keyWords">
          <el-input
            v-model="pageQuery.keyWords"
            style="width: 420px;"
            placeholder="危险源/关键部位/项目责任领导/责任人/责任人联系方式/创建人"
          >
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="伤害类别" prop="category">
          <SelectList v-model="pageQuery.category" :multiple="true" :hasAllOption="false" type="harmTypeList" />
        </el-form-item>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <VXTable
      ref="table"
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      :columns="tableColumn"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      @selectionChange="selectionChange"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import paramList from '@/lib/paramList'
import api from '@/api/safe/plan/dangerous'
export default {
  name: 'SelectDangerousDialog',
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
        { type: 'checkbox', width: 80 },
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'dangerSource',
          title: '危险源'
        },
        {
          field: 'name',
          title: '关键部位'
        },
        {
          field: 'harmCategoryNames',
          title: '伤害类别'
        },
        {
          field: 'precautionaryMeasure',
          title: '防范措施'
        },
        {
          field: 'principalLeader',
          title: '项目责任领导'
        },
        {
          field: 'principal',
          title: '责任人'
        },
        {
          field: 'principalContact',
          title: '责任人联系方式'
        },
        {
          field: 'remark',
          title: '备注'
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
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => [
              <span>{_.get(_.find(paramList.safeCommonStatus, { value: row.status }), 'label')}</span>
            ]
          }
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                row.status === 0 ? (
                  <el-button type="text" onClick={() => this.toEdit(row.id, row)}>
                    编辑
                  </el-button>
                ) : null,
                row.status === 0 ? (
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                ) : null,
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
    handleTabClick(tab) {},
    cancelDialog() {
      this.$emit('update:visible', false)
      this.setAllSelection()
    },
    submit() {
      this.$emit('update:visible', false)
      this.$emit('getDanger', this.selectedList)
      this.setAllSelection()
    }
  }
}
</script>

<style scoped></style>
