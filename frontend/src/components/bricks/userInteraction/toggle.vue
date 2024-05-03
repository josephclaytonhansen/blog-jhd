<script setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue'
const status = ref(false)
const toggle = () => {
    status.value = !status.value
    emit('update:modelValue', status.value)
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    value: Boolean,
    width: String,
    height: String,
    ringClass: String,
    onColor: {String, default: 'accent-500'},
    offColor: {String, default: 'backdrop-1'},
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

let hasPointingDevice = ref(false)

onBeforeMount(() => {
    hasPointingDevice.value = window.matchMedia('(pointer: fine)').matches
})


</script>

<template>
    <div v-if="hasPointingDevice" @click="toggle" :class="[...computedClass, `hover:ring-${props.ringHoverColor}`]">
        <div class="relative w-1/2 cursor-pointer transition-all duration-200 rounded-full h-full bg-backdrop-300" :class="status ? 'left-1/2' : 'left-0'"></div>
    </div>
    <div v-else>
        <input type="radio" :value="true" v-model="status" id="option1" name="options">
        <label for="option1">Option 1</label>
        <input type="radio" :value="false" v-model="status" id="option2" name="options">
        <label for="option2">Option 2</label>
    </div>
</template>
