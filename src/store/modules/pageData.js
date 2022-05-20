const state = {
    user: '诺基亚'
}
const mutations = {
    SET_USER: (state, view) => {
        state.user = view
    }
}
export default {
    state,
    mutations,
    namespaced: true
}