<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>隐蔽工程验收:({{ orderInfo.number }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">隐蔽工程编码</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">隐蔽项目</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">检查日期</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">验收意见</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.time }}</span>
          </li>
          <li>
            <span class="label">附件</span>
            <span class="val">
              <FileList :ids="orderInfo.fileIds" />
            </span>
          </li>
          <li>
            <span class="label">备注</span>
            <span class="val">{{ orderInfo.remark }}</span>
          </li>
        </ul>
      </div>
      <div class="status-box">
        <el-button type="primary" @click="toEdit($route.query.id)">编辑</el-button>
        <p class="status">状态</p>
        <p class="status-info">待审核</p>
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
