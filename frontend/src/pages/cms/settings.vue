<script setup>
import {computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Toggle from '@/components/bricks/userInteraction/toggle.vue'

import {Check, X, Wifi, Blocks, HardDriveUpload} from 'lucide-vue-next'

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
        {name: "Oswald", font: 'font-Oswald'},
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

    const currentSelectedAccentColorClass = computed(() => {
        return `bg-${currentSelectedAccentColor.value}-500`
    })

    const currentTheme = ref('dark')

    const serifBodyText = ref(false)
    const serifHeaderText = ref(false)
    const uppercaseHeader1and2 = ref(false)

    const roundAvatars = ref(false)

    const currentSiteSettings = ref('')
    const allSites = process.env.VUE_APP_FRONTEND_PREFIXES

    const buildScript = ref({
        'THEME': 'dark',
        'FONT_SANS': 'Fira Sans',
        'FONT_SERIF': 'Libre Baskerville',
        'ACCENT_COLOR': 'blue',
        'BACKDROP_COLOR': 'slate', 
        'SERIF_BODY_TEXT': false,
        'SERIF_HEADER_TEXT': false,
        'UPPERCASE_HEADERS': false,
        'ROUNDED': 'rounded',
        'ROUND_AVATARS': false,

    })

    const roundedOptions = ref([
        'sharp',
        'subtle',
        'rounded',
    ])

    const currentRounded = ref('rounded')

    watch([currentSelectedSansFont, currentSelectedSerifFont, currentSelectedAccentColor, currentSelectedBackDropColor, currentTheme, serifBodyText, serifHeaderText, uppercaseHeader1and2, currentRounded, roundAvatars], ([newSansFont, newSerifFont, newAccentColor, newBackdropColor, newTheme, newSerifBodyText, newSerifHeaderText, newUppercaseHeader1and2, newRounded, newRoundAvatars]) => {
        buildScript.value = {
            'THEME': newTheme,
            'FONT_SANS': newSansFont.name,
            'FONT_SERIF': newSerifFont.name,
            'ACCENT_COLOR': newAccentColor,
            'BACKDROP_COLOR': newBackdropColor,
            'SERIF_BODY_TEXT': newSerifBodyText,
            'SERIF_HEADER_TEXT': newSerifHeaderText,
            'UPPERCASE_HEADERS': newUppercaseHeader1and2,
            'ROUNDED': newRounded,
            'ROUND_AVATARS': newRoundAvatars.valueOf(),
        }
    })

    const returnBuildScript = computed(() => {
    let script = ''
    for (const [key, value] of Object.entries(buildScript.value)) {
        script += `${key}="${value}" `
    }
    script += `SITE="${currentSiteSettings.value}"`
    return script
})

</script>


<template>

    <div class="absolute z-50 right-2 bottom-2 p-2 gap-2 hidden lg:flex items-end">
        <button class="bg-accent-500 text-text-0 rounded p-2 cursor-pointer hover:bg-accent-600 duration-300 transition-all flex gap-2"><HardDriveUpload class = "text-text-0 shrink"/></button>
        <div class="text-text-0 flex gap-2 items-center"><code class = "text-[.5rem] bg-backdrop-1 p-2 rounded flex items-center gap-2 max-w-[25vw]"><Blocks class = "text-text-3"/>{{returnBuildScript}}

        </code></div>

    </div>

    <div class="p-8 flex flex-wrap gap-4 items-stretch">
        <div class="p-8 bg-backdrop-2 rounded shrink max-w-full lg:max-w-[31%] transition-all duration-300">
            <h2 class= "text-2xl text-text-0 pb-4  ">Current Sites</h2>
            <p class="text-text-1 pb-2">
                <details>
                    <summary>Info</summary>
                    Seabass makes it simple to manage multiple sites from one dashboard. If you want to add or remove a site, you'll need to do so from the Seabass server terminal.<br/><br/> Note that a Seabass failure doesn't necessarily mean that Seabass is offline. This may be a CORS issue- make sure that the site is configured to allow connections from this Seabass dashboard URL. 

                </details>
            </p>
            <ul class="text-text-1">
                <li v-for="prefix in prefixes" :key="prefix" class="text-text-1 flex gap-3">
                <div v-if="testResults[prefix] && testResults[prefix][0]"><Wifi class="inline-block w-6 h-6 text-green-500"/></div>
                <div v-else><Wifi class="inline-block w-6 h-6 text-red-500"/></div>
                <div v-if="testResults[prefix] && testResults[prefix][1]"><Check  class="inline-block w-6 h-6 text-green-500" /></div>
                <div v-else><X class="inline-block w-6 h-6 text-red-500" /></div>
                {{prefix}}
                </li>
            </ul>
            <p class="text-text-3 text-sm pt-4 italic">
                <hr class="border-backdrop-1 my-2"/>
                <div class="flex gap-3">
                    <Wifi class="inline-block w-6 h-6 text-green-500 pr-1"/>Connection successful<br/>
                    <Wifi class="inline-block w-6 h-6 text-red-500 pr-1"/>Connection failed<br/>
                </div>
                <hr class="border-backdrop-1 my-2"/>
                <div class="flex gap-3">
                    <Check class="inline-block w-6 h-6 text-green-500 pr-1"/>Seabass check successful<br/>
                    <X class="inline-block w-6 h-6 text-red-500 pr-1"/>Seabass check failed<br/>
                </div>
                <hr class="border-backdrop-1 mt-2"/>
            </p>
            <h2 class= "text-2xl text-text-0 pb-4 pt-8">Select Site to Design</h2>
            <p class = "text-sm italic text-text-2 pb-2">Defaults do not reflect the current status of the site</p>
            <div class="flex gap-4">
            <select v-model="currentSiteSettings" class="bg-backdrop-1 text-text-1 rounded p-2">
                <option v-for="site in allSites" :key="site" :value="site">{{site}}</option>
            </select>
            
        </div>
        </div>

        <div class="p-8 bg-backdrop-2 rounded shrink max-w-full lg:max-w-[31%]">
            <h2 class= "text-2xl text-text-0 pb-4  ">Font Settings</h2>
            <hr class="border-backdrop-1 my-2 border-b-2"/>
            <h3 class="text-text-1 pb-2">Sans serif</h3>
            <select v-model="currentSelectedSansFont" class="bg-backdrop-1 text-text-1 rounded p-2">
                <option v-for="font in fontSansOptions" :key="font" :value="font">{{font.name}}</option>
            </select>

            <h3 class="text-text-1 pb-2 pt-4">Serif</h3>
            <select v-model="currentSelectedSerifFont" class="bg-backdrop-1 text-text-1 rounded p-2">
                <option v-for="font in fontSerifOptions" :key="font" :value="font">{{font.name}}</option>
            </select>

            <div class = "flex mt-6">
                <p class = "text-text-1 pr-2">Sans body text</p>
                <Toggle v-model='serifBodyText' :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-2 hover:ring-4'"/>
                <p class = "text-text-1 pl-2">Serif body text</p>
            </div>

            <div class = "flex">
                <p class="text-text-1 pr-2">Sans header text</p>
                <Toggle v-model="serifHeaderText" :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-2 hover:ring-4'"/>
                <p class="text-text-1 pl-2">Serif header text</p>
            </div>

            <div class="flex mb-6">
                <p class="text-text-1 pr-2"></p>
                <Toggle v-model="uppercaseHeader1and2" :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-2 hover:ring-4'"/>
                <p class="text-text-1 pl-2">Uppercase top-level headers</p>
            </div>
            <div class="prose">
            <h5 class="text-text-0 text-3xl" :class="[!serifHeaderText ? currentSelectedSansFont.font : currentSelectedSerifFont.font,uppercaseHeader1and2 ? 'uppercase' : '']">Sample top-level heading</h5>
            <h6 class="text-text-1 text-xl" :class = "!serifHeaderText ? currentSelectedSansFont.font: currentSelectedSerifFont.font">Sample mid-level heading</h6>
            <p class="text-text-1" :class = "!serifBodyText ? currentSelectedSansFont.font : currentSelectedSerifFont.font">This is a sample paragraph. It should be easy to read and not too overwhelming. The fonts should complement each other.<br/><br/><span>The <em>quick brown fox</em> jumped over the <b>lazy dog.</b></span></p>
            </div>

        </div>
        <div class="p-8 bg-backdrop-2 rounded grow max-w-full lg:max-w-[31%]">
            <h2 class="text-2xl text-text-0 pb-4  ">Color Settings</h2>
            <hr class="border-backdrop-1 my-2 border-b-2"/>
            <h3 class="text-text-1 pb-2">Accent Color</h3>
            <div class ="flex gap-4">
                <select v-model="currentSelectedAccentColor" class="bg-backdrop-1 text-text-1 rounded p-2">
                <option v-for="color in colorOptions" :key="color" :value="color">{{color}}</option>
            </select>
            <div class="w-8 h-8 rounded" :class="currentSelectedAccentColorClass"></div>
            </div>
            

            <h3 class="text-text-1 pb-2 pt-4">Backdrop Color</h3>
            <div class ="flex gap-4">
            <select v-model="currentSelectedBackDropColor" class="bg-backdrop-1 text-text-1 rounded p-2">
                <option v-for="color in colorOptions" :key="color" :value="color">{{color}}</option>
            </select>
            <div class="w-8 h-8 rounded ring-2 ring-text-1 flex" :class="`bg-${currentSelectedBackDropColor}-800 text-${currentSelectedBackDropColor}-300`"><p class = "text-center m-auto w-min h-min">Abc</p></div>
            <div class="w-8 h-8 rounded ring-2 ring-text-0 flex" :class="`bg-${currentSelectedBackDropColor}-700 text-${currentSelectedBackDropColor}-200`"><p class = "text-center m-auto w-min h-min">Abc</p></div>

            
            </div>
            <p class = "mt-3 text-text-0">Generally, you should use one of the grays (zinc, stone, gray, neutral, slate) for the backdrop color. The backdrop color sets the background colors as well as the text colors (this maintains color harmony between backgrounds and text).</p>

            <h3 class="text-text-1 pb-2 pt-4">Theme</h3>

            <div class="flex mb-6">
                <p class="text-text-1 pr-2">Dark</p>
            <Toggle v-model="currentTheme" :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-2 hover:ring-4'"/>
                <p class="text-text-1 pl-2">Light</p>
            </div>
            <p class="text-text-0 py-2">"Dark" means a dark background with light text. "Light" means a light background with dark text. Note that a user's  browser settings may override this.</p>
            
        </div>

        <div class="p-8 bg-backdrop-2 rounded shrink max-w-full lg:max-w-[31%]">
            <h2 class="text-2xl text-text-0 pb-4  ">Rounded Corners</h2>
            <div class = "flex gap-4">
            <select v-model="currentRounded" class="bg-backdrop-1 text-text-1 rounded p-2">
                <option v-for="rounded in roundedOptions" :key="rounded" :value="rounded">{{rounded}}</option>
            </select>
            

            <div :style="currentRounded === 'sharp' ? 'border-radius:0px' : (currentRounded === 'subtle' ? 'border-radius:7%;' : 'border-radius:25%')" class='w-8 h-8 ring-accent-500 ring-4'></div></div>
            <div class = "flex mt-2 gap-3 items-center">
                <input type = "checkbox" class="checkbox w-6 h-6 rounded" name="roundAvatarsCheckbox" v-model="roundAvatars"/>
                <label for="roundAvatarsCheckbox" class="text-text-1">Circular avatars</label>
            </div>
        </div>

        

        <div class="  p-2 gap-2 flex-wrap flex lg:hidden">
        <button class="bg-accent-500 text-text-0 rounded p-2 cursor-pointer hover:bg-accent-600 duration-300 transition-all flex gap-2"><HardDriveUpload class = "text-text-0"/> Send settings to site</button>
        <div class="text-text-0 flex gap-2 items-center h-min"><code class = "text-sm bg-backdrop-1 p-2 rounded flex items-center gap-2 h-min overflow-hidden">{{returnBuildScript}}

        </code></div>

    </div>
            

    </div>
    
</template>