import axios from 'axios'
import Vue from 'vue'
import store from '../store/index'


const service = axios.create({
    baseURL: "https://api.github.com",
    timeout: 15000
})

service.interceptors.request.use(
    config => {
        let token = store.state.token.token
        if (token) {
            let sp = "?"
            if (config.url.indexOf("?") >= 0) {
                sp = "&"
            }
            // 取消直接通过access_token的校验方式
            // config.url = config.url + sp + "access_token=" + token
            // 使用Authorization的授权
            config.headers = {
                'Authorization': 'token ' + token
            }
        }
        return config
    },
    error => {

    }
)


service.interceptors.response.use(
    response => {
        let responseJson = response.data
        return response
    },
    error => {
        let message
        switch (error.response.status) {
            case 401:
                message = "Token错误"
                break
            default:
                message = error.response.data.message
                break
        }
        Vue.prototype.$message({
            message: message,
            type: 'error'
        })
        return Promise.reject('error')
    }
)

export default service
