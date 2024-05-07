<script setup lang="ts">
import { onMounted, ref, defineEmits, watch } from 'vue'
import { QuillyEditor } from 'vue-quilly'
import { Delta, Range } from 'quill/core'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import MagicUrl from 'quill-magic-url'
import 'quill/dist/quill.core.css'

Quill.register('modules/magicUrl', MagicUrl)

import { useToast } from "vue-toastification"
import { Save, ListTree, CalendarClock, Check, PencilLine, Info } from 'lucide-vue-next'

const editor = ref<InstanceType<typeof QuillyEditor>>()
const model = ref<string>(`<p>Hello, World!</p>`)
const editorDelta = ref<Delta>()
const editorRange = ref<Range>()

let quill: Quill | null = null

const options = ref({
  theme: 'snow',
  modules: {
    magicUrl: true,
    toolbar: [
      [ { size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'super' }, { script: 'sub' }],
      [{ header: '2' }, { header: '3' }, { header: '4' },  'blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['direction', { align: [] }],
      ['link', 'image', 'video', 'formula', 'clean'],
      ['table'],
      ['clean']
    ]
  },
  placeholder: 'Insert text here ...',
  readOnly: false
})

onMounted(() => {
  quill = editor.value?.initialize(Quill)!
})

watch(() => model.value, (value) => {
  if (quill) {
    let temp = new Delta(
      quill.clipboard.convert({html: value})
  )
    quill.setContents(temp)
  }
})

const emit = defineEmits(['update:modelValue'])

const onTextChange = ({ delta }) => {
  editorDelta.value = delta
  emit('update:modelValue', model.value)
}

const onSelectionChange = ({ range }: { range: Range }) => (editorRange.value = range)
const onEditorChange = (eventName: string) => console.log(eventName)
</script>

<template>
  <div class="flex items-center align-middle p-4 max-w-full overflow-auto">
    <div class="w-full">
  <QuillyEditor
  class="bg-backdrop-2 text-text-1 font-body w-full min-w-[400px]"
    ref="editor"
    v-model="model"
    :options="options"
    @text-change="onTextChange"
    @selection-change="onSelectionChange"
    @editor-change="onEditorChange"
  />
</div>
</div>
</template>
