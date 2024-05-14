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
            comments.value = sortComments(comments.value)

        })
    } catch (error) {
        console.error(error)
    }
}

const sortComments = (comments) => {
    let maxNestedLevel = 0
    let splits = []
    comments.forEach(comment => {
        let nestedLevel = comment.nestedLevel
        if (nestedLevel > maxNestedLevel) {
            maxNestedLevel = nestedLevel
            splits[nestedLevel] = []
        }
        splits[comments.nestedLevel].push(comment)
    })
    let orderedComments = []
    for (let i = 0; i <= maxNestedLevel; i++) {
        //Each item in splits[0] is a top level comment
        //Each item in splits[1] is a reply to a top level comment
        //Each item in splits[2] is a reply to a reply to a top level comment
        //etc
        //Ordered comments should reflect this structure- if a comment is a reply to a top level comment, it should be nested under that comment
        //If a comment is a reply to a reply to a top level comment, it should be nested under the reply to the top level comment
        //This is determined by comment.parent being equal to the id of the comment it is a reply to
        //If a comment is a top level comment, it should be pushed to the orderedComments array
        //If a comment is a reply to a top level comment, it should be pushed to orderedComments after its parent top level comment
        //If a comment is a reply to a reply to a top level comment, it should be pushed to orderedComments after its parent reply to a top level comment
        //etc
        //This is done by iterating through the splits array and pushing each item to the orderedComments array in order
        // Create a map of comments by their IDs
        let commentMap = new Map(splits[i].map(comment => [comment.id, comment]))

        // Recursive function to add a comment and its descendants to the orderedComments array
        function addCommentAndDescendantsToOrderedComments(commentId) {
            let comment = commentMap.get(commentId)
            if (comment) {
                orderedComments.push(comment)
                comment.replies.forEach(childId => addCommentAndDescendantsToOrderedComments(childId))
            }
        }

        // Add each top-level comment and its descendants to the orderedComments array
        splits[i].forEach(comment => {
            if (comment.nestedLevel === 0) {
                addCommentAndDescendantsToOrderedComments(comment.id)
            }
        })

    }

    return orderedComments
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