<script setup>

    const props = defineProps({
        comment: Object,
        user: String
    })
    import { ref, onMounted } from 'vue'
    import { useToast } from "vue-toastification"
    const toast = useToast()
    import ISOdateStringToRelative from '../../functions/relativeDate.js'
    import replyComment from './replyComment.vue'

    import {
        Flag,
        Trash,
        Reply,
        X
    } from 'lucide-vue-next'

    import axios from 'axios'

    const comment = ref(props.comment)

    const canDelete = ref(false)
    const canFlag = ref(false)

    const replying = ref(false)

    const replyToComment = () => {
        replying.value = !replying.value
    }
    
    onMounted(async () => {
        let checkResult = sessionStorage.getItem('checkResult')
        if (!(checkResult == "show") || !checkResult || checkResult === undefined || checkResult === null) {
        let checkParams = {
            user: localStorage.getItem('user'),
            session: sessionStorage.getItem('session')
        }
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
            let checkResponse = await axios.post(`${process.env.VUE_APP_SERVER_URL}/user/checksession`, checkParams, config)
            if (checkResponse?.status === 200) {
                let parsedUser = null
                try{
                const user = localStorage.getItem('user') || props.user
                parsedUser = typeof user === 'string' ? JSON.parse(user) : user}
                catch (error) {
                    console.error(error)
                }
                if (parsedUser === null || parsedUser._id === null) {
                    console.error('User access error - please log in again')
                    return
                }
                if (checkResponse?.data?.message === "admin" || checkResponse?.data?.message === "author" || String(props.comment.user) === parsedUser) {
                    canDelete.value = true
                }
                if (checkResponse?.data?.message !== 'unverified-user') {
                    canFlag.value = true
                }
            }
        }
    })


    const flagComment = async(id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/flag/` + id
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        }
        try {
            await fetch(url, {
                method: 'PUT',
                headers: config.headers,
                credentials: 'include'
            }).then(async (response) => {
                if (response.status !== 200) {
                    toast.error('Network error- could not flag comment')
                    throw new Error('Network error- could not flag comment')
                }
                toast.success('Comment flagged')
            })
        } catch (error) {
            console.error(error)
        }
    }

</script>

<template>
    <div class="colorblock_dark w-auto rounded-lg p-4" :class="replying? 'ring-2 ring-accent-500' : ''">
        <div class="flex flex-row justify-between">
            <div class="flex flex-row gap-2">
                <div class="flex flex-col gap-1">
                    <div class="font-bold text-lg">{{comment.user}}</div>
                    <div class="text-sm">{{ISOdateStringToRelative(comment.date)}}</div>
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <div v-if="canFlag" @click="flagComment(comment._id)" class="cursor-pointer">
                    <Flag class="w-6"/>
                </div>
                <div v-if="canFlag" @click="replyToComment" class="cursor-pointer">
                    <Reply class="w-6" v-if="!replying"/>
                    <X class="w-6" v-else/>
                </div>
                <div v-if="canDelete" @click="deleteComment" class="cursor-pointer">
                    <Trash class="w-6" />
                </div>
            </div>
        </div>
        <div>{{comment.content}}</div>
    </div>
    <replyComment :comment="comment" :user="props.user" v-if="replying" />
</template>