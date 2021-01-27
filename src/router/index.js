import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

import ConfigParams from '@/views/config-params/index'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/redirect/*',
        component: ()=>import('@/views/redirect/index'),
        hidden: true,
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        name:'Login',
        hidden: true
    },
    {
        path: '/',
        component: () => import('@/layout/index'),
        redirect: '/file:/',
        children: [
            {
                path: '/file:*',
                name: 'FileList',
                component: () => import('@/views/file-list/index')
            },
            {
                path: 'drive-add',
                name: 'DriveAdd',
                component: ConfigParams,
                meta:{
                    type:'add'
                }
            },
            {
                path: 'drive-edit',
                name: 'DriveEdit',
                component: ConfigParams,
                meta:{
                    type:'edit'
                }
            },
            {
                path: 'drive-config',
                name: 'DriveConfig',
                component: ConfigParams,
                meta:{
                    type:'config'
                }
            },
            {
                path: 'setting',
                name: 'SysSetting',
                component: ConfigParams,
                meta:{
                    type: 'base'
                }
            },
            {
                path: 'pass-setting',
                name: 'PassSetting',
                component: () => import('@/views/update-pass/index'),
            },
            {
                path: 'drive-list',
                name: 'DriveList',
                component: () => import('@/views/drive-list/index'),
            },
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard'
            }
        ]
    },
    {
        path: '*',
        component:() => import('@/views/empty'),
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