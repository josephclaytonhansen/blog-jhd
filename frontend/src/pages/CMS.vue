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

const activeComponent = ref("preview")

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

const updateActiveComponent = (component) => {
    activeComponent.value = component
    if (component == 'logout') {
        router.push('/logout')
    }
}

onMounted(() => {
    activeComponent.value = PreviewC
})
</script>

<template>
    <div class = "w-full h-full overflow-hidden flex flex-row min-h-[100vh]">
        <div id="sidebar" class = "h-full min-h-[100vh] overflow-hidden bg-slate-800 flex flex-col items-start justify-center">
            <div v-for="button in sidebarButtons" class = "text-slate-400 flex flex-row items-center justify-start h-12 px-8 lg:py-8 xl:py-10 md:py-6 sm:py-10 py-10 cursor-pointer transition-all hover:bg-slate-700 w-full duration-300" :class="activeComponent == button.component ? 'bg-slate-600 text-white' : ''"  @click="updateActiveComponent(button.component)">
                <component :is="button.icon" class = "w-6 h-6 md:mr-3 " />
                <span class = "hidden sm:hidden md:block">{{ button.text }}</span>
            </div>
                
        </div>
        <div id="center" class = "grow h-full min-h-[100vh] overflow-hidden bg-slate-900">
            <component :is="activeComponent" />
        </div>
    </div>
</template>