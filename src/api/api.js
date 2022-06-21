import request from './request.js'
const BASE_PATH = 'http://192.168.90.209:8000'
const BASE_PATH2 = 'http://114.67.229.243:8003'

// 用户登录
export const userLogin = request({
    url:`${BASE_PATH2}/index_api/user/login`,
    method:'post',
})

// 项目中心列表
export const getProjList = request({
    url:`${BASE_PATH2}/index_api/ad_project_hall`,
    method:'get',
})
// 项目中心列表--详情
export const getProjDetail = request({
    url:`${BASE_PATH2}/index_api/ad_project`,
    method:'get',
})
// 项目中心列表--申请
export const applyProj = request({
    url:`${BASE_PATH2}/index_api/ad_project_user`,
    method:'post',
})
// 任务中心列表
export const planProj = request({
    url:`${BASE_PATH2}/index_api/ad_project_user`,
    method:'get',
})
// 任务中心列表 -- 上传数据
export const uploadData = request({
    url:`${BASE_PATH2}/index_api/ad_project_user`,
    method:'patch',
})
// 任务中心列表 -- 确认完成
export const okFinish = request({
    url:`${BASE_PATH2}/index_api/ad_project_user/to_be_adopted`,
    method:'post',
})
// 任务中心列表 -- 重新确认完成
export const upAagain = request({
    url:`${BASE_PATH2}/index_api/ad_project_user/reject_the_application`,
    method:'post',
})
// 任务中心列表 -- 待人工审核的取消申请
export const calcelApply = request({
    url:`${BASE_PATH2}/index_api/ad_project_user`,
    method:'delete',
})
