<script setup>
import { ref,computed } from 'vue'
import AddBlock from './addBlock.vue'

const props = defineProps({
    rowIndex: {type: Number, required: true, default: 0},
})
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
        'grid',
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

</script>

<template>
    <div :class="rowClasses" :style="{ 'grid-template-columns': gridTemplateColumns }">
        <div  v-for="column in layout.columns" :key="column.index" class="border-2 border-dashed border-accent-500 duration-150 hover:border-accent-200 transition-colors h-full" :class="columnClasses">
            <div class="blocks w-full h-full">
                <component v-for="block in column.blocks" :key="block.id" :is="block.type" :block="block" />
                <AddBlock :column="column" :row="props.rowIndex" @block-added="blockAdded" />
            </div>
        </div>
    </div>
</template>