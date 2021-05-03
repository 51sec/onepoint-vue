import store from './store'
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    if (store.getters.version0 === 1) {
        if (to.name !== 'BasicSetting') {
            next({name: 'BasicSetting'});
        } else {
            next();
        }
        return;
    }


    // start progress bar
    NProgress.start()

    // set page title
    document.title = (store.getters.publicData.site || {}).name + ' ' + to.name

    // determine whether the user has logged in
    const hasToken = store.getters.token

    if (hasToken) {
        console.log(to)
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({path: '/'})
            NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
        } else {
            next()
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
