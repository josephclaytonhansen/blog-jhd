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
    <div class="hd-img-container relative rounded" :class="classes">
        <div class="bg-backdrop-500 w-full h-full absolute inset-0 transition-opacity duration-75 ease-in-out rounded" :class="{ 'opacity-0': imageLoaded }"></div>
        <img :src="image" class="hd-img rounded" :alt="alt" @load="onImageLoad" :class="{ 'hidden': !imageLoaded }" />
    </div>
</template>