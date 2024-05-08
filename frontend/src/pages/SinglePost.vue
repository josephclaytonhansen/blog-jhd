<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import CommentSection from '../components/bricks/comments/commentSection.vue'
import postProgressBar from '../components/bricks/post/postProgressBar.vue'
import authorBox from '../components/bricks/post/authorBox.vue'
import postBody from '../components/bricks/post/postBody.vue'
import Sidebar from '../components/bricks/post/sidebar.vue'

const props = defineProps({
  id: String
})

const post = ref({})
const isLoading = ref(true)

const getPostById = async (id) => {
  const cachedPost = sessionStorage.getItem(`post-${id}`)
  const timestamp = sessionStorage.getItem(`timestamp-${id}`)

  if (cachedPost && timestamp && new Date().getTime() - Number(timestamp) < 45 * 60 * 1000) {
    post.value = JSON.parse(cachedPost)
    isLoading.value = false
  } else {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/id/` + id
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true
    }
    try {
      await fetch(url, {
        method: 'GET',
        headers: config.headers,
        credentials: 'include'
      }).then(async (response) => {
        if (response.status !== 200) {
          throw new Error('Network error- could not get post')
        }
        post.value = await response.json()
        isLoading.value = false
      })
    } catch (error) {
      console.error(error)
      isLoading.value = false
    }
  }
}

onBeforeMount(async () => {
  await getPostById(props.id)
})
</script>

<template>
  <div v-if="isLoading" class="flex">
    <p class = "text-xl text-text-3">Loading...</p>
  </div>
  <div v-else class="bg-backdrop-1 flex items center align-middle">
    <postProgressBar />
    <div class = "flex space-between p-5 w-full">
      <div class="w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-w-[70ch] mx-auto" id="post_content">
        <postBody :content="post.content"/>
        <div class="h-[800px] bg-backdrop-1"/>
        <hr class="dividing-line block lg:hidden"/>
        <authorBox :author_id="post.author" class="block lg:hidden" />
        <hr class="dividing-line"/>
        <CommentSection :post_id="post.id" />
      </div>
      <div class = "dividing-line-mid hidden lg:flex"></div>
      <Sidebar :author="post.author" :views="post.views" :date="post.date"/>
    </div>
  </div>
</template>
