<script>
import { ref, onMounted, readonly } from 'vue'
import axios from 'axios'
import { QuillyEditor } from 'vue-quilly'
import Quill from 'quill'
import { Delta } from 'quill/core'
import MagicUrl from 'quill-magic-url'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'

Quill.register('modules/magicUrl', MagicUrl)

import { useToast } from "vue-toastification"
import { Save, ListTree, CalendarClock, Check, PencilLine, Info } from 'lucide-vue-next'

const options = {
  modules: {
    magicUrl: true,
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
      ['code-block'],
      ['blockquote'],
      ['video'],
      ['formula'],
      ['table'],
      ['undo', 'redo'],
    ],
  },
  theme: 'snow',
  readonly: false,
}

const editor = ref(QuillyEditor)
const model = ref('<p>Hello World!</p>')


onMounted(() => {
  const quill = editor.value.initialize(Quill)
})
</script>

<template>
  <QuillyEditor
  ref="editor"
  v-model="model"
  :options="options"
  @text-change="({ delta, oldContent, source }) => console.log('text-change', delta, oldContent, source)"
  @selection-change="({ range, oldRange, source }) => console.log('selection-change', range, oldRange, source)"
  @editor-change="(eventName) => console.log('editor-change', `eventName: ${eventName}`)"
  @focus="(quill) => console.log('focus', quill)"
  @blur="(quill) => console.log('blur', quill)"
  @ready="(quill) => console.log('ready', quill)"
/>
</template>
