<script setup>
import { ref, onMounted} from 'vue'
import CommentSection from '../components/bricks/comments/commentSection.vue'
import postProgressBar from '../components/bricks/post/postProgressBar.vue'
import authorBox from '../components/bricks/post/authorBox.vue'
import infoBox from '../components/bricks/post/infoBox.vue'
import postBody from '../components/bricks/post/postBody.vue'
import Sidebar from '../components/bricks/post/sidebar.vue'
import MessageBanner from '../components/bricks/post/messageBanner.vue'

import NoImageHeader from '../components/bricks/post/noImageHeader.vue'
import ImageHeader from '../components/bricks/post/imageHeader.vue'
import FullWidthImageHeader from '../components/bricks/post/fullWidthHeader.vue'

import SiteHeader from '../components/bricks/sitewide/Header.vue'
import SiteFooter from '../components/bricks/sitewide/Footer.vue'

import axios from 'axios'
import {useRouter, useRoute} from 'vue-router'
const router = useRouter()

import { useHead } from '@vueuse/head'

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
    isLoading.value = true
    sessionStorage.removeItem(`post-${displayNameSlugified}`)
    sessionStorage.removeItem(`timestamp-${displayNameSlugified}`)
    sessionStorage.removeItem('checkResult')
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/` 
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token,
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
          isLoading.value = true
          router.push('/NotFound')
        }
        let posts = await response.json()
        post.value = posts.find(post => slugify(post.title) === displayNameSlugified)
        if (!(post.value._id)) {
          isLoading.value = true
          router.push('/NotFound')
        }
        if (window.location.hostname !== post.value.site) {
          isLoading.value = true
          router.push('/NotFound')
        }
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
  isLoading.value = true
  const route = useRoute()
  const titleSlugifiedFromUrlParams = route.params.slug
  await getPost(titleSlugifiedFromUrlParams)
  
  let url = `${process.env.VUE_APP_SERVER_URL}/blog/incrementviews/` + post.value._id
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.token,
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

  try{user.value = JSON.parse(localStorage.getItem('user')).user
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
                .then(async (response) => {
                    if (response.status !== 200) {
                        throw new Error('Network error- could not get user')
                    }
                    user.value = await response.json()
                    console.log("USER: " + user.value)
                })
        } catch (error) {
          console.error(error)

        }
    } else {
        
    } } catch (error) {
        console.error(error)
        user.value = {
          _id: null
        }
    }

    useHead({
  title: post.value.title + ' | ' + post.value.site,
  meta: [
   {
      name: 'description',
      content: post.value.description
    },
    {
      name: 'keywords',
      content: post.value.tags.join(', ') + ', ' + post.value.category + post.value.metaKeywords.split(',').join(', ')
   },
    {
      name: 'robots',
      content: 'index, follow'
   },
   {
    name: 'og:title',
    content: post.value.title + ' | ' + post.value.site
   },
   {
    name: 'og:description',
    content: post.value.description
   },
   {
    name: 'og:image',
    content: post.value.featuredImage
   },
   {
    name: 'og:url',
    content: "https://" + post.value.site + "/p/" + slugify(post.value.title)
   },
   {
    name: 'og:type',
    content: 'article'
   },
   {
    name: 'og:site_name',
    content: post.value.site
   },
   {
    name: 'og:locale',
    content: 'en_US'
   },
   {
    name: 'twitter:image',
    content: post.value.featuredImage
   },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: post.value.title + ' | ' + post.value.site
    },
    {
      name: 'twitter:description',
      content: post.value.description
    },
    {
      name: 'twitter:url',
      content: "https://" + post.value.site + "/p/" + slugify(post.value.title)
    },
  ]
})
})


</script>

<template>
  
  <div v-if="isLoading" class="flex flex-col w-screen h-screen overflow-hidden bg-backdrop-1">
    <SiteHeader :thisPageComponentName="'Header'" />
            <p class = "text-xl text-text-1 w-full">Loading...</p>
        <SiteFooter :thisPageComponentName="'Footer'" />
  </div>
  <div v-else class="bg-backdrop-1 flex flex-col items-start align-middle min-h-screen" :class="post.messageBar ? 'pb-24' : ''">
    <SiteHeader :thisPageComponentName="'Header'" />
    <postProgressBar />
    <div v-if="post.headerStyle == 'fullwidth'">
      <FullWidthImageHeader :post="post"/>
    </div>
    <div class = "flex space-between p-5 w-full text-text-1">
      <div class="w-[80vw] max-w-[100ch] mx-auto" id="post_content">
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
  <MessageBanner v-if="post.messageBar" :message="post.messageBarContent" :type="post.messageBarType" :link="post.messageBarLink" :linkText="post.messageBarLinkText"/>
  <SiteFooter :thisPageComponentName="'Footer'" />
</template>
