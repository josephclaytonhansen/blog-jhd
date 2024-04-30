<script setup>
    import {pinia} from '../../main.js'
    import {userStore} from "../../userStore.js"

    import { onMounted, ref, computed } from 'vue'

    const loggedInStatus = ref(false)

    const store = userStore(pinia)

    const comments = ref([])

    const getComments = async () => {
        let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/comment/`, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get comments')
        }
        const data = await response.json()
        return data
    }

    const flagComment = async (id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/flag/` + id
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        try {
            await fetch(url, {
                method: 'PUT',
                headers: config.headers,
                credentials: 'include'
            }).then(async (response) => {
                if (response.status !== 200) {
                    throw new Error('Network error- could not flag comment')
                }
                toast.success('Comment flagged')
                comments.value = await getComments()
            }).catch(async (error) => {
                toast.error(error.message || error.error || 'Error flagging comment')
            })
        } catch (error) {
            toast.error(error.message || error.error || 'Error flagging comment')
        }
    }

    const deleteComment = async (id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/delete/` + id
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        try {
            await fetch(url, {
                method: 'DELETE',
                headers: config.headers,
                credentials: 'include',
            }).then(async (response) => {
                if (response.status !== 200) {
                    toast.error('Error deleting comment')
                    comments.value = getComments()
                    throw new Error('Network error- could not delete comment')
                }
                toast.success('Comment deleted')
                comments.value = await getComments()
            }).catch((error) => {
                toast.error(error.message || error.error || 'Error deleting comment')
            })
        } catch (error) {
            toast.error(error.message || error.error || 'Error deleting comment')
        }
    }

    const unflagComment = async (id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/unflag/` + id
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        try {
            await fetch(url, {
                method: 'PUT',
                headers: config.headers,
                credentials: 'include'
            }).then(async (response) => {
                if (response.status !== 200) {
                    throw new Error('Network error- could not unflag comment')
                }
                toast.success('Comment unflagged')
                comments.value = await getComments()
            }).catch(async (error) => {
                toast.error(error.message || error.error || 'Error unflagging comment')
            })
        } catch (error) {
            toast.error(error.message || error.error || 'Error unflagging comment')
        }
    }

    onMounted(async () => {
        store.user ? loggedInStatus.value = true : loggedInStatus.value = false
        if (loggedInStatus.value){
            if (localStorage.getItem('comments')) {
                comments.value = JSON.parse(localStorage.getItem('comments'))
                let temp = await getComments()
                if (JSON.stringify(comments.value) !== JSON.stringify(temp)) {
                    comments.value = temp
                    localStorage.setItem('comments', JSON.stringify(comments.value))
                }
            } else {
                comments.value = await getComments()
                localStorage.setItem('comments', JSON.stringify(comments.value))
            }
        } else {
            toast.info('Your session has expired. Please log in.')
            router.push('/login')
        }
    })
</script>

<template>
    
</template>