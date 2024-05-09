<script setup>
const props = defineProps({
    views: Number,
    date: String,
    tags: Array,
    category: String
})

import Tags from './micros/tags.vue'
import {Eye,Calendar} from 'lucide-vue-next'
import ISOdateStringToRelative from '../../functions/relativeDate.js'

</script>

<template>
    <hr class="dividing-line"/>
    <div class="flex justify-between items-center">
            <h2 class="font-header font-bold">{{props.category}}</h2>
        <hr class="dividing-line-mid shrink" v-if="props.tags.length > 0"/>
        <Tags :tags="props.tags" class='grow' v-if="props.tags.length > 0" />
    </div>
    <hr class="dividing-line"/>
    <div class="flex justify-between">
            <div class="flex items-center gap-1 grow">
                <Eye class="mr-2"/>
                <p class="text-text-2">{{ props.views }}</p>
            </div>
            <hr class="dividing-line-mid shrink"/>
            <div class="flex items-center gap-1 grow">
                <Calendar class="mr-2"/>
                <p class="text-text-2">{{ ISOdateStringToRelative(props.date) }}</p>
            </div>
        </div>
</template>