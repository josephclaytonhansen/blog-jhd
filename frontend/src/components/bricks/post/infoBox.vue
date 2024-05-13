<script setup>
const props = defineProps({
    views: Number,
    date: String,
    tags: Array,
    category: String,
    comments: Number,
    sidebar: Boolean
})

if (props.comments === undefined) props.comments = 0

import Tags from './micros/tags.vue'
import {Eye,Calendar, MessageCircleMore} from 'lucide-vue-next'
import ISOdateStringToRelative from '../../functions/relativeDate.js'

import {useRouter} from 'vue-router'
const router = useRouter()

</script>

<template>
    <div id = "info-box">
    <hr class="dividing-line"/>
    <div class="flex justify-between items-center text-text-1" v-if="props.sidebar">
            <h2 @click="router.push(`/category/${props.category}`)" class="font-header font-bold transition-all duration-300 hover:text-accent-500 cursor-pointer">{{props.category}} </h2>
        <hr class="dividing-line-mid shrink" v-if="props.tags.length > 0"/>
        <Tags :tags="props.tags" class='grow' v-if="props.tags.length > 0" />
    </div>
    <hr class="dividing-line" v-if="props.sidebar"/>
    <div class="flex justify-around" v-if="props.sidebar">
            <div class="flex items-center gap-1 grow">
                <Eye class="mr-2"/>
                <p class="text-text-2">{{ props.views }}</p>
            </div>
            <hr class="dividing-line-mid shrink"/>
            <hr class="dividing-line-mid shrink"/>
            <div class="flex items-center gap-1 grow">
                <Calendar class="mr-2"/>
                <p class="text-text-2">{{ ISOdateStringToRelative(props.date) }}</p>
            </div>
        </div>

         <div v-else class="flex justify-between items-center text-text-1">
            <div class="flex items-center gap-1 grow">
                <Eye class="mr-2"/>
                <p class="text-text-2">{{ props.views }}</p>
            </div>

            <div class="flex items-center gap-1 grow">
                <MessageCircleMore class="mr-2"/>
                <p class="text-text-2">{{ props.comments }}</p>
            </div>

            <div class="flex items-center gap-1 grow">
                <Calendar class="mr-2"/>
                <p class="text-text-2">{{ ISOdateStringToRelative(props.date) }}</p>
            </div>
         </div>
        </div>
</template>