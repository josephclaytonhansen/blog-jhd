<script setup>
import {
    CalendarDays,
    PenLine,
    Users,
    SwatchBook,
    Newspaper,
    Tags,
    MonitorSmartphone,
    Server,
    UserCog,
    UserX,
    LineChart,
} from 'lucide-vue-next'

import { onMounted, ref } from 'vue'

const activeComponent = ref(PreviewC)

import { useRouter } from 'vue-router'

import PreviewC from './cms/preview.vue'
import PostsC from './cms/posts.vue'
import PagesC from './cms/pages.vue'
import ArticlesC from './cms/articles.vue'
import UsersC from './cms/users.vue'
import TagsC from './cms/tags.vue'
import StylesC from './cms/styles.vue'
import ProfileC from './cms/profile.vue'
import AnalyticsC from './cms/analytics.vue'
import ServerC from './cms/server.vue'

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
        icon: Newspaper,
        text: 'Articles',
        component: ArticlesC
    },
    {
        icon: Users,
        text: 'Users',
        component: UsersC
    },
    {
        icon: Tags,
        text: 'Tags',
        component: TagsC
    },
    {
        icon: SwatchBook,
        text: 'Styles',
        component: StylesC
    },
    {
        icon: UserCog,
        text: 'Profile',
        component: ProfileC
    },
    {
        icon: LineChart,
        text: 'Analytics',
        component: AnalyticsC
    },
    {
        icon: Server,
        text: 'Server',
        component: ServerC
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
        case ArticlesC:
            return 'articles'
            break
        case UsersC:
            return 'users'
            break
        case TagsC:
            return 'tags'
            break
        case StylesC:
            return 'styles'
            break
        case ProfileC:
            return 'profile'
            break
        case AnalyticsC:
            return 'analytics'
            break
        case ServerC:
            return 'server'
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
        case ArticlesC:
            localStorage.setItem('activeComponent', 'articles')
            break
        case UsersC:
            localStorage.setItem('activeComponent', 'users')
            break
        case TagsC:
            localStorage.setItem('activeComponent', 'tags')
            break
        case StylesC:
            localStorage.setItem('activeComponent', 'styles')
            break
        case ProfileC:
            localStorage.setItem('activeComponent', 'profile')
            break
        case AnalyticsC:
            localStorage.setItem('activeComponent', 'analytics')
            break
        case ServerC:
            localStorage.setItem('activeComponent', 'server')
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
            case 'articles':
                activeComponent.value = ArticlesC
                break
            case 'users':
                activeComponent.value = UsersC
                break
            case 'tags':
                activeComponent.value = TagsC
                break
            case 'styles':
                activeComponent.value = StylesC
                break
            case 'profile':
                activeComponent.value = ProfileC
                break
            case 'analytics':
                activeComponent.value = AnalyticsC
                break
            case 'server':
                activeComponent.value = ServerC
                break
        }
    } else {
        activeComponent.value = PreviewC
        localStorage.setItem('activeComponent', PreviewC)
    }
})
</script>

<template>
    <div class = "w-full h-full overflow-hidden flex flex-row min-h-[100vh]">
        <div id="sidebar" class = "h-full min-h-[100vh] overflow-hidden bg-slate-800 flex flex-col items-start justify-center">
            <div v-for="button in sidebarButtons" class = "text-slate-400 flex flex-row items-center justify-start h-12 px-1 py-0 sm:px-4 lg:py-8 xl:py-10 md:py-6 sm:py-10 cursor-pointer transition-all hover:bg-slate-700 w-full duration-300" :class="stringCheck(compToString(button.component)) ? 'bg-slate-600 text-white' : ''"  @click="updateActiveComponent(button.component)">
                <component :is="button.icon" class = "w-10 h-10 md:w-7 min-w-4 min-h-4 md:min-w-7 md:min-h-7 lg:w-5 md:mr-3" />
                <span class = "hidden sm:hidden md:block">{{ button.text }}</span>
            </div>
                
        </div>
        <div id="center" class = "grow h-full min-h-[100vh] overflow-auto bg-slate-900">
            <component :is="activeComponent" />
        </div>
    </div>
</template>