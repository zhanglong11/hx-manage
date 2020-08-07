<template>
  <!--
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （2行）
     **/
     -->
  <div v-if="!$route.meta.hiddenLayout" :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
      <RightPanel :buttonBottom="150" iconDesc="项目讨论区" @close="clearForm">
        <chat ref="chat" />
      </RightPanel>
    </div>
  </div>
  <app-main v-else></app-main>
</template>

<script>
import RightPanel from '_c/RightPanel/index'
import { Navbar, Sidebar, AppMain, Chat } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import store from '@/store'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Chat,
    RightPanel
  },
  mixins: [ResizeMixin],
  data() {
    return {}
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    accessList() {
      return this.$store.state.app.accessList
    },
    // 是否显示头部菜单
    isShowHeaderMenu() {
      return this.$route.path.indexOf('/work-bench/') < 0
    }
  },
  created() {
    //this.$store.dispatch('app/getPermissionList')
    if (this.isShowHeaderMenu) {
      // 工作台不执行
      this.$store.dispatch('design/getProjectDetail')
    }
    this.$store.dispatch('user/getInfo')
  },
  methods: {
    clearForm() {
      this.$refs.chat.clearForm()
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 901;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
