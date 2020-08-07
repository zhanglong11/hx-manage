<template>
  <div>
    <!--    <template v-if="showSelectVisa">-->
    <!--      <span class="contractName"-->
    <!--        ><span class="greyFont">已选签证: </span> <strong>{{ visa.accessName }}</strong></span-->
    <!--      >-->
    <!--      <el-button v-if="showSelectBtn" type="primary" @click="handleSelectVisa">选择签证</el-button>-->
    <!--    </template>-->
    <div style="float: right;">
      <span>
        <span class="greyFont">{{ statusContent }}</span
        >：
        <span style="margin-right: 50px;">{{
          visa.status !== null ? baseStatus.filter(item => item.value === visa.status)[0].label : ''
        }}</span>
      </span>
    </div>

    <SelectVisaDialog
      v-if="visaSelectVisible"
      :visible="visaSelectVisible"
      @close="visaSelectVisible = false"
      @submit="handleEmit"
    ></SelectVisaDialog>
  </div>
</template>
<script>
import SelectVisaDialog from '@/views/cost/components/SelectVisaDialog'
import baseStatus from '@/lib/basicStatus'
export default {
  name: 'CardHead',
  components: { SelectVisaDialog },
  props: {
    statusContent: {
      type: [Number, String],
      default: ''
    },
    showSelectVisa: {
      type: Boolean,
      default: true
    },
    showSelectBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      baseStatus: baseStatus,
      visaSelectVisible: false,
      visa: {
        accessName: '请先选择签证',
        status: 2
      }
    }
  },
  methods: {
    handleSelectVisa() {
      this.visaSelectVisible = true
    },
    handleEmit(row) {
      this.visa = row
      this.visaSelectVisible = false
      this.$emit('change', row.id)
    }
  }
}
</script>
<style lang="less" scoped>
.contractName {
  display: inline-block;
  min-width: 400px;
}
.greyFont {
  font-size: 16px;
  font-weight: bold;
  color: #999999;
}
</style>
