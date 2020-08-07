'use strict'
/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：2、复制修改代码 （移动位置）
 **/
var is = require('bpmn-js/lib/util/ModelUtil').is,
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  entryFactory = require('../../../factory/EntryFactory'),
  cmdHelper = require('../../../helper/CmdHelper')

var forEach = require('lodash/forEach')

function getLinkEventDefinition(element) {
  var bo = getBusinessObject(element)

  var linkEventDefinition = null
  if (bo.eventDefinitions) {
    forEach(bo.eventDefinitions, function(eventDefinition) {
      if (is(eventDefinition, 'bpmn:LinkEventDefinition')) {
        linkEventDefinition = eventDefinition
      }
    })
  }

  return linkEventDefinition
}

module.exports = function(group, element, translate) {
  var linkEvents = ['bpmn:IntermediateThrowEvent', 'bpmn:IntermediateCatchEvent']

  forEach(linkEvents, function(event) {
    if (is(element, event)) {
      var linkEventDefinition = getLinkEventDefinition(element)

      if (linkEventDefinition) {
        var entry = entryFactory.textField({
          id: 'link-event',
          label: translate('Link Name'),
          modelProperty: 'link-name'
        })

        entry.get = function() {
          return { 'link-name': linkEventDefinition.get('name') }
        }

        entry.set = function(element, values) {
          var newProperties = {
            name: values['link-name']
          }
          return cmdHelper.updateBusinessObject(element, linkEventDefinition, newProperties)
        }

        group.entries.push(entry)
      }
    }
  })
}
