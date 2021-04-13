import Vue from 'vue'

const state = {
    cache: {'/': {list: [], $s: null}},
    upload: {
        visible: false,
        queue: [],
        now: null
    },
    touchData: {
        visible: false,
        name: '',
        content: ''
    },
    path: '/',
    previewData: {
        visible: false,
        item: null,
        imgMode: true,
        musicMode: true,
    },
}

const mutations = {
    SET_PATH(state, path) {
        const c = state.cache;
        const p = path;
        if (c[p] === undefined) {
            Vue.set(c, p, {list: [], $s: null});
        }
        state.path = path;
    },
    SHOW_PREVIEW(state, item) {
        state.previewData.item = item;
        state.previewData.visible = true;
    },
    SHOW_TOUCH(state, payload) {
        state.touchData.visible = true;
        if (payload) {
            state.touchData.name = payload.name || '';
            state.touchData.content = payload.content || '';
        }
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
