<script setup>
import {onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Toggle from '@/components/bricks/userInteraction/toggle.vue'

import {Check, X, Wifi} from 'lucide-vue-next'

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
</script>


<template>
    <div class="p-8 flex flex-wrap gap-4">
        <div class="p-8 bg-backdrop-800 rounded shrink max-w-full md:max-w-[48%]">
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
            <Toggle :width="8" :ringClass="'ring-accent-600 hover:ring-accent-500 ring-0 hover:ring-4'"/>
        </div>
            

    </div>
    
</template>