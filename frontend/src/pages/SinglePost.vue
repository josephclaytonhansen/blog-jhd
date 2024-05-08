<script setup>
const props = defineProps(
    {post: Object}
)

import { ref, onBeforeMount } from 'vue'


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
            post.views += 1
        })
    } catch (error) {
        console.error(error)
    }
}

onBeforeMount(() => {
    incrementPostViews(props.post._id)
})

</script>

<template>
    {{post}}
</template>