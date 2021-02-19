import Vue from 'vue';
const getters = {
    fileListCache: state =>{
        return state.fileList.cache;
    },
    fileListMenu:state=>{
        return state.fileList.menuData;
    },
    fileListUpload:state=>{
        return state.fileList.upload;
    },
    fileListTouch:state=>{
        return state.fileList.touch;
    },
    path:state=>{
        return state.fileList.path;
    },
    listData:state=>{
        const p = state.fileList.path;
        const c = state.fileList.cache;
        if(c[p]===undefined)Vue.set(c,p,{});
        return c[p];
    },
    baseURL:state=>{
        return state.system.baseURL;
    },
    token:state=>state.system.token,
    flag:state=>state.system.flag
}
export default getters