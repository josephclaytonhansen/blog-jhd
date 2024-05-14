<script setup>
import { ref } from 'vue'
import { useToast } from "vue-toastification"
const toast = useToast()
const comment = ref('')

const props = defineProps({
    comment: Object,
    user: String
})

const reply = ref('')

const parent = ref(props.comment._id)

const replyComment = async () => {
    console.log("Replying to comment: ", comment.value)
    console.log("Parent comment: ", parent.value)
    let url = `${process.env.VUE_APP_SERVER_URL}/comment/reply/` + parent.value
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }
    let body = {
        content: reply.value,
        user: props.user,
        blogPost: props.comment._id

    }
    try {
        await fetch(url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(body),
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200) {
                toast.error('Network error- could not reply to comment', response.statusText)
                throw new Error('Network error- could not reply to comment ' , response.status , response.statusText)
            }
            toast.success('Replied to comment')
            comment.value = ''
        })
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <div class="colorblock_dark w-auto ml-8 rounded-lg p-4 mt-2">
        <div class="w-full flex flex-col items-start">
            <textarea v-model="reply" class = "p-2 rounded colorblock_darker font-body mb-2 w-full" placeholder="Reply to comment"></textarea>
            <button @click="replyComment" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">Reply</button>
    </div>
    </div>
</template>