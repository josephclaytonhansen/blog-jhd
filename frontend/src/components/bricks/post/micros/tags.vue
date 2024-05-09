<script setup>
import {ref} from 'vue'
import tagD from './tag.vue'
const tags = ref([])
const props = defineProps({
    tags: Array
})
tags.value = props.tags
import {useRouter} from 'vue-router'
import {Tag} from 'lucide-vue-next'
const router = useRouter()
</script>

<template>
    <div class="flex flex-wrap gap-2" >
        <Tag />
        <tagD v-for="tag in tags" :tag="tag" :key="tag"  @click="router.push(`/tag/${tag}`)" />
    </div>
</template>