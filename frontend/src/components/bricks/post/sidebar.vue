<script setup>
import authorBox from './authorBox.vue'
const props = defineProps({
    author: String
})
import {Eye} from 'lucide-vue-next'
</script>

<template>
    <div class="sidebar grow max-w-[30vw] hidden md:hidden lg:flex flex-col p-5 rounded-xl">
        <authorBox :author_id="props.author" class="hidden lg:block" />
        <hr class="dividing-line"/>
        <div class="flex items-center gap-3">
            <Eye class="mr-2"/>
            <p class="text-text-2">{{ props.views }}</p>
        </div>
    </div>
</template>