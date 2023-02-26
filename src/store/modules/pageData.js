const state = {
    username: '',
    account: '',
    accountId: null,
    userImg: '',
    SSO: '',
    menuTag: null,
    firstLog: false,// 第一次登录
    verifyFlag: 0, //是否实名认证
}
const mutations = {
    SET_USERNAME: (state, view) => {
        state.username = view
    },
    SET_ACCOUNT: (state, view) => {
        state.account = view
    },
    SET_ACCOUNTID: (state, view) => {
        state.accountId = view
    },
    SET_USERIMG: (state, view) => {
        state.userImg = view
    },
    SET_SSO: (state, view) => {
        state.SSO = view
    },
    SET_MENUTAG: (state, view) => {
        state.menuTag = view
    },
    SET_FIRSTLOG: (state, view) => {
        state.firstLog = view
    },
    SET_VERIFYFLAG: (state, view) => {
        state.verifyFlag = view
    }
}
const actions = {

}
export default {
    state,
    mutations,
    actions,
    namespaced: true
}