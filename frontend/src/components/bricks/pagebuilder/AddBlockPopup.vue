<script setup>

import {ref, defineEmits } from 'vue'

const emits = defineEmits(['add-block'])

const props = defineProps({
    loc: Object
})

const addBlock = (block) => {
    emits('add-block', block)
}

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
    {name: 'Header', type: 'header', icon: '', component: 'HeaderBlock'},
    {name: 'Text', type: 'text', icon: '', component: 'TextBlock'},
    {name: 'Image', type: 'image', icon: '', component: 'ImageBlock'},
    {name: 'Video', type: 'video', icon: '', component: 'VideoBlock'},
    {name: 'Audio', type: 'audio', icon: '', component: 'AudioBlock'},
    {name: 'Blockquote', type: 'blockquote', icon: '', component: 'BlockquoteBlock'},
    {name: 'Colorblock', type: 'colorblock', icon: '', component: 'ColorblockBlock'},
    {name: 'Full block', type: 'full-block', icon: '', component: 'FullBlock'},
    {name: 'Divider', type: 'divider', icon: '', component: 'DividingLineBlock'},
    {name: 'Slider', type: 'slider', icon: '', component: 'SliderBlock'},
    {name: 'Gallery', type: 'gallery', icon: '', component: 'GalleryBlock'},
    {name: 'Button', type: 'button', icon: '', component: 'ButtonBlock'},
    {name: 'Script', type: 'script', icon: '', component: 'ScriptBlock'},
    {name: 'Form', type: 'form', icon: '', component: 'FormBlock'},
    {name: 'Calendar', type: 'calendar', icon: '', component: 'CalendarBlock'},
    {name: 'Event', type: 'event', icon: '', component: 'EventBlock'},
    {name: 'CTA', type: 'cta', icon: '', component: 'CTABlock'},
    {name: 'Product', type: 'product', icon: '', component: 'ProductBlock'},
    {name: 'Rating', type: 'rating', icon: '', component: 'RatingBlock'},
    {name: 'Note', type: 'note', icon: '', component: 'NoteBlock'},
    {name: 'Figure', type: 'figure', icon: '', component: 'FigureBlock'},
    {name: 'Chart', type: 'chart', icon: '', component: 'ChartBlock'},
    {name: 'Accordion', type: 'accordion', icon: '', component: 'AccordionBlock'},
    {name: 'Tabs', type: 'tabs', icon: '', component: 'TabsBlock'},
    {name: 'Footnotes', type: 'footnotes', icon: '', component: 'FootnotesBlock'},
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