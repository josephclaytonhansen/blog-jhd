<script setup>
    const props = defineProps({
        image: String,
        classes: String,
        alt: {String,default:""},
        rounded: {Boolean,default:true}
    })

    import { ref } from 'vue'

    const imageLoaded = ref(false)

    const onImageLoad = () => {
        imageLoaded.value = true
    }
</script>

<template>
    <div class="threesquare-img-container relative" :class="[{'rounded': props.rounded},classes]">
        <div class="bg-backdrop-500 w-full h-full absolute inset-0 transition-opacity duration-75 ease-in-out rounded" :class="[{ 'opacity-0': imageLoaded },{'rounded': props.rounded}]"></div>
        <img :src="image" class="threesquare-img " :alt="alt" @load="onImageLoad" :class="[{ 'hidden': !imageLoaded },{'rounded': props.rounded}]" />
    </div>
</template>