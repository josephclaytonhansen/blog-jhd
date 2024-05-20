<script setup>
import FourSquareImage from '../images/foursquareImage.vue'
import { ref } from 'vue'
const videoLoading = ref(true)

const props = defineProps({
    fallbackImage: String,
    video: String,
    fallbackVideo: String
})

const video = ref(props.video)

const videoLoaded = () => {
    videoLoading.value = false
}

const videoError = () => {
    video.value = props.fallbackVideo
}

</script>

<template>
    <div class="relative w-screen overflow-hidden">
        <FourSquareImage :image="props.fallbackImage" class="w-screen overflow-hidden" :rounded="false" v-if="videoLoading" />
        <div class="foursquare-img-container relative">
            <video @loadeddata="videoLoaded" @error="videoError" class="foursquare-img pointer-events-none" autoplay muted loop playsinline v-if="!videoLoading">
                <source :src="video" type="video/mp4">
            </video>
        </div>
    </div>
</template>