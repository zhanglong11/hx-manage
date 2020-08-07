<!--
/**
任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
开发人员：李建敏
日期：2020-3月-17日
任务类型：2、复制修改代码 （移动代码
**/
-->
<template>
  <div class="bpm-main is-footer">
    <div id="bpmn"></div>
    <div id="properties-wrap">
      <CustomProperties v-if="mounted" v-once id="properties-extend" :modeler="modeler"></CustomProperties>
      <div id="properties"></div>
    </div>
    <div class="footer-btn">
      <el-button type="primary" @click="exportDiagram(true)">导出XML</el-button>
      <el-button type="primary" @click="exportSVG(true)">导出SVG</el-button>
      <el-button type="primary" @click="save(0)">保存</el-button>
      <el-button type="primary" @click="save(1)">保存并部署</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script>
// 引入绘图组件
import bpmnJs from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （6行）
 **/
import '@/assets/workflow/css/app.css'
import propertiesPanelModule from '@/assets/workflow/properties-panel'
import propertiesProviderModule from '@/assets/workflow/properties-panel/provider/activiti'
/**
 bug名称：1196/bpmn文件从工作流移动过来之后，由于依赖路径问题无法运行项目
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：1、复制修改代码 （2行）
 **/
import activitiModdleDescriptor from '@/assets/descriptors/activiti.json' // 自动关联属性
import customTranslate from '@/assets/workflow/customTranslate/customTranslate' // 中文编码
import customControlsModule from '@/assets/workflow/customControls'
import CustomProperties from '../components/CustomProperties'
import customRendererModule from '../lib/customRender'
const customTranslateModule = {
  translate: ['value', customTranslate]
}
export default {
  name: 'Bpmn',
  components: { CustomProperties },
  props: ['id'],
  data() {
    return {
      modeler: {},
      form: {},
      mounted: false
    }
  },
  created() {
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （2行）
     **/
    this.$store.dispatch('workflow/getFormList')
    this.$store.dispatch('workflow/getRoleList')
  },
  mounted() {
    this.initBpmn()
  },
  methods: {
    // 初始化绘图
    initBpmn() {
      const modeler = new bpmnJs({
        container: '#bpmn',
        propertiesPanel: {
          parent: '#properties'
        },
        additionalModules: [
          propertiesPanelModule, // 右侧属性面板
          propertiesProviderModule,
          customTranslateModule, // 中文编码
          customControlsModule,
          customRendererModule
        ],
        moddleExtensions: {
          activiti: activitiModdleDescriptor // 自动关联属性
        }
      })
      this.modeler = modeler
      this.extendBpmnJs()
      this.mounted = true
      this.refresh()
    },
    // 扩展绘图组件 - 增加描述显示功能
    extendBpmnJs() {
      let tools = document.getElementsByClassName('entry')
      tools.forEach(e => {
        let title = e.getAttribute('title')
        let toolSpan = `<span class="title">${title}</span>`
        e.innerHTML = toolSpan
      })
    },
    // 刷新
    async refresh() {
      /**
       任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
       开发人员：李建敏
       日期：2020-3月-17日
       任务类型：2、复制修改代码 （1行）
       **/
      this.axios.workflow.get('activiti/model/xml/' + this.id).then(async res => {
        let datas = res.data
        datas.modelFormPermission = datas.modelFormPermission || []
        this.form = datas
        let xml = datas.model
        if (!xml) {
          xml = await fetch('/blank.bpmn').then(res => res.text())
        }
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xml, 'text/xml')
        const haveName = !!xmlDoc.getElementsByTagName('process')[0].getAttribute('name')
        if (!haveName) {
          xmlDoc.getElementsByTagName('process')[0].setAttribute('name', this.$route.query.name)
          const s = new XMLSerializer()
          xml = s.serializeToString(xmlDoc)
        }
        this.modeler.importXML(xml)
      })
    },
    // 导出XML
    exportDiagram(status) {
      let xmlName = `${this.form.description}.xml`
      return new Promise((resolve, reject) => {
        this.modeler.saveXML({ format: true }, (err, res) => {
          if (err) reject(err)
          else resolve(res)
          if (status) {
            this.downLoad(res, xmlName)
          }
        })
      })
    },
    // 导出SVG
    exportSVG(status) {
      let svgName = `${this.form.description}.svg`
      return new Promise((resolve, reject) => {
        this.modeler.saveSVG((err, res) => {
          if (err) reject(err)
          else resolve(res)
          if (status) {
            this.downLoad(res, svgName)
          }
        })
      })
    },
    // 下载导出的内容
    downLoad(file, fileName) {
      let blob = ''
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候）
      if (window.navigator.msSaveOrOpenBlob) {
        blob = new Blob([file], { type: 'text/plain' })
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        let eleLink = document.createElement('a')
        eleLink.download = fileName
        eleLink.style.display = 'none'
        blob = new Blob([file]) // 字符内容转变成blob地址
        eleLink.href = URL.createObjectURL(blob)
        document.body.appendChild(eleLink) // 触发点击
        eleLink.click()
        document.body.removeChild(eleLink) // 然后移除
      }
    },
    // 保存
    async save(type) {
      let bpmn_xml = await this.exportDiagram()
      let svg_xml = await this.exportSVG()
      let url = type ? '/activiti/model/saveAndDeploy' : '/activiti/model/save'

      this.axios.workflow
        .post(url, {
          ..._.pick(this.form, ['name']),
          bpmn_xml,
          svg_xml,
          modelId: this.id,
          name: this.modeler._definitions.rootElements[0].name,
          list: this.form.modelFormPermission || []
        })
        .then(res => {
          this.$message.success('操作成功')
          this.$router.back()
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.bpm-main {
  // background-color: #fff;
  position: relative;
  // width: 100vw;
  // height: 100vh;
  display: flex;
  // overflow: hidden;
  #bpmn {
    // height: 100%;
    flex: 1;
  }
  // 绘图右侧属性
  #properties-wrap {
    height: 100%;
    width: 360px;
    max-width: 360px;
    background: #f5f5f5;
    #properties {
      overflow: auto;
      width: 100%;
      // display: none;
      /deep/.bpp-properties-panel {
        background: none;
        .bpp-properties-header,
        .bpp-properties-tab-bar,
        .group-label,
        .bpp-textfield {
          display: none;
        }
      }
    }
  }

  footer {
    padding: 15px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  /deep/.bjs-powered-by {
    display: none;
  }
  /deep/.djs-context-pad {
    transition: all 0.4s;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: 1px #ddd solid;
    border-radius: 6px;
    padding: 10px;
    .group {
      display: flex;
      flex-direction: column;
      .entry {
        margin: 5px 0;
        font-size: 26px;
        min-width: 26px;
        width: auto;
        height: 26px;
        transition: all 0.4s;
        display: flex;
        align-items: center;
        cursor: pointer;

        &.bpmn-icon-intermediate-event-none,
        &.bpmn-icon-task,
        &.bpmn-icon-call-activity,
        &.bpmn-icon-text-annotation {
          display: none;
        }
        &:after {
          margin-left: 5px;
          font-size: 12px;
          color: #666;
          white-space: nowrap;
        }
        &.bpmn-icon-end-event-none {
          &:after {
            content: '结束';
          }
        }
        &.bpmn-icon-gateway-none {
          &:after {
            content: '网关';
          }
        }
        &.bpmn-icon-user-task {
          &:after {
            content: '任务';
          }
        }
        &.bpmn-icon-screw-wrench {
          &:after {
            content: '设置';
          }
        }
        &.bpmn-icon-trash {
          &:after {
            content: '移除';
          }
        }
        &.bpmn-icon-connection-multi {
          &:after {
            content: '关联';
          }
        }
        &:hover {
          color: #409eff;
          background: none;
          transform: scale(1.1);
          font-weight: bold;
          &:after {
            color: #409eff;
          }
        }
      }
    }
  }
  /deep/.djs-popup-header {
    display: none !important;
  }
  /deep/div[data-container-id*='StartEvent_'] {
    .bpmn-icon-screw-wrench,
    .bpmn-icon-trash {
      display: none !important;
    }
  }
  /deep/.djs-element {
    &.selected .djs-outline {
      stroke: #409eff;
      stroke-width: 2px;
    }
    &:hover .djs-outline {
      stroke: #f56c6c;
      stroke-width: 2px;
    }
  }
  /deep/.djs-popup {
    border: 0;
    background: none;
    .djs-popup-body {
      transition: all 0.4s;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border: 1px #ddd solid;
      border-radius: 6px;
      padding: 5px;
      .entry {
        margin: 5px 0;
        transition: all 0.4s;
        cursor: pointer;
        &::before {
          font-size: 20px;
        }
        span {
          font-size: 12px;
          color: #666;
        }
        &:hover {
          color: #409eff;
          background: none;
          transform: scale(1.1);
          font-weight: bold;
          span {
            color: #409eff;
          }
        }
      }
      .bpmn-icon-gateway-eventbased {
        display: none;
      }
      // div[class*='-message'],
      // div[class*='-timer'],
      // div[class*='-condition'],
      // div[class*='-signal'],
      // div[class*='-escalation'],
      // div[class*='-error'],
      // div[class*='-compensation'],
      // div[class*='-terminate'],
      // div[class*='-intermediate-event-none'],
      // .bpmn-icon-task,
      // .bpmn-icon-send,
      // .bpmn-icon-receive,
      // .bpmn-icon-manual,
      // .bpmn-icon-business-rule,
      // .bpmn-icon-service,
      // .bpmn-icon-script,
      // .bpmn-icon-call-activity,
      // .bpmn-icon-subprocess-collapsed,
      // .bpmn-icon-subprocess-expanded {
      //   display: none;
      // }
    }
  }
  /deep/.djs-label {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif !important;
  }

  // 绘图工具左侧工具栏
  /deep/.djs-palette {
    display: none;
    padding: 10px 0;
    width: auto;
    .group {
      display: flex;
      flex-direction: column;
    }
    .entry {
      padding: 0 10px;
      position: relative;
      display: flex;
      align-items: center;
      //width: auto;
      height: auto;
      line-height: 40px;
      .title {
        padding-left: 10px;
        font-size: 11px;
        white-space: nowrap;
        color: #999;
        flex: 1;
        text-align: left;
      }
      &:hover {
        .title {
          color: rgb(255, 116, 0);
        }
      }
    }
  }
  /deep/.bpp-properties {
    .bpp-properties-group {
      padding: 0 15px;
      & > .group-label {
        font-style: normal;
      }
    }
    .bpp-properties-entry {
      margin-bottom: 5px;
    }
  }
  /deep/.bpp-properties-panel label {
    font-weight: normal;
  }
}
</style>
<style lang="less">
svg {
  .agree {
    stroke: #f00 !important;
  }
}
</style>
