import Vue from 'vue'

const state = {
    cache: {},
    menuData: {
        row: null,
        srcRow: null,
        srcPath: null,
        mvOrCp: 0,
        x: 0,
        y: 0,
    },
    upload: {
        visible: false,
        queue: [],
        now: null
    },
    touch: {
        visible: false,
        name: '',
        content: ''
    },
    path: '/',
}

const mutations = {
    CACHE_CLEAR(state, path) {
        const c = state.cache;
        Object.keys(c).forEach(k => {
            if (k.startsWith(path)) c[k] = null;
        });
    },
    CACHE_DELETE(state, {path}) {
        if (state.cache[path]) state.cache[path] = null;
    },
    CACHE_APPEND(state, {path, row}) {
        const c = state.cache[path];
        if (c) {
            c.list.unshift(row);
        }
    },
    CACHE_POP(state, {path, row}) {
        const c = state.cache[path];
        if (c) {
            const i = c.list.indexOf(row);
            if (i < 0) return;
            c.list.splice(i, 1);
            mutations.CACHE_DELETE(state, {path: path + row.name});
        }
    },
    CACHE_MOVE(state, {srcPath, srcRow, path}) {
        mutations.CACHE_POP(state, {path: srcPath, row: srcRow});
        mutations.CACHE_APPEND(state, {path, row: srcRow});
    },
    CACHE_DIRTY(state, {path, dirty}) {
        const c = state.cache[path];
        if (c) {
            if (c.$dirty === undefined) Vue.set(c, '$dirty', dirty);
            else c.$dirty = dirty;
        }
    },
    PATH_SET(state, path) {
        state.path = path;
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
