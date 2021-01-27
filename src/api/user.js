import request from '@/utils/request'
import store from '@/store'

export function login(data) {
    return request({
        url: store.state.system.PATH_API + 'login',
        method: 'post',
        data
    })
}
