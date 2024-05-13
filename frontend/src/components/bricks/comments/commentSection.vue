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
            console.log("COMMENTS: ", comments.value)
        })
    } catch (error) {
        console.error(error)
    }
}

const groupByCommentParent = (comments) => {
    let groupedComments = []
    comments.sort((a, b) => (a.parent > b.parent) ? 1 : -1)
    comments.forEach(comment => {
        if (comment.parent === null || comment.parent === undefined || comment.parent === "") {
            comment.nestedLevel = 0
            groupedComments.push(comment)
        } else if (comment.parent === props.blogPost){
            comment.nestedLevel = 0
            groupedComments.push(comment)
        }
         else {
            let parent = groupedComments.find(parent => parent.id === comment.parent)
            if (parent) {
                comment.nestedLevel = parent.nestedLevel + 1
                if (!parent.children) {
                    parent.children = []
                }
                parent.children.push(comment)
            }
        }
    })
    console.log("GROUPED COMMENTS: " + groupedComments)
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
    console.log("commentSection POST ID: " + props.post_id)
    console.log("commentSection USER: " + props.user)
    await getPostComments(props.post_id).then(() => {
        comments.value = groupByCommentParent(comments.value)
        console.log("GROUPED COMMENTS: ", comments.value)
    })
})

</script>

<template>
    <div class = "w-full flex flex-col gap-2 rounded-lg p-6 colorblock">
        <h2 class="text-2xl font-header">Comments</h2>
        <hr class="dividing-line"/>
        <Comment v-for="comment in comments" :comment="comment" :key="comment.id" :class="nestedLevelLeftMargin(comment.nestedLevel)" />
        <hr class="dividing-line"/>
        <WriteComment v-if="props.user && props.post_id" :user="props.user" :blogPost="props.post_id" />

    </div>

</template>