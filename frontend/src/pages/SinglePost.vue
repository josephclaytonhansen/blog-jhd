<script setup>
const props = defineProps(
    {id: String}
)

const post = ref({})

import { ref, onBeforeMount } from 'vue'

const getPostById = async (id) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/id/` + id
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        await fetch(url, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200) {
                throw new Error('Network error- could not get post')
            }
            post.value = await response.json()
        })
    } catch (error) {
        console.error(error)
    }
}

const incrementPostViews = async (id) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/incrementviews/` + id
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        await fetch(url, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            post.value.views += 1
        })
    } catch (error) {
        console.error(error)
    }
}

onBeforeMount(async() => {
    await getPostById(props.id)
    incrementPostViews(props.post._id)
})

</script>

<template>
    {{post}}
</template>