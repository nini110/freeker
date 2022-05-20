import axios from 'axios';
import Qs from 'qs'
import { message } from 'ant-design-vue';
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
        if(config.responseType === 'form') {
            let data = config.data
            let result = {}
            for(let i in data) {
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
            for(let i in data) {
                let item = data[i]
                if (Array.isArray(item) && item.length > 0 ) {
                    item.forEach((val) => {
                        formData.append('file', val)
                    })
                } else {
                    formData.append(i, item)
                }
            }
            config.data = formData
        }
    }
    return config
})
service.interceptors.response.use(response => {
    return response
}, error => {
    console.log(error)
    
    if(error && error.response) {
        switch(error.response.status) {
            case 404:
                error.message = '网络请求不存在'
        }
        
    }
    message.info(error);
})

async function axiosHttp(body, config) {
    let {url, method, responseType} = config
    return await service({
        url,
        method,
        responseType,
        data: responseType === 'form-data' ? body : JSON.parse(JSON.stringify(body))
    })
}
export default function request(config) {
    return (body={}) => {
        return axiosHttp(body, config)
    }
}