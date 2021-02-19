import {getItem, setItem} from '@/utils/auth'

const state = {
    flag: getItem('CONFIG_FLAG'),
    token: getItem('ADMIN_TOKEN'),
    baseURL: getItem('BASE_URL'),
    PATH_API: getItem('PATH_API') || '/api/',
    PATH_ADMIN: getItem('PATH_ADMIN') || '/admin/',
}

const mutations = {
    SET_FLAG: (state, flag) => {
        state.flag = flag
        setItem('CONFIG_FLAG', flag)
    },
    SET_STATE: (state, {token, flag}) => {
        state.token = token
        state.flag = flag
        setItem('ADMIN_TOKEN', token)
        setItem('CONFIG_FLAG', flag)
    },
    SET_BASE: (state, {baseURL, PATH_API, PATH_ADMIN}) => {
        state.baseURL = baseURL
        state.PATH_API = PATH_API
        state.PATH_ADMIN = PATH_ADMIN
        setItem('BASE_URL', baseURL)
        setItem('PATH_API', PATH_API)
        setItem('PATH_ADMIN', PATH_ADMIN)
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
