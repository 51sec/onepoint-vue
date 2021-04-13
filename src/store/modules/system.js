import {getItem, setItem} from '@/utils/auth'
import router from "@/router";
import Vue from "vue";


const m = JSON.parse(getItem('MODE_PREFER') || '{}');

const state = {
    token: getItem('ADMIN_TOKEN'),
    version: Number(getItem('CONFIG_VERSION')),
    baseURL: getItem('BASE_URL'),
    PATH_API: getItem('PATH_API') || '/api/',
    mode: Object.assign({
        image: true,
        music: true,
        readme: true,
        tips: true,
        footer: true,
    }, m),
    publicData: {
        site: {},
        drives: [],
        tips: [],
        version:0
    }
}

const mutations = {
    SET_TOKEN: (state, token = '') => {
        state.token = token
        setItem('ADMIN_TOKEN', token)
    },
    SET_BASE: (state, {baseURL, PATH_API}) => {
        state.baseURL = baseURL
        state.PATH_API = PATH_API
        setItem('BASE_URL', baseURL)
        setItem('PATH_API', PATH_API)
    },
    SET_VERSION: (state, version) => {
        if (state.version > version) {
            Vue.prototype.$notify.error({
                title: '本地版本号错误',
                message: '本地版本号高于服务器，无法加载服务器配置信息',
                duration: 5 * 1000,
            });
        } else {
            state.version = version;
            setItem('CONFIG_VERSION', version)
        }
    },
    RESET_ALL: (state) => {
        state.version = 0
        setItem('CONFIG_VERSION', 0)
        state.token = ''
        setItem('ADMIN_TOKEN', '')
    },
    SAVE_MODE: (state) => {
        setItem('MODE_PREFER', JSON.stringify(state.mode))
        Vue.prototype.$message.success({
            message: '保存成功',
            duration: 1500
        })
    }
}

const actions = {
    logout: ({commit}) => {
        commit('SET_TOKEN', '');
        return router.push(`/login?redirect=${router.currentRoute.fullPath}`)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
