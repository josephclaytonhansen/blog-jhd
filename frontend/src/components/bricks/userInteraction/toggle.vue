<script setup>
import { ref, onMounted, computed } from 'vue'
const status = ref(false)
const toggle = () => {
    status.value = !status.value
}
const props = defineProps({
    value: Boolean,
    width: String,
    height: String,
    ringColor: String,
    onColor: {String, default: 'cyan-500'},
    offColor: {String, default: 'slate-700'},
    ringHoverColor: String,
})

let computedClass = computed(() => {
    return {
        [`ring-${props.ringColor}`]: true,
        [`bg-${status.value ? props.onColor : props.offColor}`]: true,
        'flex': true,
        'rounded-full': true,
        'ring-4': true,
        [`w-${props.width}`]: true,
        [`h-${props.width/2}`]: true,
        'cursor-pointer': true,
        'transition-all': true,
        'duration-300': true,
    }
})

onMounted(() => {
    status.value = props.value
})
</script>

<template>
     <div @click="toggle" :class="{...computedClass, [`hover:ring-${props.ringHoverColor}`]: true}">
        <div class = "relative w-1/2 cursor-pointer transition-all duration-300 rounded-full h-full bg-slate-300" :class="status ? 'left-1/2' : 'left-0'"></div>
    </div>
</template>
