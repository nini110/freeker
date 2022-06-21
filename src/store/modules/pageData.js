const state = {
    account: '',
    userImg: ''
}
const mutations = {
    SET_ACCOUNT: (state, view) => {
        state.account = view
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