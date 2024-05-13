<script setup>
import { ref, onMounted} from 'vue'
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
import {useRouter, useRoute} from 'vue-router'
const router = useRouter()

const slugify = (string) => {
  return string.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
}

const post = ref({})
const user = ref('')

const isLoading = ref(true)

const getPost = async (displayNameSlugified) => {
  const cachedPost = sessionStorage.getItem(`post-${displayNameSlugified}`)
  const timestamp = sessionStorage.getItem(`timestamp-${displayNameSlugified}`)

  if (cachedPost && timestamp && new Date().getTime() - Number(timestamp) < 45 * 60 * 1000) {
    post.value = JSON.parse(cachedPost)
    isLoading.value = false
  } else {
    sessionStorage.removeItem(`post-${displayNameSlugified}`)
    sessionStorage.removeItem(`timestamp-${displayNameSlugified}`)
    sessionStorage.removeItem('checkResult')
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/` 
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
        let posts = await response.json()
        post.value = posts.find(post => slugify(post.title) === displayNameSlugified)
        sessionStorage.setItem(`post-${displayNameSlugified}`, JSON.stringify(post.value))
        sessionStorage.setItem(`timestamp-${displayNameSlugified}`, new Date().getTime())
        isLoading.value = false
      })
    } catch (error) {
      console.error(error)
      isLoading.value = false
      router.push('/NotFound')
    }
  }
}

onMounted(async () => {
  const route = useRoute()
  const titleSlugifiedFromUrlParams = route.params.slug
  await getPost(titleSlugifiedFromUrlParams)
  let url = `${process.env.VUE_APP_SERVER_URL}/blog/incrementviews/` + post.value._id
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true
  }
  try {
    await fetch(url, {
      method: 'POST',
      headers: config.headers,
      credentials: 'include'
    }).then(async (response) => {
      if (response.status !== 200) {
        console.error('Network error- could not increment views')
      }
    })
  } catch (error) {
    console.error(error)
  }

  user.value = JSON.parse(localStorage.getItem('user')).user
    let user_id = user._id
    if (user_id) {
        let url = `${process.env.VUE_APP_SERVER_URL}/user/id/` + user_id
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        try {
            await fetch(url, {
                method: 'GET',
                headers: config.headers,
                credentials: 'include',
            })
        } catch (error) {
          console.error(error)

        }
    } else {
        user.value = ''
    }


})
</script>

<template>
  
  <div v-if="isLoading" class="flex flex-col w-screen h-screen overflow-hidden bg-backdrop-1">
    <SiteHeader :thisPageComponentName="'Header'" />
            <p class = "text-xl text-text-1 w-full">Loading...</p>
        <SiteFooter :thisPageComponentName="'Footer'" />
  </div>
  <div v-else class="bg-backdrop-1 flex flex-col items-start align-middle min-h-screen">
    <SiteHeader :thisPageComponentName="'Header'" />
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
        <hr class="block dividing-line" :class="post.sidebar ? 'lg:hidden' : ''"/>
        <authorBox  :author_id="post.author" :class="post.sidebar ? 'block md:block lg:hidden' : 'block md:block lg:block'" />
        <infoBox :views="post.views" :date="post.date" :tags="post.tags" :category="post.category" :comments="post.comments.length" :sidebar="post.sidebar"  :class="post.sidebar ? 'block md:block lg:hidden' : 'block md:block lg:block'" />
        <hr class="dividing-line"/>
        <CommentSection :post_id="post._id" :user="user._id" />
      </div>
      <div class = "dividing-line-mid hidden" :class="post.sidebar ? 'lg:flex' : ''"></div>
      <Sidebar v-if="post.sidebar" :post="post"/>
    </div>
  </div>
  <SiteFooter :thisPageComponentName="'Footer'" />
</template>
