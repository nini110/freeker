import request from './request.js'
const BASE_PATH = 'http://192.168.90.209:8000'
const BASE_PATH2 = 'http://114.67.229.243:8004'

// 用户登录
export const userLogin = request({
    url: `${BASE_PATH2}/admin_api/adminuser/login`,
    method: 'post',
})
// 注册
export const userRegist = request({
    url: `${BASE_PATH2}/admin_api/adminuser/register`,
    method: 'post',
})
// 修改密码
export const userEditPwd = request({
    url: `${BASE_PATH2}/admin_api/adminuser/get_pwd`,
    method: 'post',
})
// 发送验证码--注册
export const getPhoneCode = request({
    url: `${BASE_PATH2}/admin_api/adminuser/register_send_msg`,
    method: 'post',
})
// 发送验证码--登录
export const getPhoneCodeLog = request({
    url: `${BASE_PATH2}/admin_api/adminuser/login_send_msg`,
    method: 'post',
})
// 发送验证码-- 找回密码
export const getPhoneCodePwd = request({
    url: `${BASE_PATH2}/admin_api/adminuser/get_pwd_send_msg`,
    method: 'post',
})



// 个人详情
export const userDetail = request({
    url:`${BASE_PATH2}/index_api/user/user_info`,
    method:'get',
})
// 修改头像
export const editAvatar = request({
    url:`${BASE_PATH2}/index_api/user/update_avatar`,
    method:'post',
    responseType: 'form-data'
})
// 上传资质信息
export const uploadZizhi = request({
    url:`${BASE_PATH2}/index_api/certificate`,
    method:'post',
    responseType: 'form-data'
})
// 查询资质信息
export const getZizhi = request({
    url:`${BASE_PATH2}/index_api/certificate`,
    method:'get',
})
// 删除资质
export const delZizhi = request({
    url:`${BASE_PATH2}/index_api/certificate`,
    method:'delete',
})
// 绑定美事通
export const bindMst = request({
    url:`${BASE_PATH2}/index_api/mst_account`,
    method:'post',
})
// 查询美事通
export const searchMst = request({
    url:`${BASE_PATH2}/index_api/mst_account`,
    method:'get',
})
// 删除美事通
export const delMst = request({
    url:`${BASE_PATH2}/index_api/mst_account`,
    method:'delete',
})
// 修改昵称
export const editNickName = request({
    url:`${BASE_PATH2}/index_api/user`,
    method:'patch',
})
// 注册
export const registerUser = request({
    url:`${BASE_PATH2}/index_api/user`,
    method:'post',
})
// ------------------------------------------------------
// 站内信-列表
export const stationMailList = request({
    url:`${BASE_PATH2}/index_api/station_mail`,
    method:'get',
})
// 站内信-单个查看
export const mailSee = request({
    url:`${BASE_PATH2}/index_api/station_mail`,
    method:'get',
})
// 站内信-一键已读
export const mailSeeAll = request({
    url:`${BASE_PATH2}/index_api/station_mail/have_read`,
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
// 结算列表 -- 申请结算
export const applyPay = request({
    url:`${BASE_PATH2}/index_api/ad_project_user/apply_settlement`,
    method:'post',
})
// 结算中心 -- 列表
export const payCenterList = request({
    url:`${BASE_PATH2}/index_api/ad_project_user/settlement_center`,
    method:'get',
})
// 结算中心 -- 项目绑定美事通
export const projBindMst = request({
    url:`${BASE_PATH2}/index_api/ad_project_user`,
    method:'patch',
})


// 新版个人信息---修改基本信息
export const editBaseInfo = request({
    url:`${BASE_PATH2}/index_api/user`,
    method:'patch',
})
// 新版个人信息---获取基本信息
export const userBaseInfo = request({
    url:`${BASE_PATH2}/index_api/user/user_info`,
    method:'get',
})
// 新版个人信息---实名认证
export const realUserVarify = request({
    url:`${BASE_PATH2}/index_api/user/real_name_authentication`,
    method:'post',
    responseType: 'form-data'
})
