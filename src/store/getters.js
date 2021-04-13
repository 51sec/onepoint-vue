import Vue from 'vue';

const getters = {
    fileListCache: state => {
        return state.fileList.cache;
    },
    fileListUpload: state => {
        return state.fileList.upload;
    },
    touchData: state => {
        return state.fileList.touchData;
    },

    mode: state => {
        return state.system.mode
    },
    publicData:state =>{
        return state.system.publicData
    },

    previewData: state => {
        return state.fileList.previewData;
    },

    path: state => {
        return state.fileList.path;
    },

    pathPrefix: state => {
        return state.system.baseURL + state.fileList.path;
    },
    baseURL: state => {
        return state.system.baseURL;
    },
    baseAPIURL: state => {
        return state.system.baseURL + state.system.PATH_API;
    },

    listData: state => {
        const p = state.fileList.path;
        const c = state.fileList.cache;
        if (c[p] === undefined) Vue.set(c, p, {});
        return c[p];
    },

    token: state => state.system.token,
    version: state => state.system.version
}
export default getters