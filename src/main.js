import Vue from 'vue'

Vue.config.productionTip = false

import 'default-passive-events'
import Element from 'element-ui'
Vue.use(Element);

import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/display.css';

import '@/styles/bootstrap-grid.min.css'

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    attempt: 1
})

import InfiniteLoading from 'vue-infinite-loading';
Vue.use(InfiniteLoading);

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon

//import i18n from './i18n'

import '@/permission'

import '@/api/op'

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})
