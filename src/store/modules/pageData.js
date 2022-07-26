const state = {
    username: '',
    account: '',
    accountId: null,
    userImg: '',
    SSO: '',
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
}
const actions = {

}
export default {
    state,
    mutations,
    actions,
    namespaced: true
}