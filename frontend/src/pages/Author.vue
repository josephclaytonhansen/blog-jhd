<script setup>
import {
    CalendarDays,
    PenLine,
    Users,
    SwatchBook,
    Tags,
    MonitorSmartphone,
    MessageCircleMore,
    UserX,
    LineChart,
} from 'lucide-vue-next'

import { onMounted, ref } from 'vue'

const activeComponent = ref(PreviewC)

import { useRouter } from 'vue-router'

import PreviewC from './cms/preview.vue'
import PostsC from './cms/posts.vue'
import PagesC from './cms/pages.vue'

import TagsC from './cms/tags.vue'

import CommentsC from './cms/comments.vue'

const router = useRouter()

const sidebarButtons = [
{
        icon: MonitorSmartphone,
        text: 'Preview',
        component: PreviewC
    },
    {
        icon: CalendarDays,
        text: 'Posts',
        component: PostsC
    },
    {
        icon: PenLine,
        text: 'Pages',
        component: PagesC
    },
    {
        icon: Tags,
        text: 'Tags',
        component: TagsC
    },
    {
        icon: MessageCircleMore,
        text: 'Comments',
        component: CommentsC
    },
    {
        icon: UserX,
        text: 'Logout',
        component: 'logout'
    },
]

const compToString = (component) => {
    switch (component) {
        case PreviewC:
            return 'preview'
            break
        case PostsC:
            return 'posts'
            break
        case PagesC:
            return 'pages'
            break

        case TagsC:
            return 'tags'
            break

        case CommentsC:
            return 'comments'
            break
    }
}

const stringCheck = (string) => {
    return localStorage.getItem('activeComponent') === string
}

const updateActiveComponent = (component) => {
    activeComponent.value = component
    switch (component) {
        case PreviewC:
            localStorage.setItem('activeComponent', 'preview')
            break
        case PostsC:
            localStorage.setItem('activeComponent', 'posts')
            break
        case PagesC:
            localStorage.setItem('activeComponent', 'pages')
            break

        case TagsC:
            localStorage.setItem('activeComponent', 'tags')
            break

        case CommentsC:
            localStorage.setItem('activeComponent', 'comments')
            break
    }
    if (component == 'logout') {
        router.push('/logout')
    }
}

onMounted(() => {
    let localActiveComponent = localStorage.getItem('activeComponent')
    if (localActiveComponent) {
        switch (localActiveComponent) {
            case 'preview':
                activeComponent.value = PreviewC
                break
            case 'posts':
                activeComponent.value = PostsC
                break
            case 'pages':
                activeComponent.value = PagesC
                break

            case 'tags':
                activeComponent.value = TagsC
                break


            case 'comments':
                activeComponent.value = CommentsC
                break
        }
    } else {
        activeComponent.value = PreviewC
        localStorage.setItem('activeComponent', PreviewC)
    }
})
</script>

<template>
    <div class="w-full h-full overflow-hidden flex flex-row min-h-[100vh]">
        <div id="sidebar" class="h-full min-h-[100vh] overflow-hidden bg-backdrop-2 flex flex-col items-start justify-center min-w-[30px] md:min-w-[150px]">
            <div v-for="button in sidebarButtons" class="text-text-2 flex flex-row items-center justify-start h-12 px-1 py-0 sm:px-4 lg:py-8 xl:py-10 md:py-6 sm:py-10 cursor-pointer transition-all hover:bg-backdrop-1 w-full duration-300" :class="stringCheck(compToString(button.component)) ? 'bg-backdrop-0 text-text-0' : ''"  @click="updateActiveComponent(button.component)">
                <component :is="button.icon" class="w-10 h-10 md:w-7 min-w-4 min-h-4 md:min-w-7 md:min-h-7 lg:w-5 md:mr-3" />
                <span class="hidden sm:hidden md:block">{{ button.text }}</span>
            </div>
                
        </div>
        <div id="center" class="grow h-full min-h-[100vh] overflow-auto bg-backdrop-3">
            <component :is="activeComponent" />
        </div>
    </div>
</template>