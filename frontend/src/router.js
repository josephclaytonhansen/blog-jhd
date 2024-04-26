import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

const routes = [
    { path: '/', component: () => import('./pages/Home.vue') },  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const lockedRoutes = [
  { path: '/cms', redirect: '/', role: 'admin' },
  { path: '/profile', redirect: '/login', role: 'user' }
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
    let url = 'http://localhost:3720/user/verify'
    // TODO: update to production URL
    let params = {
      token: token,
      user: user
    };
    try {
      let response = await axios.post(url, params, config)
      if (response.status !== 200) {
        localStorage.clear()
        next(lockedRoute.redirect)
        return
      }

      if (lockedRoute.role === 'admin') {
        url = 'http://localhost:3720/user/isadmin'
        response = await axios.post(url, params, config)
        if (response.status !== 200) {
          localStorage.clear()
          next(lockedRoute.redirect)
        } else {
          next()
        }
      } else {
        next()
      }
    } catch (err) {
      localStorage.clear()
      next(lockedRoute.redirect)
    }
  } else {
    localStorage.clear()
    next(lockedRoute.redirect)
  }
})

export default router