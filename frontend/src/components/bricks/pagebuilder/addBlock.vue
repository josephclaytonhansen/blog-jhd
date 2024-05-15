<script setup>

const props = defineProps({
    rowIndex: Number,
    column: Object
})

import { defineEmits } from 'vue'
const emits = defineEmits(['block-added'])

import { Plus} from 'lucide-vue-next'
import AddBlockPopup from './addBlockPopup.vue'

const popup = ref(false)
const popupLoc = ref({x: 0, y: 0})

const showPopupBlockMenu = (e) => {
    popup.value = !popup.value
    let mousePos = {
        x: e.clientX,
        y: e.clientY
    }
    if (popup.value) {
        console.log(mousePos)
        popupLoc.value = mousePos
    }
}

const addBlock = (data) => {

    console.log('add block', props.column, props.rowIndex, data )

    props.column.blocks.push(data)
    emits('block-added', data)
}

</script>

<template>
    <div class="flex items-center justify-center h-full">
        <AddBlockPopup v-if="popup" @add-block="addBlock" :loc="popupLoc" />
        <button @click="showPopupBlockMenu($event)" class="p-4 bg-transparent text-accent-500 hover:text-accent-300 transition-colors duration-300">
            <Plus />
        </button>
    </div>
</template>
