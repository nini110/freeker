const state = {
    username: '',
    account: '',
    accountId: null,
    userImg: ''
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
    }
}
export default {
    state,
    mutations,
    namespaced: true
}