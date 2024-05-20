<script setup>
import ThreeSquareImage from '../images/threesquareImage.vue'
import SquareImage from '../images/squareImage.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const videoLoading = ref(true)
const isMobile = ref(window.innerWidth < 768)

const props = defineProps({
    fallbackImage: String,
    video: String,
    mobileVideo: String,
    fallbackVideo: String,
})

const video = ref(isMobile.value ? props.mobileVideo : props.video)

const videoLoaded = () => {
    videoLoading.value = false
}

const videoError = () => {
    video.value = props.fallbackVideo
}

const updateVideoSource = () => {
    isMobile.value = window.innerWidth < 768
    video.value = isMobile.value ? props.mobileVideo : props.video
}

onMounted(() => {
    window.addEventListener('resize', updateVideoSource)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateVideoSource)
})
</script>

<template>
    <div class="relative w-screen overflow-hidden" :class="{ 'hidden md:block': !isMobile, 'block md:hidden': isMobile }">
        <component :is="isMobile ? 'SquareImage' : 'ThreeSquareImage'" :image="props.fallbackImage" class="w-screen overflow-hidden" :rounded="false" v-if="videoLoading" />
        <div class="img-container relative" :class="{ 'square-img-container': isMobile, 'threesquare-img-container': !isMobile }">
            <video @loadeddata="videoLoaded" @error="videoError" class="img pointer-events-none" :class="{ 'square-img': isMobile, 'threesquare-img': !isMobile }" autoplay muted loop playsinline v-if="!videoLoading">
                <source :src="video" type="video/mp4">
            </video>
        </div>
    </div>
</template>