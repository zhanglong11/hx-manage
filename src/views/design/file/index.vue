<!--
 * @Description:
 * @Author:
 * @Date: 2020-01-09 18:05:43
 -->
<template>
  <div>
    <section>
      <Flow idSelect="File" :height="300" title="项目标题" @taskUniqueIdChange="taskUniqueIdChange" />
    </section>
    <section>
      <el-menu :default-active="activeId" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu v-if="dropList.length" index="1">
          <template slot="title">{{ firstTabName }}</template>
          <el-menu-item v-for="item in dropList" :key="item.id" :index="item.id">{{ item.name }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-for="item in fixedMenuList" :key="item.id" :index="item.id">{{ item.name }}</el-menu-item>
      </el-menu>
      <!-- 自定义+存档区+内部共享区 -->
      <DropPane
        v-show="cooperation !== '外部协作'"
        ref="dropPane"
        :targetObj="targetObj"
        :departmentId="activeId"
        :taskUniqueId="taskUniqueId"
        :module="module"
        :taskTitle="taskTitle"
        :userList="userList"
      />
      <!-- 自定义菜单 -->
      <!-- <Custom
        v-show="cooperation !== '存档区' && cooperation !== '内部共享' && cooperation !== '外部协作'"
        ref="custom"
        :targetObj="targetObj"
        :departmentId="activeId"
        :taskUniqueId="taskUniqueId"
        :module="module"
        :taskTitle="taskTitle"
        :userList="userList"
      />-->
      <Cooperation v-show="cooperation === '外部协作'" ref="cooperation" :taskUniqueId="taskUniqueId" />
    </section>
  </div>
</template>

<script>
import Flow from '@/views/design/components/Flow'
// 先获取flow中的数据
import api from '@/api/design/file'
import Cooperation from './dropMenu/cooperation.vue'
import DropPane from './dropMenu/index'
export default {
  name: 'File',
  components: {
    DropPane,
    Cooperation,
    Flow
  },

  data() {
    return {
      userList: [],
      targetObj: '',
      // 自定义类型：默认unit
      module: 'unit',
      firstTabName: '',
      // 一级id
      activeId: '',
      // 里程碑id
      taskUniqueId: '',
      // 任务标题
      taskTitle: '',
      // 下拉菜单
      dropList: [],
      // 固定三个下拉
      fixedMenuList: [
        {
          name: '存档区',
          id: '2',
          flag: 'pigeonhole'
        },
        {
          name: '内部共享',
          id: '3',
          flag: 'share'
        },
        {
          name: '外部协作',
          id: '4',
          flag: 'collaboration'
        }
      ],
      // 判断是否外部协作
      cooperation: ''
    }
  },
  mounted() {
    this.getFirst()
  },
  methods: {
    // 更新里程碑任务
    taskUniqueIdChange(e, title) {
      this.taskUniqueId = e
      this.taskTitle = title
    },
    async getFirst() {
      let obj = {
        projectId: localStorage.getItem('projectId')
      }
      let res = await api.getFirstList(obj)
      let list = JSON.parse(JSON.stringify(res.data))
      // 双循环:赋值权限
      list.forEach(item => {
        item.userList.forEach(childItem => {
          childItem.list = []
        })
      })
      this.userList = list
      this.dropList = res.data ? res.data : []
      if (res.data && res.data.length > 0) {
        this.firstTabName = this.dropList[0].name
        this.activeId = this.dropList[0].id
      } else {
        this.firstTabName = this.fixedMenuList[0].name
        this.activeId = this.fixedMenuList[0].id
      }
      this.targetObj = {
        name: this.firstTabName,
        id: this.activeId
      }
    },
    handleSelect(e) {
      this.activeId = e
      // 切换pid置为0
      this.$refs.dropPane.resetPid()
      // this.$refs.custom.resetPid()
      if (this.dropList.some(item => item.id === e)) {
        //自定义下拉
        this.module = 'unit'
        this.firstTabName = this.dropList.find(item => item.id === e).name
        this.targetObj = {
          name: this.firstTabName,
          id: e
        }
        this.cooperation = ''
      } else {
        let target = this.fixedMenuList.find(item => item.id === e)
        this.cooperation = target.name
        this.targetObj = {
          name: target.name,
          module: target.flag
        }
        if (target.name === '外部协作') {
          this.$refs.cooperation.getList()
        }
        this.module = target.flag
      }
    }
  }
}
</script>
