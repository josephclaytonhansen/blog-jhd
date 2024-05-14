<script setup>

import { ref, onMounted } from 'vue'
import { useToast } from "vue-toastification"
const toast = useToast()

import { useRouter } from 'vue-router'
const router = useRouter()

const comments = ref([])

const props = defineProps({
    post_id: String,
    user: String
})

import Comment from './comment.vue'
import WriteComment from './writeComment.vue'

const getPostComments = async(id) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/comment/blog/` + props.post_id
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }
    try {
        await fetch(url, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200) {
                toast.error('Network error- could not get comments')
                throw new Error('Network error- could not get comments')
            }
            comments.value = await response.json()
            comments.value = groupByCommentParent(comments.value)

        })
    } catch (error) {
        console.error(error)
    }
}

const groupByCommentParent = (comments, parentId = null, nestedLevel = 0) => {
    let groupedComments = []

    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i]
        if (comment.parent === parentId) {
            comment.nestedLevel = nestedLevel
            groupedComments.push(comment)

            let childComments = groupByCommentParent(comments, comment.id, nestedLevel + 1)
            groupedComments = groupedComments.concat(childComments)
        }
    }
    // If no parent-child relationships were found and this is the top-level call, return the original comments array
    if (parentId === null && groupedComments.length === 0) {
        return comments.map(comment => ({ ...comment, nestedLevel: 0 }))
    }

    return groupedComments
}

const nestedLevelLeftMargin = (nestedLevel) => {
    switch (nestedLevel) {
        case 0:
            return 'ml-0'
        case 1:
            return 'ml-8'
        case 2:
            return 'ml-16'
        case 3:
            return 'ml-24'
        default:
            return 'ml-0'
    }
}

onMounted(async () => {
    await getPostComments(props.post_id)
})

</script>

<template>
    <div class = "w-full flex flex-col gap-2 rounded-lg p-6 colorblock items-stretch justify-stretch">
        <h2 class="text-2xl font-header">{{comments.length}} Comments</h2>
        <hr class="dividing-line"/>
        <Comment v-for="comment in comments" :comment="comment" :key="comment.id" :user="props.user? props.user : null" :class="nestedLevelLeftMargin(comment.nestedLevel)" />
        <hr class="dividing-line"/>
        <WriteComment v-if="props.user && props.post_id" :user="props.user" :blogPost="props.post_id" />

    </div>

</template>