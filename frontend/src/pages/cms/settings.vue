<script setup>
import {onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Toggle from '@/components/bricks/userInteraction/toggle.vue'

import {Check, X, Wifi, Blocks} from 'lucide-vue-next'

const prefixes = ref([])
const protocol = ref("https://")
const testResults = ref([])

const testConnection = async (site) => {
    let connectionSuccessful = false
    let titleCorrect = false

    try {
        let response = await axios.get(`${protocol.value}${site}/Seabasstest`)
        connectionSuccessful = true
        let data = response.data
        titleCorrect = data.includes('<title>Seabass Test</title>')
    } catch (error) {
        if (!error.response) {
            connectionSuccessful = true
            titleCorrect = false
        }
    }

    return [connectionSuccessful, titleCorrect]
}

onMounted(async () => {
      prefixes.value = process.env.VUE_APP_FRONTEND_PREFIXES
      for (const prefix of prefixes.value) {
        testResults.value[prefix] = await testConnection(prefix)
      }
      return { prefixes, testResults }
    })

    const fontSansOptions = ref([
        {name: "Fira Sans", font: 'font-FiraSans'},
        {name: "Merriweather Sans", font: 'font-MerriweatherSans'},
        {name: "Cairo", font: 'font-Cairo'},
        {name: "Titilium", font: 'font-Titilium'},
        {name: "Anaheim", font: 'font-Anaheim'},
        {name: "Prompt", font: 'font-Prompt'},
        {name: "Comfortaa", font: 'font-Comfortaa'},
        {name: "Poppins", font: 'font-Poppins'},
        {name: "Lato", font: 'font-Lato'},
        {name: "Montserrat", font: 'font-Montserrat'},
        {name: "Nunito Sans", font: 'font-NunitoSans'},
    ])

    const fontSerifOptions = ref([
        {name: "Libre Baskerville", font: 'font-LibreBaskerville'},
        {name: "Martel", font: 'font-Martel'},
        {name: "CormorantGaramond", font: 'font-CormorantGaramond'},
        {name: "Glegoo", font: 'font-Glegoo'},
        {name: "Graduate", font: 'font-Graduate'},
        {name: "Besley", font: 'font-Besley'},
        {name: "Maitree", font: 'font-Maitree'},
        {name: "Lora", font: 'font-Lora'},
        {name: "Slabo", font: 'font-Slabo'},
        {name: "Crimson Text", font: 'font-CrimsonText'},
        {name: "Playfair Display", font: 'font-PlayfairDisplay'},
    ])

    const colorOptions = ref([
        'slate',
        'gray',
        'zinc',
        'neutral',
        'stone',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',

    ])

    const currentSelectedSansFont = ref(fontSansOptions.value[0])
    const currentSelectedSerifFont = ref(fontSerifOptions.value[0])

    const currentSelectedAccentColor = ref(colorOptions.value[13])
    const currentSelectedBackDropColor = ref(colorOptions.value[0])

    const serifBodyText = ref(false)
    const serifHeaderText = ref(false)
    const uppercaseHeader1and2 = ref(false)

    const currentSiteSettings = ref('')
    const allSites = process.env.VUE_APP_FRONTEND_PREFIXES
</script>


<template>
    <div class="p-8 flex flex-wrap gap-4">
        <div class="p-8 bg-backdrop-800 rounded shrink max-w-full md:max-w-[48%] transition-all duration-300">
            <h2 class= "text-2xl text-backdrop-200 pb-4">Current Sites</h2>
            <p class="text-backdrop-300 pb-2">
                <details>
                    <summary>Info</summary>
                    Seabass makes it simple to manage multiple sites from one dashboard. If you want to add or remove a site, you'll need to do so from the Seabass server terminal.<br/><br/> Note that a Seabass failure doesn't necessarily mean that Seabass is offline. This may be a CORS issue- make sure that the site is configured to allow connections from this Seabass dashboard URL. 

                </details>
            </p>
            <ul class="text-backdrop-300">
                <li v-for="prefix in prefixes" :key="prefix" class="text-backdrop-300 flex gap-3">
                <div v-if="testResults[prefix] && testResults[prefix][0]"><Wifi class="inline-block w-6 h-6 text-green-500"/></div>
                <div v-else><Wifi class="inline-block w-6 h-6 text-red-500"/></div>
                <div v-if="testResults[prefix] && testResults[prefix][1]"><Check  class="inline-block w-6 h-6 text-green-500" /></div>
                <div v-else><X class="inline-block w-6 h-6 text-red-500" /></div>
                {{prefix}}
                </li>
            </ul>
            <p class="text-backdrop-500 text-sm pt-4 italic">
                <hr class="border-backdrop-700 my-2"/>
                <div class="flex gap-3">
                    <Wifi class="inline-block w-6 h-6 text-green-500 pr-1"/>Connection successful<br/>
                    <Wifi class="inline-block w-6 h-6 text-red-500 pr-1"/>Connection failed<br/>
                </div>
                <hr class="border-backdrop-700 my-2"/>
                <div class="flex gap-3">
                    <Check class="inline-block w-6 h-6 text-green-500 pr-1"/>Seabass check successful<br/>
                    <X class="inline-block w-6 h-6 text-red-500 pr-1"/>Seabass check failed<br/>
                </div>
                <hr class="border-backdrop-700 mt-2"/>
            </p>
        </div>

        <div class="p-8 bg-backdrop-800 rounded shrink max-w-full md:max-w-[48%]">
            <h2 class= "text-2xl text-backdrop-200 pb-4">Font Settings</h2>
            <hr class="border-backdrop-700 my-2 border-b-2"/>
            <h3 class="text-backdrop-300 pb-2">Sans serif</h3>
            <select v-model="currentSelectedSansFont" class="bg-backdrop-700 text-backdrop-300 rounded p-2">
                <option v-for="font in fontSansOptions" :key="font" :value="font">{{font.name}}</option>
            </select>

            <h3 class="text-backdrop-300 pb-2 pt-4">Serif</h3>
            <select v-model="currentSelectedSerifFont" class="bg-backdrop-700 text-backdrop-300 rounded p-2">
                <option v-for="font in fontSerifOptions" :key="font" :value="font">{{font.name}}</option>
            </select>

            <div class = "flex mt-6">
                <p class = "text-backdrop-300 pr-2">Sans body text</p>
                <Toggle v-model='serifBodyText' :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-0 hover:ring-4'"/>
                <p class = "text-backdrop-300 pl-2">Serif body text</p>
            </div>

            <div class = "flex">
                <p class="text-backdrop-300 pr-2">Sans header text</p>
                <Toggle v-model="serifHeaderText" :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-0 hover:ring-4'"/>
                <p class="text-backdrop-300 pl-2">Serif header text</p>
            </div>

            <div class="flex mb-6">
                <p class="text-backdrop-300 pr-2"></p>
                <Toggle v-model="uppercaseHeader1and2" :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-0 hover:ring-4'"/>
                <p class="text-backdrop-300 pl-2">Uppercase top-level headers</p>
            </div>
            <div class="prose">
            <h5 class="text-backdrop-200 text-3xl" :class="[!serifHeaderText ? currentSelectedSansFont.font : currentSelectedSerifFont.font,uppercaseHeader1and2 ? 'uppercase' : '']">Sample top-level heading</h5>
            <h6 class="text-backdrop-300 text-xl" :class = "!serifHeaderText ? currentSelectedSansFont.font: currentSelectedSerifFont.font">Sample mid-level heading</h6>
            <p class="text-backdrop-300" :class = "!serifBodyText ? currentSelectedSansFont.font : currentSelectedSerifFont.font">This is a sample paragraph. It should be easy to read and not too overwhelming. The fonts should complement each other.<br/><br/><span>The <em>quick brown fox</em> jumped over the <b>lazy dog.</b></span></p>
            </div>
            <hr class="border-backdrop-700 my-2 border-b-2"/>
            <p class="text-backdrop-200 py-2">When you're satisfied with your font settings, choose a site to apply them to, then click Add to Build</p>
            <div class="flex gap-4">
            <select v-model="currentSiteSettings" class="bg-backdrop-700 text-backdrop-300 rounded p-2">
                <option v-for="site in allSites" :key="site" :value="site">{{site}}</option>
            </select>
            <button class="bg-accent-500 text-backdrop-200 rounded p-2 cursor-pointer hover:bg-accent-600 duration-300 transition-all flex gap-2">Add to Build<Blocks class = "text-backdrop-200"/></button>
        </div>
        
        </div>
            

    </div>
    
</template>