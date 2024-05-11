<script setup>
import { ref, onMounted } from 'vue'
import hdImage from '../images/hdImage.vue'
const props = defineProps({
  taggedPosts: Array,
  tagName: String
})

const site = window.location.hostname
const sitePosts = ref([])
const filterPostsOnThisSite = (posts) => {
  return posts.filter(post => post.site === site)
}

onMounted(() => {
  console.log(props.taggedPosts)
  sitePosts.value = filterPostsOnThisSite(props.taggedPosts)
  console.log(sitePosts.value)
})

const postLink = (post) => {
  if (post.location === '' || post.location === undefined || post.location === "/") {
    return '/' + post.slug
  } else {
    return '/' + post.location + '/' + post.slug
  }
}

const trimExcerpt = (excerpt) => {
  if (excerpt.length > 300) {
    return excerpt.substring(0, 300) + '...'
  } else {
    return excerpt
  }
}

</script>

<template>
    <div class="p-5 w-full text-text-1">
        <div class="w-full">
            <h1 class="text-3xl font-header">Posts tagged with "{{ props.tagName }}"</h1>
        </div>
        <div class="w-full">
            <p class="text-lg">There are {{ sitePosts.length }} posts tagged with "{{ props.tagName }}"</p>
        </div>
        <div class="w-full">
            <hr class="dividing-line"/>

            <div class="flex flex-wrap gap-3">

                <div v-for="post in sitePosts" :key="post.id" class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 backdrop rounded">
                    <hdImage :image="post.featuredImage" :alt="post.title"/>
                    <div class="p-3 flex flex-col items-center align-middle">
                        <h3 class="font-header text-lg text-center">{{ post.title }}</h3>
                        <p class="text-text-2" >{{ trimExcerpt(post.excerpt) }}</p>
                        <button class = "bg-accent-500 text-text-0 rounded p-2 cursor-pointer hover:bg-accent-600 duration-300 transition-all"><router-link :to="postLink(post)" class="text-text-2">Read</router-link></button>
                    </div> 
                </div>
                

            </div>

        </div>
    </div>
</template>


