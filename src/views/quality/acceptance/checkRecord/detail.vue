<template>
  <div>
    <div class="info">
      <div class="content">
        <ul>
          <li style="width: 100%;">
            <span class="label">单位编号</span>
            <span class="val">4654654654</span>
          </li>
          <li style="width: 100%;">
            <span class="label">单位名称</span>
            <span class="val"></span>
          </li>
          <li style="width: 100%;">
            <span class="label">项目种类</span>
            <span class="val">
              <SelectList v-model="projectType" type="projectTypeList" />
            </span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <el-button type="primary" @click="toEdit($route.query.id)">编辑</el-button>
      </div>
    </div>
    <div v-if="projectType === 0">
      <EditTable v-model="tableList" :tableColumn="checkColumn" :validRules="validRules" />
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      projectType: 0,
      orderInfo: {
        number: 'GB50300-2013',
        type: '国家标准',
        creator: '张静如',
        content: '建筑工程施工质量验收统一标准.pdf',
        time: '2020-02-23 10:00:00',
        remark:
          '这是一段变更备注。Blah blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan'
      },
      tableList: [
        {
          id: 1,
          number: 'JC0001',
          name: '2月份检查计划',
          count: '300',
          planTime: '2019-2-30',
          check: '符合设计要求',
          type: '',
          creator: '张佑轩',
          time: '2020/1/11'
        }
      ],
      requestFlag: false,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '资料名称'
        },
        {
          field: 'number',
          title: '份数'
        },
        {
          field: 'number',
          title: '备注'
        },
        {
          field: 'name',
          title: '操作',
          slots: {
            default: ({ row }) => [<el-link>上传</el-link>]
          }
        }
      ]
    }
  },
  methods: {
    toEdit(id) {
      this.$router.push({ path: 'checkStandardEdit', params: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
