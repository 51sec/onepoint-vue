import request from '@/utils/request'
import store from '@/store'

const fileAPI = {

    get PATH_PREFIX() {
        return store.state.system.PATH_API + 'file:';
    },

    async ls(path, page) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'get',
            params: {page},
            headers: {accept: 'application/json'}
        });
    },

    async mkdir(path, name) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            data: {name, command: 'mkdir'},
            headers: {accept: 'application/json'}
        });
    },

    async mv(path, path2) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            data: {path2, command: 'mv'},
            headers: {accept: 'application/json'}
        });
    },

    async cp(path, path2) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            data: {path2, command: 'cp'},
            headers: {accept: 'application/json'}
        });
    },

    async rm(path) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'delete',
            headers: {accept: 'application/json'}
        });
    },

    async ren(path, name) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            data: {name, command: 'ren'},
            headers: {accept: 'application/json'}
        });
    },

    async touch(path, name, content) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            data: {name, content, command: 'touch'},
            headers: {accept: 'application/json'}
        });
    },

    async upload(path, name) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            data: {name, command: 'upload'},
            headers: {accept: 'application/json'}
        });
    }
}
export default fileAPI;

