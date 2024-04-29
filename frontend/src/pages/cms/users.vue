<script setup>

    import {pinia} from '../../main.js'
    import {userStore} from "../../userStore.js"

    import { onMounted, ref, computed } from 'vue'

    const loggedInStatus = ref(false)

    const store = userStore(pinia)

    const users = ref([])

    const getUsers = async () => {
        let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch('http://localhost:3720/user', {
            method: 'GET',
            headers: config.headers,
            credentials: 'include',
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get users')
        }
        const data = await response.json()
        return data
    }


    onMounted(async () => {
        store.user ? loggedInStatus.value = true : loggedInStatus.value = false
        if (loggedInStatus.value){

            users.value = await getUsers()
        } else {
            toast.info('Your session has expired. Please log in.')
            router.push('/login')
        }
    })

    import {
        ShieldCheck,
        MessageCircleMore,
        Cog,
        UserX,
        UserCheck,
        UserMinus,
        PenLine,
        Mail,
        MailCheck,
        MailWarning,
    } from 'lucide-vue-next'

    import { useToast } from "vue-toastification"
    const toast = useToast()

    import { useRouter } from 'vue-router'
    const router = useRouter()


    function filterUsers(users, criteria) {
    return users.filter(criteria)
    }

    const admins = computed(() => filterUsers(users.value, user => user.role === 'admin'))
    const regusers = computed(() => filterUsers(users.value, user => user.role !== 'admin' && user.displayName.startsWith('anon') === false))
    const anonymizedUsers = computed(() => filterUsers(users.value, user => user.displayName.startsWith('anon') === true))

    const groups = ref([
        {key: 'Admins', icon: ShieldCheck, users: admins, class: "shrink"},
        {key: 'Users', icon: UserCheck, users: regusers, class: "grow"},
        {key: 'Anonymized Users', icon: UserMinus, users: anonymizedUsers, class: "shrink"},
    ])



</script>

<template>
    <div class = "p-5 text-slate-300 flex gap-4 justify-center w-full flex-wrap">
        <section v-for = "group in groups" :key = "group.key" class = "p-3 my-4 bg-slate-800 rounded-lg" :class="group.class">
            <div class = "flex items-center gap-4 px-2 py-1">
                <component :is="group.icon"/><h2 class = "text-xl">{{group.key}}</h2>
            </div>
            <hr class = " border-slate-700 border-2 mb-3"/>
            <div>
                <div v-for = "user in group.users">
                    <div class = "flex items-center gap-6 flex-wrap">
                        <div class = "flex items-center gap-3 shrink">
                            <PenLine/><h3>{{user.displayName}}</h3>
                        </div>
                        <MailCheck v-if = "user.verifiedEmail"/>
                        <MailWarning v-else/>
                        <div class = "flex items-center gap-3 shrink">
                            <MessageCircleMore/><h3>{{user.comments.length}}</h3>
                        </div>
                        <div class = "flex items-center gap-3 shrink">
                            <MessageCircleMore/><h3>{{user.comments.length}}</h3>
                        </div>
                        <Cog/>
                    </div>
                    
                </div>

            </div>
        </section>
    </div>
    
</template>