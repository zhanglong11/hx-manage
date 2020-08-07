/*
 * @Description:
 * @Author:
 * @Date: 2020-01-15 09:09:52
 */

import { JSEncrypt } from 'jsencrypt'
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// 获取其他平台地址
export const getOrigin = (num = 1, design) => {
  const origin = location.origin
  const lastOrigin = parseInt(origin[origin.length - 1]) + num
  const newOrigin = origin.substring(0, origin.length - 1) + lastOrigin
  let url = `${newOrigin}/#`
  if (design) {
    // 设计协同跳转专用
    url = `http://${location.hostname}:${design}/#`
  }
  return url
}

// 登录加密
export const userEncryption = obj => {
  let PUBLIC_KEY =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChqImB8Pz4nTh3UBbA5m9zb+YCIwvop1Zxr8Bii6xoEt6+znWy/2WVXMV/NH28Yq34cH68VdcKSikEQlGnAqhci+9rrjVo0/vS2/D6RJcihXqfST9ZOMFsRJgxAQWyIbjL/Gf7HD5NrCM54TE+YOk/P6eI5Nc8lbkxXEavrLDtOwIDAQAB'

  // 使用公钥加密
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(PUBLIC_KEY)
  let loginName = encrypt.encrypt(obj.loginName)
  let password = encrypt.encrypt(obj.password)
  return {
    loginName,
    password
  }
}
