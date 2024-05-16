<script setup>

import {ref, defineEmits } from 'vue'

const emits = defineEmits(['add-block'])

const props = defineProps({
    loc: Object
})

const addBlock = (block) => {
    emits('add-block', block)
}

import {
    Heading,
    Text,
    Image,
    Video,
    Music,
    Quote,
    BoxSelect,
    Columns2,
    SquareSplitVertical,
    GalleryHorizontalEnd,
    LayoutGrid,
    SquareChevronRight,
    ScrollText,
    MessageSquareText,
    Calendar,
    Ticket,
    Filter,
    Package,
    Star,
    StickyNote,
    Microscope,
    BarChart3,
    ListCollapse,
    GalleryThumbnails,
    BookDown
} from 'lucide-vue-next'

import HeaderBlock from './blocks/HeaderBlock.vue'
import TextBlock from './blocks/TextBlock.vue'
import ImageBlock from './blocks/ImageBlock.vue'
import VideoBlock from './blocks/VideoBlock.vue'
import AudioBlock from './blocks/AudioBlock.vue'
import BlockquoteBlock from './blocks/BlockquoteBlock.vue'
import ColorblockBlock from './blocks/ColorblockBlock.vue'
import FullBlock from './blocks/FullBlock.vue'
import DividingLineBlock from './blocks/DividingLineBlock.vue'
import SliderBlock from './blocks/SliderBlock.vue'
import GalleryBlock from './blocks/GalleryBlock.vue'
import ButtonBlock from './blocks/ButtonBlock.vue'
import ScriptBlock from './blocks/ScriptBlock.vue'
import FormBlock from './blocks/FormBlock.vue'
import CalendarBlock from './blocks/CalendarBlock.vue'
import EventBlock from './blocks/EventBlock.vue'
import CTABlock from './blocks/CTABlock.vue'
import ProductBlock from './blocks/ProductBlock.vue'
import RatingBlock from './blocks/RatingBlock.vue'
import NoteBlock from './blocks/NoteBlock.vue'
import FigureBlock from './blocks/FigureBlock.vue'
import ChartBlock from './blocks/ChartBlock.vue'
import AccordionBlock from './blocks/AccordionBlock.vue'
import TabsBlock from './blocks/TabsBlock.vue'
import FootnotesBlock from './blocks/FootnotesBlock.vue'

const blocks = ref([
    {name: 'Header', type: 'header', icon: 'Heading', component: 'HeaderBlock'},
    {name: 'Text', type: 'text', icon: 'Text', component: 'TextBlock'},
    {name: 'Image', type: 'image', icon: 'Image', component: 'ImageBlock'},
    {name: 'Video', type: 'video', icon: 'Video', component: 'VideoBlock'},
    {name: 'Audio', type: 'audio', icon: 'Music', component: 'AudioBlock'},
    {name: 'Blockquote', type: 'blockquote', icon: 'Quote', component: 'BlockquoteBlock'},
    {name: 'Colorblock', type: 'colorblock', icon: 'BoxSelect', component: 'ColorblockBlock'},
    {name: 'Full', type: 'full', icon: 'Columns2', component: 'FullBlock'},
    {name: 'Dividing Line', type: 'dividing-line', icon: 'SquareSplitVertical', component: 'DividingLineBlock'},
    {name: 'Slider', type: 'slider', icon: 'GalleryHorizontalEnd', component: 'SliderBlock'},
    {name: 'Gallery', type: 'gallery', icon: 'LayoutGrid', component: 'GalleryBlock'},
    {name: 'Button', type: 'button', icon: 'SquareChevronRight', component: 'ButtonBlock'},
    {name: 'Script', type: 'script', icon: 'ScrollText', component: 'ScriptBlock'},
    {name: 'Form', type: 'form', icon: 'MessageSquareText', component: 'FormBlock'},
    {name: 'Calendar', type: 'calendar', icon: 'Calendar', component: 'CalendarBlock'},
    {name: 'Event', type: 'event', icon: 'Ticket', component: 'EventBlock'},
    {name: 'CTA', type: 'cta', icon: 'Filter', component: 'CTABlock'},
    {name: 'Product', type: 'product', icon: 'Package', component: 'ProductBlock'},
    {name: 'Rating', type: 'rating', icon: 'Star', component: 'RatingBlock'},
    {name: 'Note', type: 'note', icon: 'StickyNote', component: 'NoteBlock'},
    {name: 'Figure', type: 'figure', icon: 'Microscope', component: 'FigureBlock'},
    {name: 'Chart', type: 'chart', icon: 'BarChart3', component: 'ChartBlock'},
    {name: 'Accordion', type: 'accordion', icon: 'ListCollapse', component: 'AccordionBlock'},
    {name: 'Tabs', type: 'tabs', icon: 'GalleryThumbnails', component: 'TabsBlock'},
    {name: 'Footnotes', type: 'footnotes', icon: 'BookDown', component: 'FootnotesBlock'}
])



const centerOnClick = (loc) => {
    let width = "4rem"
    let x = loc.x
    let calc = `calc(${x}px - 2rem)`
    return {
        left: calc + 'px',
        top: loc.y + 'px'
    }
}

</script>

<template>
    <div id="add-block-popup" class="absolute bg-backdrop-0 text-text-0 p-5 rounded w-16 overflow-y-auto overflow-x-hidden z-50" :style="centerOnClick(props.loc)">
        <div class = "w-full h-full grid-cols-3">
            <div v-for="block in blocks" :key="block.type" class="flex items-center justify-center p-2">
                <component :is="block.icon" @click="addBlock({type: block.type, component:block.component, id: Math.random().toString(36).substring(7)})" class="bg-transparent w-full h-full text-black hover:bg-accent-500 duration-300 transition-all">
                    <p style="font-size: .4rem;">{{ block.name }}</p>
                </component>
            </div>
        </div>
    </div>
</template>