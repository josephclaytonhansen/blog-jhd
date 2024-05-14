<script setup>
    import SiteHeader from '../components/bricks/sitewide/Header.vue'
    import SiteFooter from '../components/bricks/sitewide/Footer.vue'
    import CategoryBody from '../components/bricks/tag/categoryBody.vue'

    import {ref, onMounted} from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    const router = useRouter()
    import { useToast } from "vue-toastification"
    const toast = useToast()

    const category = ref({})
    const posts = ref([])

    const isLoading = ref(true)

    import { useHead } from '@vueuse/head'

    const getTag = async (categorySlug) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/category/slug/` + categorySlug
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        let categoryData
        await fetch(url, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200 && response.status !== 304) {
                router.push('/NotFound')
            }
            categoryData = await response.json()
            category.value = categoryData
        })
        return categoryData
    } catch (error) {
        console.error(error)
        router.push('/NotFound')
    }
}

onMounted(async () => {
    const route = useRoute()
    console.log(route)
    const categorySlug = route.params.slug
    const categoryData = await getTag(categorySlug)
    if (categoryData) {
        await getTaggedPosts(categorySlug)
    }
    useHead({
        title: 'Posts in ' + category.value.name,
        meta: [
            {
                name: 'description',
                content: 'Posts in ' + category.value.name
            },
            {
                name: 'keywords',
                content: 'blog, posts, ' + category.value.name
            }
        ]
    })
})

    const getTaggedPosts = async(category) => {
  let url = `${process.env.VUE_APP_SERVER_URL}/blog/category/` + category
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
          <CategoryBody v-if="posts && posts.length > 0 " :taggedPosts="posts" :tagName="category.name"/>
          <h2 v-else-if="category" class="text-text-1 text-2xl p-5">No posts found tagged with "{{ category.name }}"</h2>
          <h2 v-else class="text-text-1 text-2xl p-5">Loading...</h2>
        <SiteFooter :thisPageComponentName="'Footer'" />
    </div>
</template>