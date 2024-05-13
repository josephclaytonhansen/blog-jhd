<script setup>

    const props = defineProps({
        comment: Object
    })
    import { ref, onMounted } from 'vue'
    import { useToast } from "vue-toastification"
    const toast = useToast()
    import ISOdateStringToRelative from '../../functions/relativeDate.js'

    import {
        Flag,
        Trash,
        Reply,
    } from 'lucide-vue-next'

    import axios from 'axios'

    const comment = ref(props.comment)

    const canDelete = ref(false)
    const canFlag = ref(false)
    
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
                const user = localStorage.getItem('user')
                const parsedUser = user ? JSON.parse(user) : null
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
    <div class="colorblock_dark w-full rounded-lg p-4">
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
                    <Reply class="w-6"/>
                </div>
                <div v-if="canDelete" @click="deleteComment" class="cursor-pointer">
                    <Trash class="w-6" />
                </div>
            </div>
        </div>
        <div>{{comment.content}}</div>
    </div>
</template>