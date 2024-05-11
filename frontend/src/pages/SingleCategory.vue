<script setup>
    import SiteHeader from '../components/bricks/sitewide/Header.vue'
    import SiteFooter from '../components/bricks/sitewide/Footer.vue'
    import categoryBody from '../components/bricks/category/categoryBody.vue'

    import {ref, onBeforeMount, defineProps} from 'vue'
    import {useRouter} from 'vue-router'
    const router = useRouter()
    import { useToast } from "vue-toastification"
    const toast = useToast()

    const categoryD = ref({})
    const posts = ref([])
    const props = defineProps({
    category: String,
    })

    const isLoading = ref(true)

    const getcategory = async (category) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/category/` + category
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        })

        if (response.status !== 200 && response.status !== 304) {
            router.push('/NotFound')
        }

        categoryD.value = await response.json()
    } catch (error) {
        console.error(error)
        router.push('/NotFound')
    }
    return categoryD.value
}

onBeforeMount(async () => {
    const result = await getcategory(props.category);
    if (result) {
        await getcategoryPosts(props.category, result.name);
    }
})

    const getcategoryPosts = async(category, name) => {
  let url = `${process.env.VUE_APP_SERVER_URL}/blog/category/` + name
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
      sessionStorage.setItem(`category-${category}`, JSON.stringify(posts.value))
      sessionStorage.setItem(`timestamp-${category}`, new Date().getTime())
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
    <div v-if="isLoading" class="flex w-screen h-screen overflow-hidden bg-backdrop-1">
        <SiteHeader :thisPageComponentName="'Header'" />
        <p class = "text-xl text-text-1">Loading...</p>
        <SiteFooter :thisPageComponentName="'Footer'" />
    </div>
    <div v-else class="bg-backdrop-1 flex flex-col items-start align-middle min-h-screen">
        <SiteHeader :thisPageComponentName="'Header'" />
          <categoryBody v-if="posts && posts.length > 0 " :categoryPosts="posts" :categoryName="categoryD.name"/>
          <h2 v-else-if="categoryD" class="text-text-1 text-2xl p-5">No posts found in category "{{ categoryD.name }}"</h2>
          <h2 v-else class="text-text-1 text-2xl p-5">Loading...</h2>
        <SiteFooter :thisPageComponentName="'Footer'" />
    </div>
</template>