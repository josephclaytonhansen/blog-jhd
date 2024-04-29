<script setup>
import {pinia} from '../../main.js'
import {userStore} from "../../userStore.js"

import { onMounted, ref } from 'vue'

const loggedInStatus = ref(false)

const store = userStore(pinia)

const posts = ref([])

const getPosts = async () => {
    const response = await fetch('http://localhost:3720/blog/')
    const data = await response.json()
    return data
}

onMounted(() => {
    store.user ? loggedInStatus.value = true : loggedInStatus.value = false
    if (loggedInStatus.value){
    posts.value = getPosts()}
})

import {
    Eye,
    Trash,
    Check,
    CheckCheck,
    Clock,
    Pencil,
} from 'lucide-vue-next'

</script>

<template>
    <div class="p-3 rounded-xl">
        <table class='w-full text-slate-300 table-auto rounded-xl'>
            <thead class="bg-slate-600">
                <tr class = "flex">
                    <th  class="border-r-2 border-slate-500 shrink p-3"><Eye/></th>
                    <th  class="border-r-2 border-slate-500 grow p-3">Title</th>
                    <th  class="border-r-2 border-slate-500 p-3">Author</th>
                    <th class="border-r-2 border-slate-500 p-3">Site</th>
                    <th  class="border-r-2 border-slate-500 p-3">Statuses</th>
                    <th  class="border-r-2 border-slate-500 p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in posts" :key="post._id">
                    <td>{{post.views}}</td>
                    <td><a :href="post.site + '/' + post.slug">{{post.title}}</a></td>
                    <td>{{post.author}}</td>
                    <td>{{post.site}}</td>
                    <td>
                        <div v-if="post.status == 'published'">
                            <CheckCheck />
                        </div>
                        <div v-else-if="post.status == 'scheduled'">
                            <Clock />
                        </div>
                        <div v-else>
                            <Pencil />
                        </div>
                    </td>
                    <td>
                        <div class='flex'>
                            <Eye class='cursor-pointer' @click="console.log('View post')"/>
                            <Trash class='cursor-pointer' @click="console.log('Delete post')"/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
tr:nth-child(even) {
    background-color: unset;
}

</style>