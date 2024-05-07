<script setup>
    const props = defineProps({
        image: String,
        classes: String,
        alt: {String,default:"user avatar"},
    })

    import { ref, onMounted } from 'vue'

    const imageLoaded = ref(false)

    const onImageLoad = () => {
        imageLoaded.value = true
    }

    onMounted(() => {
        if (!props.image || props.image === '') {
            imageLoaded.value = false
        }
    })

</script>

<template>
    <div class="overflow-hidden avatar aspect-square" :class="classes">
        <img :src="image" :alt="alt" class="w-full h-full object-cover avatar transition-opacity duration-300" :class="!imageLoaded ? 'opacity-0' : 'opacity-100'" @load="onImageLoad"/>
        <div class = "w-full h-full bg-backdrop-500 flex items-center justify-center avatar transition-opacity duration-300 relative" :class="!imageLoaded ? 'opacity-100 -top-[100%]' : 'opacity-0'"></div>
    </div>
</template>