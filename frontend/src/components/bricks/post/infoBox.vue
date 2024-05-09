<script setup>
const props = defineProps({
    views: Number,
    date: String,
    tags: Array
})

import Tags from './micros/tags.vue'

import {
    Eye,
     Calendar
     } from 'lucide-vue-next'

const ISOdateStringToRelative = (date) => {
    let now = new Date()
    let then = new Date(date)
    let diff = now - then
    let seconds = Math.floor(diff / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)
    let weeks = Math.floor(days / 7)
    let months = Math.floor(weeks / 4)
    let years = Math.floor(months / 12)
    if (years > 0 && years < 2) {
        return years + ' year ago on ' + then.toDateString()
    } else if (years >= 2) {
        return years + ' years ago on ' + then.toDateString()
    } else if (months > 0 && months < 2) {
        return months + ' month ago on ' + then.toDateString()
    } else if (months >= 2) {
        return months + ' months ago on ' + then.toDateString()
    } else if (weeks > 0 && weeks < 2) {
        return weeks + ' week ago on ' + then.toDateString()
    } else if (weeks >= 2) {
        return weeks + ' weeks ago on ' + then.toDateString()
    } else if (days > 0 && days < 2) {
        return days + ' day ago on ' + then.toDateString()
    } else if (days >= 2) {
        return days + ' days ago on ' + then.toDateString()
    } else {
        return 'Less than a day ago on ' + then.toDateString()
    }
}
</script>

<template>
    <hr class="dividing-line"/>
    <Tags :tags="props.tags" />
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