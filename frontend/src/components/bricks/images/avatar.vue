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
    <div class="square-img-container relative rounded-full overflow-hidden" :class="classes">
        <div class="bg-backdrop-500 absolute inset-0 transition-opacity duration-75 ease-in-out" :class="{ 'opacity-0': imageLoaded }"></div>
        <img :src="image" :alt="alt" @load="onImageLoad" class="avatar" :class="{ 'hidden': !imageLoaded }" />
    </div>
</template>