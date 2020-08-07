<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>建筑工程施工质量验收统一标准:({{ orderInfo.number }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">类别</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creator }}</span>
          </li>
          <li>
            <span class="label">内容</span>
            <span class="val">
              <FileList :ids="orderInfo.files" />
            </span>
          </li>

          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <el-button type="primary" @click="toEdit($route.query.id)">编辑</el-button>
      </div>
    </div>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>隐蔽部位明细</span>
        </div>
        <VXTable ref="table" :columns="tableDetailColumn" :pageShow="false" :tableData="tableList" />
      </el-card>
    </section>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>操作记录</span>
        </div>
        <VXTable ref="table" :columns="tableColumn" :tableData="tableList" />
      </el-card>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      orderInfo: {
        number: 'GB50300-2013',
        type: '国家标准',
        creator: '张静如',
        content: '建筑工程施工质量验收统一标准.pdf',
        time: '2020-02-23 10:00:00',
        remark:
          '这是一段备注这是一段备注这是一段备注这是一段备注这是一段备注这是一段备注这是一段备注这是一段备注这是一段备注'
      },
      tableList: [
        {
          id: 1,
          type: '国家标准',
          creator: '张佑轩',
          time: '2020/1/1110:11'
        }
      ],
      requestFlag: false,
      tableDetailColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'creator',
          title: '隐蔽部位'
        },
        {
          field: 'time',
          title: '隐蔽诶荣'
        },
        {
          field: 'type',
          title: '验收意见'
        },
        {
          field: 'content',
          title: '备注'
        }
      ],
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'creator',
          title: '操作人'
        },
        {
          field: 'time',
          title: '操作时间'
        },
        {
          field: 'type',
          title: '操作类型'
        },
        {
          field: 'content',
          title: '操作内容'
        },
        {
          field: '',
          title: '附件',
          width: 200,
          slots: {
            default: ({ row }) => {
              return [<el-button type="text">附件</el-button>]
            }
          }
        }
      ]
    }
  },
  methods: {
    toEdit(id) {
      this.$router.push({ path: 'checkStandardEdit', params: { id } })
    }
  }
}
</script>

<style scoped></style>
