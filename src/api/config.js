import request from '@/utils/request'
import store from '@/store'

const configAPI = {
    get PATH_API() {
        return store.state.system.PATH_API;
    },
    async getDrivesParams() {
        return request({
            url: this.PATH_API + 'sys/drive-add',
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },
    async getSysConfig() {
        return request({
            url: this.PATH_API + 'sys/config',
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },
    async setSysConfig(data) {
        return request({
            url: this.PATH_API + 'sys/config',
            method: 'post',
            headers: {accept: 'application/json'},
            data: data
        });
    },
    async setSysPass(data) {
        return request({
            url: this.PATH_API + 'sys/pass',
            method: 'post',
            headers: {accept: 'application/json'},
            data: data
        });
    },
    async getDrives() {
        return request({
            url: this.PATH_API + 'sys/drives',
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },

    async getDrive(path) {
        return request({
            url: this.PATH_API + 'sys/drive?path=' + encodeURIComponent(path),
            method: 'get',
            headers: {accept: 'application/json'}
        });
    },

    async addDrive(data) {
        return request({
            url: this.PATH_API + 'sys/drive',
            method: 'post',
            headers: {accept: 'application/json'},
            data: data
        });
    },
    async removeDrive(path) {
        return request({
            url: this.PATH_API + 'sys/drive?path=' + encodeURIComponent(path),
            method: 'delete',
            headers: {accept: 'application/json'}
        });
    },
    async runTimeInfo() {
        return request({
            url: this.PATH_API + 'sys/runtime',
            method: 'get',
            headers: {accept: 'application/json'},
        });
    }
};
export default configAPI;