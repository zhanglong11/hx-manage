<template>
  <div>
    <div class="info">
      <div class="content">
        <h6 class="title">
          <i class="icon"></i>
          <span>检验批验收记录:({{ orderInfo.number }})</span>
        </h6>
        <ul>
          <li>
            <span class="label">验收类型</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">验收人</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">验收日期</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">所属分项</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">分包单位</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">检验批部位</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">检验批容量</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>

          <li>
            <span class="label">施工依据</span>
            <span class="val">{{ orderInfo.type }}</span>
          </li>
          <li>
            <span class="label">验收依据</span>
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
          <span>检验批明细</span>
        </div>
        <EditTable v-model="tableList" :tableColumn="checkColumn" :validRules="validRules" />
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="primary" @click="submit">保存并提交</el-button>
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
      // 表格表头
      checkColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'number',
          title: '验收项目',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '项目种类',
          slots: {
            default: ({ row }) => [<el-select v-model={row.number} />]
          }
        },
        {
          field: 'name',
          title: '设计要求及规范规范',
          slots: {
            default: ({ row }) => [<el-input v-model={row.number} />]
          }
        }
      ],
      validRules: {
        number: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    toEdit(id) {
      this.$router.push({ path: 'checkStandardEdit', params: { id } })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped></style>
