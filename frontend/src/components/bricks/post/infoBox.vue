<script setup>
const props = defineProps({
    views: Number,
    date: String,
})
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
        if (years > 0) {
            return years + ' years ago on ' + then.toDateString()
        } else if (months > 0) {
            return months + ' months ago on ' + then.toDateString()
        } else if (weeks > 0) {
            return weeks + ' weeks ago on ' + then.toDateString()
        } else if (days > 0) {
            return days + ' days ago'
        } else if (hours > 0) {
            return hours + ' hours ago'
        } else if (minutes > 0) {
            return minutes + ' minutes ago'
        } else {
            return seconds + ' seconds ago'
        }
}
</script>

<template>
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