<script setup>
    const props = defineProps({
        author_id: String
    })
    import { ref, onMounted } from 'vue'
    import Avatar from '@/components/bricks/images/avatar.vue'

    const author = ref({})
    const getAuthor = async(id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/user/id/` + props.author_id
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }
        try {
            await fetch(url, {
                method: 'GET',
                headers: config.headers,
                credentials: 'include'
            }).then(async (response) => {
                if (response.status !== 200) {
                    throw new Error('Network error- could not get author')
                }
                author.value = await response.json()
            })
        } catch (error) {
            console.error(error)
        }
    }

    onMounted(() => {
        getAuthor(props.author_id)
    })
</script>

<template>
    <div id="author_box" class="flex item-center rounded-lg w-full p-5 colorblock">
        <div class="flex">
            <Avatar :image="author.picture" classes=" mr-2  square-img-container w-12" alt="avatar"/>
            <div class="flex flex-col">
                <p class="">{{ author.username }}</p>
                <p class="text-text-2">{{ author.shortBio }}</p>
            </div>
        </div>
    </div>
</template>