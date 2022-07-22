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

// 登录
export const checkLogAccount = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请输入账户");
    }
}

export const checkLogPwd = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请输入密码");
    }
}
export const checkLogPhone = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请输入短信验证码");
    }
}
export const checkPhone = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请输入手机号");
    }
}
export const checkUsername = (rule, value) => {
    if (value) {
        return Promise.resolve();
    } else {
        return Promise.reject("请输入昵称");
    }
}
