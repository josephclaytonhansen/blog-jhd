<script setup>
    import SiteHeader from '../components/bricks/sitewide/Header.vue'
    import SiteFooter from '../components/bricks/sitewide/Footer.vue'
    import tagBody from '../components/bricks/tag/TagBody.vue'

    import {ref, onBeforeMount, defineProps} from 'vue'
    import {useRouter} from 'vue-router'
    const router = useRouter()
    import { useToast } from "vue-toastification"
    const toast = useToast()

    const tagD = ref({})
    const posts = ref([])
    const props = defineProps({
    tag: String,
    })

    const post = ref({})
    const isLoading = ref(true)

    const getTag = async (tag) => {
        const cachedPost = sessionStorage.getItem(`tag-${tag}`)
        const timestamp = sessionStorage.getItem(`timestamp-${tag}`)
        if (cachedPost && timestamp && new Date().getTime() - Number(timestamp) < 45 * 60 * 1000) {
            post.value = JSON.parse(cachedPost)
            isLoading.value = false
        } else {
            sessionStorage.removeItem(`tag-${tag}`)
            sessionStorage.removeItem(`timestamp-${tag}`)
            sessionStorage.removeItem('checkResult')
            let url = `${process.env.VUE_APP_SERVER_URL}/tag/` + tag
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
                        router.push('/NotFound')
                    }
                    tagD.value = await response.json()
                    sessionStorage.setItem(`tag-${tag}`, JSON.stringify(post.value))
                    sessionStorage.setItem(`timestamp-${tag}`, new Date().getTime())
                    isLoading.value = false
                })
            } catch (error) {
                console.error(error)
                isLoading.value = false
                router.push('/NotFound')
            }
        }
    }

    onBeforeMount(async () => {
        await getTag(props.tag)
    })

    const getTaggedPosts = async(tag) => {
  let url = `${process.env.VUE_APP_SERVER_URL}/blog/tag/` + tag
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
        toast.error("Network error- could not get posts")
      }
      posts.value = await response.json()
      sessionStorage.setItem(`tag-${tagId}`, JSON.stringify(post.value))
      sessionStorage.setItem(`timestamp-${tagId}`, new Date().getTime())
      isLoading.value = false
    })
  } catch (error) {
    console.error(error)
    isLoading.value = false
    toast.error("Network error- could not get posts")

  }

}
</script>

<template>
    <div v-if="isLoading" class="flex w-screen h-screen overflow-hidden">
        <p class = "text-xl text-text-3">Loading...</p>
    </div>
    <div v-else class="bg-backdrop-1 flex flex-col items-start align-middle min-h-screen">
        <SiteHeader :thisPageComponentName="'Header'" />
            <TagBody :taggedPosts="posts" />
        <SiteFooter :thisPageComponentName="'Footer'" />
    </div>
</template>