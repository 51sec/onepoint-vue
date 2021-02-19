import axios from 'axios'
import {Notification} from 'element-ui'
import store from '@/store'
import router from "@/router";

// create an axios instance
const service = axios.create({
    baseURL: '', //process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    validateStatus: () => true,
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        config.baseURL = store.state.system.baseURL;
        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['X-Token'] = store.getters.token
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        if (response.status >= 400) {
            const res = response.data;
            const err = new Error(res.message || res.error || 'Error');
            err.data = res.data;
            err.type = res.error;
            err.normal = true;
            console.log('err' + err) // for debug
            Notification({
                title: '错误',
                message: err.message,
                duration: 5 * 1000,
                type: 'error'
            });
            if (res.error === 'UnauthorizedToken') {
                store.commit('system/SET_STATE', {token: ''})
                return router.push({path: `/login?redirect=${router.currentRoute.path}`});
            }
            return Promise.reject(err);
        }
        const res = response.data;
        console.log(res)
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        Notification({
            title: '错误',
            message: error.message,
            duration: 3 * 1000,
            type: 'error'
        });
        return Promise.reject(error)
    }
)

export default service
