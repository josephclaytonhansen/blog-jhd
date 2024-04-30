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
        Clock,
        UserMinus,
        PenLine,
        Eye,
        Mail,
        MailCheck,
        Newspaper,
        MailWarning,
        Trash,
        VenetianMask,
        Router
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

    const isIpUnique = (users) => {
        let ipList = []
        let duplicateIps = []
        users.forEach(user => {
            if (ipList.includes(user.registeredIp)){
                duplicateIps.push(user.registeredIp)
            } else {
                ipList.push(user.registeredIp)
            }
        })
        return duplicateIps
    }

    const duplicateIps = computed(() => isIpUnique(users.value))

    const anonymizeUser = async (id) => {
        let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch('http://localhost:3720/user/anonymize/' + id, {
            method: 'PUT',
            headers: config.headers,
            credentials: 'include',
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not anonymize user')
        }
        await response.json().then(data => {
            toast.success("User anonymized")
        })
        users.value = await getUsers()
    }

    const active_user = ref({})

    const editUser = (id) => {
        active_user.value = users.value.find(user => user._id === id)
        document.getElementById('current-user-edit').scrollIntoView({behavior: "smooth"})
    }

    const updateUser = async (id) => {
        let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch('http://localhost:3720/user/edit/' + id, {
            method: 'PUT',
            headers: config.headers,
            credentials: 'include',
            body: JSON.stringify(active_user.value)
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not update user')
        }
        await response.json().then(data => {
            toast.success("User updated")
        })
        users.value = await getUsers()
    }

    const inviteUserEmail = ref('')
    const emailMessage = ref('')
    const emailSubject = ref('')

    const mailUser = async (email) => {
        let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch('http://localhost:3720/user/mail/' + email, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include',
            body: JSON.stringify({subject: emailSubject.value, message: emailMessage.value, email: email})
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not send email')
        }
        await response.json().then(data => {
            toast.success("Email sent")
        })
    }


</script>

<template>
    <div class = "p-5 text-slate-300 flex gap-4 justify-center w-full flex-wrap">
        <section v-for = "group in groups" :key = "group.key" class = "p-3 my-4 bg-slate-800 rounded-lg" :class="group.class">
            <div class = "flex items-center gap-4 px-2 py-1">
                <component :is="group.icon"/><h2 class = "text-xl">{{group.key}}</h2>
            </div>
            <hr class = " border-slate-700 border-2 mb-3"/>
            <div class = 'flex flex-row justify-between flex-wrap gap-3'>
                <div v-for = "user in group.users">
                    <div class = "flex items-center gap-3">
                        <div class = "flex items-center gap-1 shrink">
                            <h3>{{user.displayName}}</h3>
                        </div>
                        <MailCheck v-if = "user.verifiedEmail" class="text-emerald-500"/>
                        <MailWarning v-else class="text-amber-500"/>

                            <Router :class="duplicateIps.indexOf(user.registeredIp) === -1? 'text-emerald-500':'text-amber-500'"/>

                        <div class = "flex items-center gap-1 shrink">
                            <MessageCircleMore/><h3>{{user.comments.length}}</h3>
                        </div>
                        <div class = "flex items-center gap-1 shrink">
                            <Newspaper/><h3>{{user.posts.length}}</h3>
                        </div>
                        <button class="cursor-pointer bg-cyan-600 px-2 py-2 rounded shadow-slate-900 text-slate-200 hover:bg-cyan-700 hover:scale-105 transition-all duration-300">
                            <Cog @click="editUser(user._id)"/>
                        </button>
                        
                        <button class="cursor-pointer bg-orange-500 px-2 py-2 rounded shadow-slate-900 text-slate-200 hover:bg-orange-600 hover:scale-105 transition-all duration-300">
                            <VenetianMask @click="anonymizeUser(user._id)"/>
                        </button>
                    </div>
                    
                </div>

            </div>
        </section>
    </div>
    <div class = "p-5">
        <div id = "current-user-edit" class = " p-5 text-slate-300 bg-slate-800 rounded-lg">
            <h2 class = "text-xl">Edit User</h2>

                <form class = 'flex flex-row justify-between items-end flex-wrap gap-3' @prevent.submit = "updateUser(active_user._id)">
                    <input type = "text" v-model = "active_user.displayName" class = "bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Display Name"/>
                    <input type = "text" v-model = "active_user.email" class = "bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Email"/>
                    <input type = "text" v-model = "active_user.website" class = "bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Website"/>
                    <div class = "flex flex-col">
                        <label for = "picture">Profile picture</label>
                        <input type="file" name = "picture" class = "bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Profile Picture"/>
                    </div>
                    <input type = "text" v-model = "active_user.shortBio" class = "bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Short Bio"/>
                    <input type = "text" v-model = "active_user.longBio" class = "bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Long Bio"/>
                    <h3 class = "flex gap-4 items-center bg-slate-700  text-slate-300 px-2 py-2 rounded-lg">Role: {{ active_user.role }}</h3>
                    <div class = "flex gap-4 items-center px-2 bg-slate-700 rounded-lg">
                        <Router/>
                        <h3 class = " text-slate-300 px-2 py-2 rounded shadow-slate-900">Registered IP: {{ active_user.registeredIp }}</h3>
                        <h3 class = " text-slate-300 px-2 py-2 rounded shadow-slate-900">Last IP: {{ active_user.lastIp }}</h3>
                    </div>
                    <div class = "flex gap-4 items-center px-2 bg-slate-700 rounded-lg">
                        <Clock/>
                        <h3 class = " text-slate-300 px-2 py-2 rounded shadow-slate-900">Last login: {{ new Date(active_user.lastLogin).toLocaleString() }}</h3>
                        <h3 class = " text-slate-300 px-2 py-2 rounded shadow-slate-900">Last edit: {{ new Date(active_user.lastEdit).toLocaleString() }}</h3>
                    </div>

                </form>

                <h2 class = "text-md mt-4">Comments</h2>
                    <div class = "flex flex-row justify-between items-end flex-wrap gap-3">
                        <div v-for = "comment in active_user.comments">
                            <div class = "flex items-center gap-3">
                                <p>{{comment.content}}</p>
                                <Trash/>
                                <Eye/>
                                <PenLine/>
                            </div>
                        </div>
                    </div>

                <h2 class = "text-md mt-4">Posts</h2>
                    <div class = "flex flex-row justify-between items-end flex-wrap gap-3">
                        <div v-for = "post in active_user.posts">
                            <div class = "flex items-center gap-3">
                                <p>{{post.title}}</p>
                                <Trash/>
                                <Eye/>
                                <PenLine/>
                            </div>
                        </div>
                    </div>

                    <div class = "flex gap-3">
                        <button class="cursor-pointer bg-cyan-600 px-2 py-2 rounded shadow-slate-900 text-slate-200 hover:bg-cyan-700 hover:scale-105 transition-all duration-300 mt-3" @click="updateUser(active_user._id)">
                            Update user
                        </button>                        <button class="cursor-pointer bg-orange-500 px-2 py-2 rounded shadow-slate-900 text-slate-200 hover:bg-orange-600 hover:scale-105 transition-all duration-300 mt-3" @click="anonymizeUser(active_user._id)">
                            <VenetianMask/>
                        </button>
                    </div>
                    

        </div>

        <div class = "flex gap-3 items-start mt-3 w-full">
            <textarea class = "h-[40px] bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900 grow" v-model = "emailMessage" placeholder = "Message"/>
            <input type = "text" v-model = "emailSubject" class = "grow bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Subject"/>
            <input type = "text" v-model = "inviteUserEmail" class = " bg-slate-700 text-slate-300 px-2 py-2 rounded shadow-slate-900" placeholder = "Email"/>
            <button class="cursor-pointer bg-slate-600 px-2 py-2 rounded shadow-slate-900 text-slate-200 hover:bg-slate-700 hover:scale-105 transition-all duration-300" @click="mailUser(inviteUserEmail)">
                <Mail/>
            </button>
        </div>


    </div>
    
    
</template>

<style scoped>
form input, form div{
    flex-grow: 1;
    min-width:20%;
}
</style>