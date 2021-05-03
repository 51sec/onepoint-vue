import axios from "axios";
import store from "@/store";
import {Notification} from "element-ui";
import Vue from 'vue'

const request = axios.create({
    // withCredentials: true,
    validateStatus: () => true,
    timeout: 5000
})
request.interceptors.request.use(
    config => {
        config.baseURL = store.getters.baseAPIURL;
        const token = store.getters.token;
        if (token) config.headers['x-token'] = token;
        return config;
    }
)
request.interceptors.response.use(
    async response => {
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
                await store.dispatch('system/logout');
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

const ids = {};

function getId(path) {
    if (!path) return;
    if (path.endsWith('/')) path = path.slice(0, -1);
    return ids[path];
}

const op = Vue.prototype.$op = {
    open(url) {
        window.open(url, '_blank');
    },
    async site() {
        return request.get('public/site');
    },

    async login(username, password) {
        return request.post('login', {username, password});
    },
    async fetchDrives() {
        return request.get('config/drives');
    },
    async saveDrives(drives, version) {
        return request.post('config/drives', {drives, version});
    },
    async updatePassword(password0, password, version) {
        return request.post('user/password', {password, password0, version});
    },
    async fetchBasicConfig() {
        return request.get('config/basic');
    },
    async saveBasicConfig(basic, version) {
        return request.post('config/basic', {basic, version});
    },
    async importConfig(password, config) {
        return request.post('config/import', {password, config});
    },
    async exportConfig(password) {
        return request.post('config/export', {password});
    },

    async runTimeInfo() {
        return request.get('system/runtime');
    },

    async reloadConfig() {
        return request.get('system/reload');
    },


    //eg: /a/b/c/
    async ls(path, page) {
        return request.get('file:' + encodeURI(path), {params: {page, id: ids[path.slice(0, -1)]}}).then(data => {
            const {list} = data;
            list.forEach(e => ids[path + e.name] = e.id);
            return data;
        });
    },

    // eg: /a/b/c
    async rm(path) {
        return request.delete('file:' + encodeURI(path), {params: {id: ids[path]}});
    },

    async touch(path, name, content) {
        return request.post('file:', {command: 'touch', path, name, content, id: getId(path)});
    },

    async upload(path, name) {
        return this._1path_name('upload', path, name);
    },

    async mkdir(path, name) {
        return this._1path_name('mkdir', path, name);
    },
    async ren(path, name) {
        return this._1path_name('ren', path, name);
    },
    async mv(srcPath, desPath) {
        return this._2path('mv', srcPath, desPath);
    },
    async cp(srcPath, desPath) {
        return this._2path('cp', srcPath, desPath)
    },

    async _1path_name(command, path, name) {
        return request.post('file:', {command, path, name, id: getId(path)});
    },
    async _2path(command, path, desPath) {
        return request.post('file:', {
            command,
            path,
            desPath,
            id: getId(path),
            desId: getId(desPath),
        });
    }
}
export default {op};