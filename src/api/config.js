import request from '@/utils/request'
import store from '@/store'

const configAPI = {
    get PATH_API() {
        return store.state.system.PATH_API;
    },
    async getSysConfig() {
        return request({
            url: this.PATH_API + 'config',
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },
    async setSysConfig(data) {
        return request({
            url: this.PATH_API + 'config',
            method: 'post',
            headers: {accept: 'application/json'},
            data: data
        });
    },
    async setSysPass(data) {
        return request({
            url: this.PATH_API + 'user/password',
            method: 'post',
            headers: {accept: 'application/json'},
            data: data
        });
    },

    async getDrives() {
        return request({
            url: this.PATH_API + 'drives',
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },

    async getDrive(path='') {
        return request({
            url: this.PATH_API + 'drive?path=' + encodeURIComponent(path),
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },
    async addDrive(data) {
        return request({
            url: this.PATH_API + 'drive',
            method: 'post',
            headers: {accept: 'application/json'},
            data: data
        });
    },
    async removeDrive(path) {
        return request({
            url: this.PATH_API + 'drive?path=' + encodeURIComponent(path),
            method: 'delete',
            headers: {accept: 'application/json'}
        });
    },

    async getDriveConfig(path){
        return request({
            url: this.PATH_API + 'drive/config?path=' + encodeURIComponent(path),
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },
    async setDriveConfig(path,data){
        return request({
            url: this.PATH_API + 'drive/config?path=' + encodeURIComponent(path),
            method: 'post',
            headers: {accept: 'application/json'},
            data
        });
    },

    async runTimeInfo() {
        return request({
            url: this.PATH_API + 'sys/runtime',
            method: 'get',
            headers: {accept: 'application/json'},
        });
    },

    async exportConfig(data){
        return request({
            url: this.PATH_API + 'config/export',
            method: 'post',
            headers: {accept: 'application/json'},
            data
        });
    }
};
export default configAPI;