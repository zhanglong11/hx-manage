<!--
@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，添加项目新增(编辑)模态框，修改比例(10%)

@任务名称: 2690/项目管理react迁移vue
@开发人员: 董渊海
@修改日期: 2020-03-24
@任务类型: 修改代码，添加项目删除接口，修改比例(5%)

@任务名称: task#2854 【智慧工地2.0-前端】工作台切图及功能开发
@开发人员: 耿为刚
@修改日期: 2020-04-01
@任务类型: 项目管理功能迁移及修改
-->
<template>
  <div>
    <!-- 搜索工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.type" clearable placeholder="类型" @change="search()">
            <el-option v-for="item in projectType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryForm.projectDate"
            type="date"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="日期"
            @change="search()"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.name" placeholder="项目名称" @change="search()" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索工具栏 end -->
    <div class="project-list">
      <el-row :gutter="20">
        <el-col v-for="(item, i) in dataList" :key="i" :xl="4" :lg="6" :md="8">
          <el-card :body-style="{ padding: '0px' }">
            <router-link
              :style="`background-image: url(${item.thumb})`"
              to=""
              class="item-image"
              @click.native="toDetails(item)"
            />
            <div class="box">
              <p class="desc">
                <span class="item-name" @click="toDetails(item)" v-text="item.name" />
                <el-tag size="small" :color="setTagColor(item.serviceName)">
                  {{ item.serviceName }}
                </el-tag>
                <span class="item-time">{{ item.projectDate | formatData }}</span>
              </p>
              <p class="item-code" v-text="item.code" />
              <div class="item-footer">
                <p>
                  <img :src="item.principalHeadImage" />
                  <span>负责人：{{ item.principalName }}</span>
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 14:00:30
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-04-01 17:57:07
 */
import { projectApi } from '../api/project'
import ColorHash from 'color-hash'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      projectType: [], // 项目类型
      queryForm: {
        // 查询条件
        name: '',
        page: 1,
        projectDate: null,
        rows: 10,
        type: ''
      },
      queryFormBack: {},
      dataList: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.getProjectType()
    this.queryProject()
  },
  // 方法集合
  methods: {
    // 这是tag颜色
    setTagColor(name) {
      if (!name) {
        return
      }
      const colorHash = new ColorHash({ hue: 90 })
      return colorHash.hex(name)
    },
    // 项目类型列表
    async getProjectType() {
      const result = await projectApi.getProjectType()
      const datas = result.data || []
      const projectType = []
      datas.map(item => {
        projectType.push({
          label: item.argText,
          value: item.argCode
        })
      })
      this.projectType = projectType
    },
    // 查询项目列表
    async queryProject() {
      const result = await projectApi.queryProject(this.queryForm)
      const datas = result.data.records || []
      datas.map(item => {
        item.thumb = item.thumb || require('../images/project-background.jpg')
      })
      this.dataList = datas
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryProject()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryProject()
    },
    // 跳转项目详情
    toDetails(item) {
      this.$store.commit('setProjectLocalStorage', item)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.project-list {
  .item-image {
    width: 100%;
    padding-top: 56.25%;
    background-size: cover;
    display: block;
  }
  p {
    margin: 0;
    padding: 0;
  }
  .box {
    font-size: 14px;
    .desc {
      padding: 20px 20px 0;
      display: flex;
      align-items: center;
      .item-name {
        margin-right: 10px;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #108de9;
        cursor: pointer;
      }
      .el-tag {
        color: #fff;
        border-color: transparent;
      }
      .item-time {
        margin-left: 10px;
        color: #999;
        flex: 1;
        text-align: right;
        white-space: nowrap;
      }
    }
    .item-code {
      padding: 8px 20px 10px;
      color: rgba(0, 0, 0, 0.45);
    }
    .item-footer {
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #efefef;
      height: 50px;
      p {
        display: inline-flex;
        align-items: center;
      }
      img {
        margin-right: 6px;
        width: 24px;
        height: 24px;
      }
      .item-footer-btn {
        .el-button {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
