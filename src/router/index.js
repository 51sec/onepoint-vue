import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

import BasicSetting from '@/views/basic-config/index'
import MoreSetting from '@/views/more-config/index'
import Login from '@/views/login/index'
import Layout from '@/layout/index'

import FileList from '@/views/file-list/index'
import Dashboard from '@/views/dashboard/index'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: Login,
        name: 'Login',
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/file:/',
        children: [
            {
                path: '/file:*',
                name: 'FileList',
                component: FileList
            },

            {
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard
            },
            {
                path: 'setting',
                redirect: {name: 'BasicSetting'}
            },
            {
                path: 'setting/basic',
                name: 'BasicSetting',
                component: BasicSetting
            },
            {
                path: 'setting/more',
                name: 'MoreSetting',
                component: MoreSetting,
            }
        ]
    },
    {
        path: '*',
        redirect: '/'
    }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes,

})

const router = createRouter()

export default router