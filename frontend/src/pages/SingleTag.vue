<script setup>
    import SiteHeader from '../components/bricks/sitewide/Header.vue'
    import SiteFooter from '../components/bricks/sitewide/Footer.vue'
    import TagBody from '../components/bricks/tag/tagBody.vue'

    import {ref, onMounted} from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    const router = useRouter()
    import { useToast } from "vue-toastification"
    const toast = useToast()

    const tagD = ref({})
    const posts = ref([])

    const isLoading = ref(true)

    import { useHead } from '@vueuse/head'

    const getTag = async (tagSlug) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/tag/slug/` + tagSlug
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        let tagData
        await fetch(url, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200 && response.status !== 304) {
                router.push('/NotFound')
            }
            tagData = await response.json()
            tagD.value = tagData
        })
        return tagData
    } catch (error) {
        console.error(error)
        router.push('/NotFound')
    }
}

onMounted(async () => {
    const route = useRoute()
    console.log(route)
    const tagSlug = route.params.slug
    const tagData = await getTag(tagSlug)
    if (tagData) {
        await getTaggedPosts(tagSlug)
    }
    useHead({
    title: 'Posts tagged ' + tagD.value.name + ' | ' + window.location.hostname,
    meta: [
        {
            name: 'description',
            content: 'Posts tagged with ' + tagD.value.name
        },
        {
            name: 'keywords',
            content: 'blog, posts, ' + tagD.value.name
        }
    ]

})
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
      sessionStorage.setItem(`tag-${tag}`, JSON.stringify(posts.value))
      sessionStorage.setItem(`timestamp-${tag}`, new Date().getTime())
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
    <div v-if="isLoading" class="flex flex-col w-screen h-screen overflow-hidden bg-backdrop-1">
      <SiteHeader :thisPageComponentName="'Header'" />
            <p class = "text-xl text-text-1 w-full">Loading...</p>
        <SiteFooter :thisPageComponentName="'Footer'" />
    </div>
    <div v-else class="bg-backdrop-1 flex flex-col items-start align-middle min-h-screen">
        <SiteHeader :thisPageComponentName="'Header'" />
          <TagBody v-if="posts && posts.length > 0 " :taggedPosts="posts" :tagName="tagD.name"/>
          <h2 v-else-if="tagD" class="text-text-1 text-2xl p-5">No posts found tagged with "{{ tagD.name }}"</h2>
          <h2 v-else class="text-text-1 text-2xl p-5">Loading...</h2>
        <SiteFooter :thisPageComponentName="'Footer'" />
    </div>
</template>