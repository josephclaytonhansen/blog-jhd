<script setup>
import authorBox from './authorBox.vue'
const props = defineProps({
    author: String,
    views: Number,
    date: String,
})
import {
    Eye,
     Calendar
     } from 'lucide-vue-next'
</script>

<template>
    <div class="sidebar grow max-w-[30vw] hidden md:hidden lg:flex flex-col p-5 rounded-xl">
        <authorBox :author_id="props.author" class="hidden lg:block" />
        <hr class="dividing-line"/>
        <div class="flex justify-between">
            <div class="flex items-center gap-3 grow">
                <Eye class="mr-2"/>
                <p class="text-text-2">{{ props.views }}</p>
            </div>
            <hr class="dividing-line-mid shrink"/>
            <div class="flex items-center gap-3 grow">
                <Calendar class="mr-2"/>
                <p class="text-text-2">{{ props.date }}</p>
            </div>
        </div>
        
    </div>
</template>