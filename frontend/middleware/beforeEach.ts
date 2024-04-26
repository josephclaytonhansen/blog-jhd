// middleware/beforeEach.ts
import axios from 'axios'

const lockedRoutes = [
    { path: '/cms', redirect: '/', role: 'admin' },
    { path: '/profile', redirect: '/login', role: 'user' }
]

export default async function ({ route, redirect, app }) {
    const lockedRoute = lockedRoutes.find(lockedRoute => route.path.startsWith(lockedRoute.path))
    if (!lockedRoute) {
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
                redirect(lockedRoute.redirect)
                return
            }

            if (lockedRoute.role === 'admin') {
                url = 'http://localhost:3720/user/isadmin'
                response = await axios.post(url, params, config)
                if (response.status !== 200) {
                    localStorage.clear()
                    redirect(lockedRoute.redirect)
                }
            }
        } catch (err) {
            localStorage.clear()
            redirect(lockedRoute.redirect)
        }
    } else {
        localStorage.clear()
        redirect(lockedRoute.redirect)
    }
}