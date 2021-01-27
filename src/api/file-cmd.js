import request from '@/utils/request'
import store from '@/store'

//@todo 临时方案 丑就丑点吧 以后再改

const IDS = store.state.fileList.idCache;

function getID(path) {
    if (path.endsWith('/')) path = path.slice(0, -1);
    return IDS[path] || '';
}

const fileAPI = {

    get PATH_PREFIX() {
        return store.state.system.PATH_API + 'file:';
    },

    async ls(path, page) {
        const data = await request({
            url: this.PATH_PREFIX + path,
            method: 'get',
            params: {page, id: getID(path)},
            headers: {accept: 'application/json'}
        });
        if (data.list) {
            data.list.forEach(e => {
                IDS[path + e.name] = e.id;
            })
        } else if (data.file) {
            IDS[path] = data.file.id;
        }
        return data;
    },

    async mkdir(path, name) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            data: {name, command: 'mkdir'},
            params: {id: getID(path)},
            headers: {accept: 'application/json'}
        });
    },

    async mv(path, path2) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            params: {id: getID(path)},
            data: {path2, command: 'mv', id2: getID(path2)},
            headers: {accept: 'application/json'}
        });
    },

    async cp(path, path2) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            params: {id: getID(path)},
            data: {path2, command: 'cp', id2: getID(path2)},
            headers: {accept: 'application/json'}
        });
    },

    async rm(path) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'delete',
            params: {id: getID(path)},
            headers: {accept: 'application/json'}
        });
    },

    async ren(path, name) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            params: {id: getID(path)},
            data: {name, command: 'ren'},
            headers: {accept: 'application/json'}
        });
    },

    async touch(path, name, content) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            params: {id: getID(path)},
            data: {name, content, command: 'touch'},
            headers: {accept: 'application/json'}
        });
    },

    async upload(path, name) {
        return request({
            url: this.PATH_PREFIX + path,
            method: 'post',
            params: {id: getID(path)},
            data: {name, command: 'upload'},
            headers: {accept: 'application/json'}
        });
    }
}
export default fileAPI;