<script setup>

import { ref, onMounted } from 'vue'
const parent = ref('')
const comment = ref('')

const props = defineProps({
    user: String,
    blogPost: String
})

import { useToast } from "vue-toastification"
const toast = useToast()

const writing = ref(false)

const sanitize = (string) => {
    const regex = /[^A-Za-z0-9\s!@#$%&*([])\/\\:;"'~\-_=+]/g
    let rep = string.replace(regex, '').trim()
    if (rep !== string) {
        toast.warning('Illegal characters removed from comment')
    }
    if (!rep.includes(' ') || rep.includes('==') || rep.includes('===') || rep.includes('!==') || rep.includes('!=') || rep.includes('!==') || rep.includes('<=') || rep.includes('>=') || rep.includes('<<') || rep.includes('>>') || rep.includes('>>>') || rep.includes('||') || rep.includes('&&') || rep.includes('==') || rep.includes('!=') || rep.includes('!==') || rep.includes('<=') || rep.includes('>=') || rep.includes('<<') || rep.includes('>>') || rep.includes('>>>') || rep.includes('||') || rep.includes('&&') ){
        return
    }
    if (rep.endsWith('=') || rep.endsWith(';')|| rep.startsWith('=') || rep.startsWith('$') || rep.startsWith('!') || rep.startsWith('/') || rep.startsWith('\\') ) {
        return
    }
    return rep
}


const uploadComment = async() => {
    let url
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
    }
    console.log(props.user, props.blogPost)
    let sanitizedComment = sanitize(comment.value)
    if (sanitizedComment === undefined || sanitizedComment === null || sanitizedComment === '') {
        toast.error('Cannot create comment')
        return
    }
    let body = {
        parent: props.blogPost,
        content: sanitizedComment,
        user: props.user.split(".")[0],
        blogPost: props.blogPost
    }

    if (props.user === null || props.user === undefined || props.user === '') {
        toast.error('Please log in to write a comment')
        return
    }

    if (!comment.value) {
        toast.error('Please write a comment')
        return
    } else if (comment.value.length < 20 || comment.value.length > 900) {
        toast.error('Comment must be between 20 and 900 characters')
        return
    }

    url = `${process.env.VUE_APP_SERVER_URL}/comment/create`

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
    <div v-if="writing && props.blogPost && props.user" class="w-full flex flex-col items-start">
        <textarea v-model="comment" class = "p-2 rounded colorblock_darker font-body mb-2 w-full" placeholder="Add your thoughts to the discussion."></textarea>
        <button @click="uploadComment" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">Submit</button>
    </div>
    <div v-else-if="!writing && props.user !== '' && props.user !== null && props.user !== undefined && props.user && props.blogPost" class="w-full">
        <button @click="writing = true" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg w-full text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">Write a comment</button>
    </div>
    <div v-else class="w-full items-start">
        <p class=" w-full mb-2">Log in or register to write a comment</p>
        <router-link to="/login" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">Log in</router-link>
    </div>

</template>