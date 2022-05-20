import {
    createStore
} from 'vuex';
import getters from './getter.js'
import VuexPersistence from 'vuex-persist';

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default;
    return modules
}, {})
const vuexLocal = new VuexPersistence({
    key: 'freeker',
    storage: window.localStorage,
    reducer: (state) => {
        return state
    }
})
export default createStore({
    namespaced: true,
    modules,
    getters,
    plugins: [vuexLocal.plugin]
})