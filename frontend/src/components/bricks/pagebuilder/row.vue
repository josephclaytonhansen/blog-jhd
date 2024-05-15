<script setup>
import { ref,computed, defineEmits } from 'vue'
import AddBlock from './addBlock.vue'

import {Trash} from 'lucide-vue-next'

const props = defineProps({
    rowIndex: {type: Number, required: true, default: 0},
})

const emits = defineEmits(['remove-self'])

const removeSelf = () => {
    emits('remove-self')
}

const layout = ref(
    {
        items: 'center',
        justify: 'center',
        columnWidths: [66.67, 33.33],
        columnGutter: 0,
        gap: 2,
        columns: [
            {
                index: 0,
                blocks: []
            },
            {
                index: 1,
                blocks: []
            }
        ]
    }
)

const rowClasses = computed(() => {
    return [
        'grid relative',
        'items-' + layout.value.items,
        'justify-' + layout.value.justify,
        'gap-' + layout.value.gap,
        'grid-cols-' + layout.value.columnCount
    ]
})

const columnClasses = computed(() => {
    return [
        'w-full',
    ]
})

const gridTemplateColumns = computed(() => {
    return layout.value.columnWidths.map(width => `${width}%`).join(' ')
})

const blockAdded = (block) => {
    console.log('block added', block)
    layout.value.columns[block.column].blocks.push(block)
}

const removeBlock = (block) => {
    layout.value.columns[block.column].blocks = layout.value.columns[block.column].blocks.filter(b => b.id !== block.id)
    
}

</script>

<template>
    <div :class="rowClasses" :style="{ 'grid-template-columns': gridTemplateColumns }">
        <Trash @click="removeSelf" class="absolute top-0 right-0 p-[1px] bg-accent-500 w-2 h-2 text-white hover:bg-accent-600 duration-150 transition-all" />
        <div  v-for="column in layout.columns" :key="column.index" class="border-2 border-dashed border-accent-500 duration-150 hover:border-accent-200 transition-colors h-full" :class="columnClasses">
            <div class="blocks w-full h-full relative">
                <div v-for="block in column.blocks" :key="block.id" class="relative">
                    <component :is="block.type" :block="block" />
                    <Trash @click="removeBlock(block)" class="absolute top-0 right-0 p-[1px] bg-accent-500 w-2 h-2 text-white hover:bg-accent-600 duration-150 transition-all" />
                </div>
                <AddBlock :column="column" :row="props.rowIndex" @block-added="blockAdded" />
            </div>
        </div>
    </div>
</template>