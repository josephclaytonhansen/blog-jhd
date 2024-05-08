<script setup>
const props = defineProps(
    {post: Object}
)


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
</script>

<template>
    {{post}}
</template>