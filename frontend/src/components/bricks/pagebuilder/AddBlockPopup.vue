<script setup>

import {ref, defineEmits } from 'vue'

const emits = defineEmits(['add-block'])

const props = defineProps({
    loc: Object
})

const addBlock = (block) => {
    emits('add-block', block)
}

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
    </div>
</template>