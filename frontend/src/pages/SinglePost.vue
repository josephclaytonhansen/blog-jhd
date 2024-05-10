<script setup>
import { ref, onBeforeMount } from 'vue'
import CommentSection from '../components/bricks/comments/commentSection.vue'
import postProgressBar from '../components/bricks/post/postProgressBar.vue'
import authorBox from '../components/bricks/post/authorBox.vue'
import infoBox from '../components/bricks/post/infoBox.vue'
import postBody from '../components/bricks/post/postBody.vue'
import Sidebar from '../components/bricks/post/sidebar.vue'

import NoImageHeader from '../components/bricks/post/noImageHeader.vue'
import ImageHeader from '../components/bricks/post/imageHeader.vue'
import FullWidthImageHeader from '../components/bricks/post/fullWidthHeader.vue'

import SiteHeader from '../components/bricks/sitewide/Header.vue'
import SiteFooter from '../components/bricks/sitewide/Footer.vue'

import axios from 'axios'
import {useRouter} from 'vue-router'
const router = useRouter()

const props = defineProps({
  id: String,
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
    sessionStorage.removeItem(`post-${id}`)
    sessionStorage.removeItem(`timestamp-${id}`)
    sessionStorage.removeItem('checkResult')
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
        sessionStorage.setItem(`timestamp-${id}`, new Date().getTime())
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
  if (post && post.value.status !== "published"){
    isLoading.value = true
    try{
      let checkResult = sessionStorage.getItem('checkResult')
      if (!checkResult == "show" || !checkResult || checkResult === undefined || checkResult === null) {
  let checkParams = {
      user: localStorage.getItem('user'),
      session: sessionStorage.getItem('session')
  }
  let config = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
  }
      let checkResponse = await axios.post(`${process.env.VUE_APP_SERVER_URL}/user/checksession`, checkParams, config)
      if (checkResponse.status == 200) {
        if (!(checkResponse.data.message == "admin") && !(checkResponse.data.message == "author")) {
          router.push('/NotFound')
        } else {
          sessionStorage.setItem('checkResult', 'show')
          isLoading.value = false
        }
      } else {
        router.push('/NotFound')
      }} else {
        isLoading.value = false
      }

  } catch (error) {
    console.error(error)
    router.push('/NotFound')
  }
}
})
</script>

<template>
  <SiteHeader :thisPageComponentName="Header" />
  <div v-if="isLoading" class="flex w-screen h-screen overflow-hidden">
    <p class = "text-xl text-text-3">Loading...</p>
  </div>
  <div v-else class="bg-backdrop-1 flex items center align-middle">
    <postProgressBar />
    <div v-if="post.headerStyle == 'fullwidth'">
      <FullWidthImageHeader :post="post"/>
    </div>
    <div class = "flex space-between p-5 w-full text-text-1">
      <div class="w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-w-[70ch] mx-auto" id="post_content">
        <div v-if="post.headerStyle == 'noimage'">
          <NoImageHeader :post="post"/>
        </div>
        <div v-if="post.headerStyle == 'imageoverlay'">
          <ImageHeader :post="post" :overlay="true"/>
        </div>
        <div v-else-if="post.headerStyle == 'image'">
          <ImageHeader :post="post" :overlay="false"/>
        </div>
        <postBody :content="post.content"/>
        <div class="h-[800px] bg-backdrop-1"/>
        <hr class="block dividing-line" :class="post.sidebar ? 'lg:hidden' : ''"/>
        <authorBox  :author_id="post.author" :class="post.sidebar ? 'block md:block lg:hidden' : 'block md:block lg:block'" />
        <infoBox :views="post.views" :date="post.date" :tags="post.tags" :category="post.category" :comments="post.comments.length" :sidebar="post.sidebar"  :class="post.sidebar ? 'block md:block lg:hidden' : 'block md:block lg:block'" />
        <hr class="dividing-line"/>
        <CommentSection :post_id="post.id" />
      </div>
      <div class = "dividing-line-mid hidden" :class="post.sidebar ? 'lg:flex' : ''"></div>
      <Sidebar v-if="post.sidebar" :post="post"/>
    </div>
  </div>
  <SiteFooter :thisPageComponentName="Footer" />
</template>
