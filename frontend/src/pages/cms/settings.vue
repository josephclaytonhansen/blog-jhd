<script setup>
import {onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import {Check, X, Wifi} from 'lucide-vue-next'

const prefixes = ref([])
const protocol = ref("https://")
const testResults = ref([])

const testConnection = async (site) => {
    let connectionSuccessful = false
    let titleCorrect = false

    try {
        let response = await axios.get(`${protocol.value}${site}/seabasstest`)
        connectionSuccessful = true
        let data = response.data
        titleCorrect = data.includes('<title>SEABASS Test</title>')
    } catch (error) {
        if (!error.response) {
            // The request was made but no response was received
            // This is likely due to a network error (like a CORS error)
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
    <div class = "p-8 flex flex-wrap gap-4">
        <div class = "p-8 bg-slate-800 rounded w-auto max-w-full md:max-w-[48%]">
            <h2 class= "text-2xl text-slate-200 pb-4">Current Sites</h2>
            <p class = "text-slate-300 pb-2">
                This SEABASS dashboard is currently connected to the following sites:
            </p>
            <ul class = "text-slate-300">
                <li v-for="prefix in prefixes" :key="prefix" class = "text-slate-300 flex gap-3">
                <div v-if="testResults[prefix] && testResults[prefix][0]"><Wifi class = "inline-block w-6 h-6 text-green-500"/></div>
                <div v-else><Wifi class = "inline-block w-6 h-6 text-red-500"/></div>
                <div v-if="testResults[prefix] && testResults[prefix][1]"><Check  class = "inline-block w-6 h-6 text-green-500" /></div>
                <div v-else><X class = "inline-block w-6 h-6 text-red-500" /></div>
                {{prefix}}
                </li>
            </ul>
            <p class = "text-slate-500 text-sm pt-4">
                SEABASS makes it simple to manage multiple sites from one dashboard. If you want to add or remove a site, you'll need to edit your .env file or contact your administrator if you don't have server access.<br/><br/>
                Note that a connection failure doesn't necessarily mean that the site is offline, just that the SEABASS dashboard can't connect to it. This may be a CORS issue- make sure that the site is configured to allow connections from the SEABASS dashboard URL. 
            </p>
        </div>
        

    </div>
    
</template>