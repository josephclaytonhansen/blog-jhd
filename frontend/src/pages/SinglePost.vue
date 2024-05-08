<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import CommentSection from '../components/bricks/comments/commentSection.vue'
import postProgressBar from '../components/bricks/post/postProgressBar.vue'
import authorBox from '../components/bricks/post/authorBox.vue'

const props = defineProps({
  id: String
})

const post = ref({})

const getPostById = async (id) => {
  const cachedPost = sessionStorage.getItem(`post-${id}`)
  const timestamp = sessionStorage.getItem(`timestamp-${id}`)

  if (cachedPost && timestamp && new Date().getTime() - Number(timestamp) < 45 * 60 * 1000) {
    post.value = JSON.parse(cachedPost)
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
        sessionStorage.setItem(`post-${id}`, JSON.stringify(post.value))
        sessionStorage.setItem(`timestamp-${id}`, String(new Date().getTime()))
      })
    } catch (error) {
      console.error(error)
    }
  }
}

const incrementPostViews = async (id) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/incrementviews/` + id
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }
    try {
        await fetch(url, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include'
        })
    } catch (error) {
        console.error(error)
    }
    const cachedPost = JSON.parse(sessionStorage.getItem(`post-${id}`))
  if (cachedPost) {
    cachedPost.views += 1
    sessionStorage.setItem(`post-${id}`, JSON.stringify(cachedPost))
  }
}

onBeforeMount(async() => {
    await getPostById(props.id)
})

onMounted(async() => {
    await incrementPostViews(props.id)
})

</script>

<template>
  <div class="bg-backdrop-1 flex items center align-middle">
    <div class="w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-w-[70chr] mx-auto">
      <postProgressBar />
      {{post}}
      <div class="h-[800px] bg-backdrop-1"/>
      <authorBox :author_id="post.author_id" />
      <CommentSection :post_id="post.id" />
    </div>
  </div>
</template>
