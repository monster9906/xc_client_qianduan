import http from './../../../base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;
// 页面列表
export const page_list = (page,size,params) => {
  //params为json格式
  //使用querystring将json对象转成key/value串
  let querys = querystring.stringify(params)
  return http.requestQuickGet(apiUrl+'/cms/page/list/'+page+'/'+size+'/?'+querys)
}
// 站点列表
export const site_list = (page,size) => {
  return http.requestQuickGet(apiUrl+'/cms/site/list/'+page+'/'+size)
}
// 模板列表
export const template_list = (page,size)=>{
  return http.requestQuickGet(apiUrl+'/cms/template/list/'+page+'/'+size)
}
// 提交页面
export const page_add = params=>{
  return http.requestPost(apiUrl+'/cms/page/add',params)
}
// 页面查询
export const page_get= id=>{
  return http.requestQuickGet(apiUrl+'/cms/page/get/'+id)
}
// 页面修改操作
export const page_edit= (id,params)=>{
  return http.requestPut(apiUrl + '/cms/page/edit/'+id,params)
}
// 删除页面操作
export const page_del= id=>{
  return http.requestDelete(apiUrl+'/cms/page/delete/'+id)
}
//生成静态文件
export const page_generateHtml= id => {
  return http.requestPost(apiUrl+'/cms/page/generateHtml/'+id)
}
//取出静态文件
export const page_getHtml= id => {
  return http.requestQuickGet(apiUrl+'/cms/page/getHtml/'+id)
}
//发布页面
export const page_postPage= id => {
  return http.requestPost(apiUrl+'/cms/page/postPage/'+id)
}
