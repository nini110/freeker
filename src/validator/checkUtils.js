const checkUtilIn = {
    // 中文字母数字
    checkCnStrNum: (val) => {
        let res = new RegExp(/^[\u4E00-\u9FA5A-Za-z0-9]+$/).test(val)
        if (!val) {
            return 1
        }
        if (!res) {
            return 2
        }
        return 3
    },
    // 数字
    checkNum: val => {
        const reg = /^\d+$/
        const res = reg.test(val)
        if (!val) {
            return 1
        }
        if (!res) {
            return 2
        }
        return 3
    },
    // 手机
    checkPhone: val => {
        let res = new RegExp(
            /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|191|192|193|195|196|198|199)[0-9]{8}$/
        ).test(val)
        if (!val) {
            return 1
        }
        if (!res) {
            return 2
        }
        return 3
    },
    // 特殊符号
    checkSpecial: val => {
        // let res =
        //     "[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？ ]"
        let res =
            "[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？ ]"
        if (!val) {
            return 1
        }
        if (val.match(res)) {
            return 2
        }
        return 3
    },
    // 密码： （除了中文）
    checkPwd: val => {
        let res = new RegExp(/[\u4E00-\u9FA5]+/).test(val)
        if (!val) {
            return 1
        }
        if (res) {
            return 2
        }
        return 3
    },

}
export default checkUtilIn