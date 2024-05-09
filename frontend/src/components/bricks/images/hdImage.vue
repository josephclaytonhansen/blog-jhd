<script setup>
    const props = defineProps({
        image: String,
        classes: String,
        alt: {String,default:""},
    })

    import { ref } from 'vue'

    const imageLoaded = ref(false)

    const onImageLoad = () => {
        imageLoaded.value = true
    }
</script>

<template>
    <div class="hd-img-container relative" :class="classes">
        <div class="bg-backdrop-500 w-full h-full absolute inset-0 transition-opacity duration-75 ease-in-out" :class="{ 'opacity-0': imageLoaded, 'rounded': props.classes.includes('rounded') }"></div>
        <img :src="image" class="hd-img" :alt="alt" @load="onImageLoad" :class="{ 'hidden': !imageLoaded, 'rounded': props.classes.includes('rounded') }" />
    </div>
</template>