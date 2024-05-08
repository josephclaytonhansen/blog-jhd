import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

const routes = [
    //all these routes are for all sites and the dashboard, leave them alone
    { path: '/', name: 'home', component: () => import('./pages/Home.vue'), props : {thisPageComponentName: 'Home', header: true, footer: true} },  
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
  { path: '/me', redirect: '/login', roles: ['user', 'admin', 'author'] },
  { path: '/author', redirect: '/login', roles: ['author', 'admin'] },
]

router.beforeEach(async (to, from, next) => {
  const lockedRoute = lockedRoutes.find(lockedRoute => to.path.startsWith(lockedRoute.path))
  if (!lockedRoute) {
      next()
      return
  }

  let user = localStorage.getItem('user')
  let session = sessionStorage.getItem('session')
  let config = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
  };

  let checkUrl = `${process.env.VUE_APP_SERVER_URL}/user/checksession`
  let checkParams = {
      user: user,
      session: session
  }
  try {
      let checkResponse = await axios.post(checkUrl, checkParams, config)
      if (checkResponse.status == 200) {
          if (lockedRoute.roles.includes(checkResponse.data.message)) { 
              next()
          } else {
              next(lockedRoute.redirect)
          }
      } else {
          next(lockedRoute.redirect)
      }
  } catch (err) {
      console.log('Session check failed')
      next(lockedRoute.redirect)
  }
})

export default router