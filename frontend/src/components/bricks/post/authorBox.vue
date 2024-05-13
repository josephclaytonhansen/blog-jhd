<script setup>
    const props = defineProps({
        author_id: String
    })
    import { ref, onMounted } from 'vue'
    import Avatar from '@/components/bricks/images/avatar.vue'
    import getAuthor from '../../functions/getAuthor.js'

    import {useRouter } from 'vue-router'
    const router = useRouter()

    const author = ref({})
    

    onMounted(async () => {
        await getAuthor(props.author_id).then((data) => {
            author.value = data
        })
    })
</script>

<template>
    <div id="author_box" class="flex item-center rounded-lg w-full p-5 colorblock_dark">
        <div class="flex">
            <Avatar :image="author.picture" classes=" mr-2  square-img-container w-12" alt="avatar"/>
            <div class="flex flex-col">
                <p class='text-md'>by <router-link :to="`/profile/${author.displayName}`" class="font-semibold hover:text-accent-500 duration-300 transition-all">{{ author.displayName }}</router-link></p>
                <p class="text-text-2 text-sm italic">{{ author.shortBio }}</p>
            </div>
        </div>
    </div>
</template>