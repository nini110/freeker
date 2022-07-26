import { stationMailList } from "@/api/api";

const state = {
    intervalTag: null
}
const mutations = {
    SET_INTERVALTAG: (state, view) => {
        state.intervalTag = view
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