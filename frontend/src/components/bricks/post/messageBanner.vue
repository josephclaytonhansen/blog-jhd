<script setup>
const props = defineProps({
    message: String,
    type: {type: String, default: 'info'},
    link: {type: String, default: ''},
    linkText: {type: String, default: 'Learn more'}
})

const bgClass = computed(() => {
    switch (props.type) {
        case 'info':
            return 'bg-accent-600 text-white'
        case 'muted':
            return 'bg-backdrop-3 text-text-0'
        case 'warning':
            return 'bg-amber-600 text-white'
        case 'error':
            return 'bg-red-500 text-white'
        default:
            return 'bg-accent-600 text-white'
    }
})
</script>

<template>
    <div class="fixed bottom-0 left-0 w-screen overflow-hidden p-3 flex items-center justify-center gap-3" :class="bgClass">
        <p class="font-body text-sm">{{props.message}}</p>
        <button v-if="props.link" class="cursor-pointer bg-accent-700 px-5 py-2 rounded-lg text-text-0 hover:bg-accent-500 hover:scale-105 transition-all duration-300" @click="$router.push(props.link)">{{ props.linkText }}</button>
    </div>
</template>