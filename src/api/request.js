import axios from 'axios';
import Qs from 'qs'
import store from '../store'
import {
    message
} from 'ant-design-vue';
export const service = axios.create({
    timeout: 150000
})
const headers = {
    'form': 'application/x-www-form-urlencoded',
    'json': 'application/json',
    'form-data': 'multipart/form-data'
}
service.interceptors.request.use(config => {
    if (config.method === 'get') {
        config.headers = {
            'content-type': headers['form']
        }
        config.params = {
            ...config.data
        }
    } else if (config.method === 'post') {
        config.headers = {
            'content-type': headers[config.responseType]
        }
        if (config.responseType === 'form') {
            let data = config.data
            let result = {}
            for (let i in data) {
                let item = data[i]
                if (Array.isArray(item) && item.length > 0) {
                    result[i] = JSON.stringify(item)
                    config.data = Qs.stringify(result)
                } else {
                    const res = Qs.parse(data)
                    config.data = Qs.stringify({
                        ...res
                    })
                }
            }
        } else if (config.responseType === 'form-data') {
            let formData = new FormData()
            let data = config.data
            for (let i in data) {
                let item = data[i]
                if (Array.isArray(item) && item.length > 0) {
                    item.forEach((val) => {
                        formData.append('img', val)
                    })
                } else {
                    formData.append(i, item)
                }
            }
            config.data = formData
        }
    }
    if (store.getters.SSO) {
        config.headers.AUTHORIZATION = store.getters.SSO
    }
    return config
})
service.interceptors.response.use(response => {
    if (response.data.code === 4101) {
        message.error('登录失效，请重新登录')
        store.commit("pageData/SET_SSO", '');
        store.commit("pageData/SET_USERNAME", '');
        store.commit("pageData/SET_ACCOUNT", '');
        store.commit("pageData/SET_ACCOUNTID", '');
        store.commit("pageData/SET_USERIMG", '');
        store.commit("interval/SET_INTERVALTAG", false);
        setTimeout(() => {
            window.location.replace('http://tool.afocus.com.cn/freeker/#/home')
        }, 1000);
        return
    }
    return response
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 404:
                error.message = '网络请求不存在'
                break
            case 405:
                error.message = '网络请求不允许'
                break
            default:
                error.message = '请检查网络连接'
                break

        }
    }
    message.info(error.message);
})

async function axiosHttp(body, params, config) {
    let {
        url,
        method,
        responseType
    } = config
    return await service({
        url: params ? `${url}/${params}/` : `${url}/`,
        method,
        responseType,
        data: responseType === 'form-data' ? body : JSON.parse(JSON.stringify(body))
    })
}
export default function request(config) {
    return (body = {}, params = "") => {
        return axiosHttp(body, params, config)
    }
}