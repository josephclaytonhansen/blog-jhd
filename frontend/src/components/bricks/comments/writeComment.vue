<script setup>

import { ref, onMounted } from 'vue'
const parent = ref('')
const comment = ref('')

const props = defineProps({
    user: String,
    blogPost: String
})
const user = ref(props.user)
const blogPost = ref(props.blogPost)

import { useToast } from "vue-toastification"
const toast = useToast()

const writing = ref(false)

const uploadComment = async() => {
    let url
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }
    let body = {
        parent: parent.value,
        content: comment.value,
        user: props.user,
        blogPost: props.blogPost
    }

    if (!parent.value || parent.value === ''){
        body.parent = props.blogPost
    }

    if (!comment.value) {
        toast.error('Please write a comment')
        return
    } else if (comment.length < 20 || comment.length > 900) {
        toast.error('Comment must be between 20 and 900 characters')
        return
    }

    if (body.parent !== props.blogPost) {
        url = `${process.env.VUE_APP_SERVER_URL}/comment/create`
    } else {
        url = `${process.env.VUE_APP_SERVER_URL}/comment/reply/${parent.value}`
    }

    try {
        await fetch(url, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include',
            body: JSON.stringify(body)
        }).then(async (response) => {
            if (response.status !== 200) {
                throw new Error('Network error- could not write comment: ' + response.status)
            }
            writing.value = false
            parent.value = ''
            comment.value = ''
            toast.success('Comment added')
        })
    } catch (error) {
        console.error(error)
        toast.error('Could not write comment: ' + error)
    }
}

</script>

<template>
    <div v-if="writing" class="w-full flex flex-col items-start">
        <textarea v-model="comment" class = "p-2 rounded colorblock_darker font-body mb-2" placeholder="Add your thoughts to the discussion."></textarea>
        <button @click="uploadComment" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">Submit</button>
    </div>
    <div v-else-if="!writing && user !== '' && user !== null" class="w-full">
        <button @click="writing = true" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg w-full text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">Write a comment</button>
    </div>
    <div v-else class="w-full items-start">
        <p class=" w-full mb-2">Log in or register to write a comment</p>
        <router-link to="/login" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">Log in</router-link>
    </div>

</template>