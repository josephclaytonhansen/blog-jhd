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
    ringClass: String,
    onColor: {String, default: 'accent-500'},
    offColor: {String, default: 'backdrop-700'},
})

let bgColorClass = computed(() => `bg-${status.value ? props.onColor : props.offColor}`);
let ringClass = computed(() => props.ringClass);
let widthClass = computed(() => `w-${props.width}`);
let heightClass = computed(() => `h-${props.width/2}`);

let computedClass = computed(() => {
    return [
        bgColorClass.value,
        ringClass.value,
        'flex',
        'rounded-full',
        widthClass.value,
        heightClass.value,
        'cursor-pointer',
        'transition-all',
        'duration-300',
    ]
})

onMounted(() => {
    status.value = props.value
})
</script>

<template>
    <div @click="toggle" :class="[...computedClass, `hover:ring-${props.ringHoverColor}`]">
       <div class="relative w-1/2 cursor-pointer transition-all duration-200 rounded-full h-full bg-backdrop-300" :class="status ? 'left-1/2' : 'left-0'"></div>
   </div>
</template>
