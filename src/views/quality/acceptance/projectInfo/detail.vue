<template>
  <div>
    <div class="info">
      <div class="content">
        <ul>
          <li style="width: 100%;">
            <span class="label">单位编号</span>
            <span class="val">{{ orderInfo.engineeringNumber }}</span>
          </li>
          <li style="width: 100%;">
            <span class="label">单位名称</span>
            <span class="val">{{ orderInfo.engineeringName }}</span>
          </li>
          <li style="width: 100%;">
            <span class="label">项目种类</span>
            <span class="val">{{
              _.get(_.find(paramList.projectTypeList, { value: orderInfo.projectType }), 'label')
            }}</span>
          </li>
        </ul>
      </div>
    </div>
    <VXTable ref="table" :columns="type === 2 ? recordColumn : infoColumn" :tableData="detailList" :pageShow="false" />
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/api/quality/acceptance/projectInfo'
import paramList from '@/lib/paramList'
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {},
      detailList: [],
      paramList,
      type: 1,
      requestFlag: false,
      // 表格表头
      infoColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'materialName',
          title: '资料名称  '
        },
        {
          field: 'materialCopies',
          title: '份数',
          width: 140
        },
        {
          field: 'remark',
          title: '备注'
        },
        {
          field: 'fileIds',
          title: '操作',
          slots: {
            default: ({ row }) => [<FileList ids={row.fileIds} />]
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
          title: '好点'
        },
        {
          field: 'generalNum',
          title: '一般点'
        },
        {
          field: 'almostNum',
          title: '差点'
        },
        {
          field: 'remark',
          title: '备注'
        }
      ]
    }
  },
  watch: {
    'orderInfo.materialType'(v) {
      this.type = v === 2 ? 2 : 1
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.detail(this.$route.query.id)
      this.orderInfo = res.data
      this.detailList = res.data.detailList
    },
    toEdit(id) {
      this.$router.push({ path: 'projectInfoEdit', query: { id } })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
