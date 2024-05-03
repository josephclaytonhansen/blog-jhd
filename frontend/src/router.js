import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

//TODO: set up routes so that individual sites have different routes; change the contents of routes based on a "site" command line variable and the contents of the site's page directory. 
const routes = [
    //all these routes are for all sites and the dashboard, leave them alone
    { path: '/', component: () => import('./pages/Home.vue'), props : {thisPageComponentName: 'Home'} },  
    { path: '/login', component: () => import('./pages/Login.vue') },
    { path: '/register', component: () => import('./pages/Login.vue') },
    { path: '/cms', component: () => import('./pages/CMS.vue') },
    { path: '/author', component: () => import('./pages/Author.vue') },
    { path: '/me', component: () => import('./pages/Me.vue') },
    { path: '/profile/id/:id', component: () => import('./pages/Profile.vue') },
    { path: '/profile/:displayName', component: () => import('./pages/Profile.vue') },
    { path: '/user/:displayName', component: () => import('./pages/Profile.vue') },
    {path: '/seabasstest', component: () => import('./pages/SeabassTest.vue')},
    //end required routes
    // automated
    //end automated
    { path: '/:pathMatch(.*)*', component: () => import('./pages/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const lockedRoutes = [
  { path: '/cms', redirect: '/author', roles: ['admin'] },
  { path: '/me', redirect: '/login', roles: ['user'] },
  { path: '/author', redirect: '/login', roles: ['author', 'admin'] },
]

router.beforeEach(async (to, from, next) => {
    const lockedRoute = lockedRoutes.find(lockedRoute => to.path.startsWith(lockedRoute.path))
    if (!lockedRoute) {
      next()
      return
    }
  
    let user = localStorage.getItem('user')
    let token = localStorage.getItem('token')
    if (token && user) {
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
      let url = `${process.env.VUE_APP_SERVER_URL}/user/verify`
      let params = {
        token: token,
        user: user
      };
      try {
        let response = await axios.post(url, params, config)
        if (response.status !== 200) {

          next(lockedRoute.redirect)
        } else {

          if (lockedRoute.roles.includes('admin')) {
            url = `${process.env.VUE_APP_SERVER_URL}/user/isadmin`
            response = await axios.post(url, params, config)
            if (response.status !== 200) {
                next(lockedRoute.redirect)
            } else {
                next()
            }
        } else if (lockedRoute.roles.includes('author')) {
            url = `${process.env.VUE_APP_SERVER_URL}/user/isauthor`
            response = await axios.post(url, params, config)
            if (response.status !== 200) {
                next(lockedRoute.redirect)
            } else {
                next()
            }
        } else {
            next()
        }
        }
      } catch (err) {

        next(lockedRoute.redirect)
      }
    } else {

      next(lockedRoute.redirect)
    }
  })

export default router