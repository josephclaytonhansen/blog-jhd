<script setup>

    const props = defineProps({
        comment: Object,
        user: String,
        class: String
    })

    const sanitized = ref('')

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

    const deleteComment = async(id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/delete/` + id
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        }
        try {
            await fetch(url, {
                method: 'DELETE',
                headers: config.headers,
                credentials: 'include'
            }).then(async (response) => {
                if (response.status !== 200) {
                    toast.error('Network error- could not delete comment')
                    throw new Error('Network error- could not delete comment')
                }
                toast.success('Comment deleted')
            })
        } catch (error) {
            console.error(error)
        }
    }

    const replyToComment = () => {
        replying.value = !replying.value
    }
    
    onMounted(async () => {
        sanitized.value = parseBbCode(props.comment.content)
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
                'Authorization': 'Bearer ' + localStorage.token,
            }
        }
            let checkResponse = await axios.post(`${process.env.VUE_APP_SERVER_URL}/user/checksession`, checkParams, config)
            if (checkResponse?.status === 200) {
                let parsedUser = null
                try{
                const user = localStorage.getItem('user') || props.user.split(".")[0]
                parsedUser = typeof user === 'string' ? JSON.parse(user) : user}
                catch (error) {
                    console.error(error)
                }
                if (parsedUser === null || parsedUser._id === null) {
                    console.error('User access error - please log in again')
                    return
                }
                if (checkResponse?.data?.message === "admin" || checkResponse?.data?.message === "author" || String(props.comment.user.split(".")[0]) === parsedUser) {
                    canDelete.value = true
                }
                if (checkResponse?.data?.message !== 'unverified-user') {
                    canFlag.value = true
                }
            }
        }
    })

    const parseBbCode = (content) => {
    let lines = content.split(/\r?\n/)
    let inList = false
    lines = lines.map(line => {
        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (!inList) {
                inList = true
                return '<ul class="ml-2 list-disc"><li class="m-0 py-2" style="line-height:.5rem">' + line.substring(2) + '</li>'
            } else {
                return '<li>' + line.substring(2) + '</li>'
            }
        } else {
            if (inList) {
                inList = false
                return '</ul>' + line
            } else {
                return line
            }
        }
    });
    if (inList) {
        lines.push('</ul>')
    }
    content = lines.join('<br/>')
    return content.replace(/\[b\]/g, '<strong>')
        .replace(/\[\/b\]/g, '</strong>')
        .replace(/\[bold\]/g, '<strong>')
        .replace(/\[\/bold\]/g, '</strong>')
        .replace(/\[i\]/g, '<em>')
        .replace(/\[\/i\]/g, '</em>')
        .replace(/\[italic\]/g, '<em>')
        .replace(/\[\/strikethrough\]/g, '</s>')
        .replace(/\[strikethrough\]/g, '<s>')
        .replace(/\[\/italic\]/g, '</em>')
        .replace(/\[u\]/g, '<u>')
        .replace(/\[\/u\]/g, '</u>')
        .replace(/\[s\]/g, '<s>')
        .replace(/\[\/s\]/g, '</s>')
        .replace(/\[small\]/g, '<small>')
        .replace(/\[\/small\]/g, '</small>')
}

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
    <div class="colorblock_dark w-auto rounded-lg p-4" :class="[replying ? 'ring-2 ring-accent-500' : '', props.class]">
        <div class="flex flex-row justify-between">
            <div class="flex flex-row gap-2">
                <div class="flex flex-col gap-1">
                    <div class="font-bold text-lg">{{comment.user.split(".")[1]}}</div>
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
                <div v-if="canDelete" @click="deleteComment(comment._id)" class="cursor-pointer">
                    <Trash class="w-6" />
                </div>
            </div>
        </div>
        <div v-html="sanitized" v-if="sanitized"></div>
    </div>
    <replyComment :comment="comment" :user="props.user" v-if="replying && props.user" />
</template>