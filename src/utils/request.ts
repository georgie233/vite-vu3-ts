import axios from 'axios'
import Cookie from "js-cookie";

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName = xsrfHeaderName
axios.defaults.xsrfCookieName = xsrfHeaderName
axios.defaults.baseURL = '';

// 认证类型
const AUTH_TYPE = {
    BEARER: 'Bearer',
    BASIC: 'basic',
    AUTH1: 'auth1',
    AUTH2: 'auth2',
}

// http method
const METHOD = {
    GET: 'get',
    POST: 'post',
    DELETE: 'delete',
    PUT: 'put',
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url: string, method: string, params: object, config: object) {
    switch (method) {
        case METHOD.GET:
            return axios.get(url, {params, ...config})
        case METHOD.POST:
            return axios.post(url, params, config)
        case METHOD.DELETE:
            return axios.delete(url, config)
        case METHOD.PUT:
            return axios.put(url, params, config)
        default:
            return axios.get(url, {params, ...config})
    }
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth: any, authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            Cookie.set(xsrfHeaderName, 'Bearer ' + auth.token, {expires: auth.expireAt})
            break
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break
    }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            Cookie.remove(xsrfHeaderName)
            break
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break
    }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
    switch (authType) {
        case AUTH_TYPE.BEARER:
            if (Cookie.get(xsrfHeaderName)) {
                return true
            }
            break
        case AUTH_TYPE.BASIC:
        case AUTH_TYPE.AUTH1:
        case AUTH_TYPE.AUTH2:
        default:
            break
    }
    return false
}

// request interceptor(请求拦截器)
axios.interceptors.request.use(config => {
    if (config.xsrfCookieName && !Cookie.get(config.xsrfCookieName)) {
        //本地没有登录信息
    }
    return config
}, () => {
    console.log('err')
})

// response interceptor(加载响应拦截器)
axios.interceptors.response.use(config => {
    return config
}, () => {
    console.log('err')
})

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url: string) {
    const params: any = {}
    if (!url || url === '' || typeof url !== 'string') {
        return params
    }
    const paramsStr = url.split('?')[1]
    if (!paramsStr) {
        return params
    }
    const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
    for (let i = 0; i < paramsArr.length / 2; i++) {
        const value = paramsArr[i * 2 + 1]
        params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
    }
    return params
}

export {
    METHOD,
    AUTH_TYPE,
    request,
    setAuthorization,
    removeAuthorization,
    checkAuthorization,
    parseUrlParams
}
