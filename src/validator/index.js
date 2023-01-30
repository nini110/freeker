
import checkUtilIn from './checkUtils'


export const checkMobile = (rule, value) => {
    let result  = checkUtilIn.checkPhone(value)
    if (result === 1) {
        return Promise.reject("请输入手机号");
    } else if (result === 2) {
        return Promise.reject("请输入有效的手机号");
    } else {
        return Promise.resolve()
    }
}
export const checkMobileCode = (rule, value) => {
    let result  = checkUtilIn.checkNum(value)
    if (result === 1) {
        return Promise.reject("请输入短信验证码");
    } else if (result === 2) {
        return Promise.reject("请输入有效的短信验证码");
    } else {
        return Promise.resolve()
    }
}
export const checklgPwd = (rule, value) => {
    let result  = checkUtilIn.checkPwd(value)
    if (result === 1) {
        return Promise.reject("请输入密码");
    } else if (result === 2) {
        return Promise.reject("请输入有效的密码");
    } else {
        return Promise.resolve()
    }
}
export const checkUsername = (rule, value) => {
    let result  = checkUtilIn.checkSpecial(value)
    if (result === 1) {
        return Promise.reject("请输入昵称");
    } else if (result === 2) {
        return Promise.reject("请输入有效的昵称");
    } else {
        return Promise.resolve()
    }
}

export const checkPlat = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请选择平台");
    }
}

export const checkLevel = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请选择等级");
    }
}

export const checkNumber = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请输入编号");
    }
}
export const checkFile = (rule, value) => {
    if (value.length > 0) {
        return Promise.resolve();
    } else {
        return Promise.reject("请上传资质证明");
    }
}
