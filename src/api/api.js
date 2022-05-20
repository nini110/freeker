import request from './request.js'
const BASE_PATH = 'http://114.67.229.243:8001'
export const selfExpendPH = request({
    url:`${BASE_PATH}/myselfwork/myself_brand_consume/`,
    method:'post',
    responseType: 'form-data'
})