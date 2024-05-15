<script setup>

import { ref } from 'vue'
const rows = ref([0]) // array of row indexes

const addRow = () => {
    rows.value.push(rows.value.length)
}

const removeRow = (index) => {
    rows.value.splice(index, 1)
}

import Row from './row.vue'
import {Plus} from 'lucide-vue-next'

</script>

<template>
    <div class="pagebuilder">
        <div class="flex flex-col items-center justify-center">
            <button @click="addRow" class="px-3 py-2 bg-accent-500 text-white rounded hover:bg-accent-600 duration-300 transition-all flex gap-2 mb-2">
                <Plus/>
                Add Row
            </button>
            <Row v-for="row in rows" :key="row" :row-index="row" @remove-self="removeRow(row)" />
            <button @click="addRow" class="px-3 py-2 bg-accent-500 text-white rounded hover:bg-accent-600 duration-300 transition-all flex gap-2 mt-2">
                <Plus/>
                Add Row
            </button>
        </div>
    </div>
</template>