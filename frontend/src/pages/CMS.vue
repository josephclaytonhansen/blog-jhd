<script setup>
import {
    Braces,
    CalendarDays,
    PenLine,
    Users,
    SwatchBook,
    Newspaper,
    Tags,
    MonitorSmartphone,
    Smartphone,
    Monitor,
    UserCog,
    Home,
    LineChart,
} from 'lucide-vue-next'

const sidebarButtons = [
{
        icon: Home,
        text: 'Home',
        link: '/cms'
    },
    {
        icon: CalendarDays,
        text: 'Blog',
        link: '/cms/blog'
    },
    {
        icon: PenLine,
        text: 'Pages',
        link: '/cms/pages'
    },
    {
        icon: Newspaper,
        text: 'Articles',
        link: '/cms/articles'
    },
    {
        icon: Users,
        text: 'Users',
        link: '/cms/users'
    },
    {
        icon: SwatchBook,
        text: 'Categories',
        link: '/cms/categories'
    },
    {
        icon: Tags,
        text: 'Tags',
        link: '/cms/tags'
    },
    {
        icon: MonitorSmartphone,
        text: 'Responsive',
        link: '/cms/responsive'
    },
    {
        icon: Braces,
        text: 'CSS',
        link: '/cms/css'
    },
    {
        icon: UserCog,
        text: 'Profile',
        link: '/cms/profile'
    },
    {
        icon: LineChart,
        text: 'Analytics',
        link: '/cms/analytics'
    },
]
</script>

<template>
    <div class = "w-full h-full overflow-hidden flex flex-row min-h-[100vh]">
        <div id="sidebar" class = "h-full min-h-[100vh] overflow-hidden bg-slate-800 flex flex-col items-start justify-center">
            <div v-for="button in sidebarButtons" class = "text-slate-400 hover:text-white flex flex-row items-center justify-start h-12 px-8 lg:py-8 xl:py-10 md:py-6 sm:py-10 py-10 cursor-pointer transition-all hover:bg-slate-700 w-full">
                <component :is="button.icon" class = "w-6 h-6 mr-3 "/>
                <router-link :to="button.link" class = "">{{ button.text }}</router-link>
            </div>
                
        </div>
        <div id="center" class = "grow h-full min-h-[100vh] overflow-hidden bg-slate-900"></div>
    </div>
</template>