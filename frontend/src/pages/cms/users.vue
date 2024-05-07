<script setup>

    import {pinia} from '../../main.js'
    import {userStore} from "../../userStore.js"

    import { onMounted, ref, computed } from 'vue'

    import Avatar from '../../components/bricks/images/avatar.vue'

    const loggedInStatus = ref(false)

    const store = userStore(pinia)

    const users = ref([])
    const posts = ref([])

    const getUsers = async () => {
        let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/user`, {
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
    let temp
    if (localStorage.getItem('users')) {
      users.value = JSON.parse(localStorage.getItem('users'))
    } if (localStorage.getItem('posts')) {
      posts.value = JSON.parse(localStorage.getItem('posts'))
    }
    temp = await getUsers()
    temp2 = await getPosts()

    if (!users.value || JSON.stringify(users.value) !== JSON.stringify(temp)) {
      users.value = temp
      localStorage.setItem('users', JSON.stringify(users.value))
    } if (!posts.value || JSON.stringify(posts.value) !== JSON.stringify(temp2)) {
      posts.value = temp2
      localStorage.setItem('posts', JSON.stringify(posts.value))
    }
  } else {
    toast.info('Your session has expired. Please log in.')
    router.push('/login')
  }
})

    import {
        ShieldCheck,
        Save,
        ShieldMinus,
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
        BookUser,
        BookX,
        MailWarning,
        Trash,
        VenetianMask,
        Router,
        Flag
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
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/user/anonymize/` + id, {
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
         if (active_user.value._id !== id) {
        active_user.value = users.value.find(user => user._id === id)
        inviteUserEmail.value = active_user.value.email
        document.getElementById('current-user-edit').scrollIntoView({behavior: "smooth"})}
        else {
            active_user.value = {}
        }
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
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/user/edit/` + id, {
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

    const promoteUser = async (id) => {
        active_user.value.role = 'admin'
        updateUser(id)
    }

    const demoteUser = async (id) => {
        active_user.value.role = 'user'
        updateUser(id)
    }

    const promoteUserToAuthor = async (id) => {
        active_user.value.role = 'author'
        updateUser(id)
    }

    const demoteUserToVerified = async (id) => {
        active_user.value.role = 'user'
        updateUser(id)
    }

    const deselectUser = (id) => {
        active_user.value = {}
        inviteUserEmail.value = ''
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
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}user/mail/` + email, {
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

    const filterFlaggedComments = (user) => {
        return user.comments.filter(comment => comment.flagged === true)
    }

    const getPosts = async () => {
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/blog/`)
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get posts')
        }
        const data = await response.json()
        localStorage.setItem('posts', JSON.stringify(data))
        return data
    }

    const getUserPostsLength = () => {
        let posts = JSON.parse(localStorage.getItem('posts'))
        return posts.filter(post => post.author === active_user.value._id).length
    }


</script>

<template>
    
    <div class="p-5 text-text-1 flex gap-4 justify-center w-full flex-wrap">
        <div class="flex gap-3 items-start mt-3 w-full">
            <textarea class="accent-accent-500 h-[40px] bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900 grow" v-model = "emailMessage" placeholder = "Message"></textarea>
            <input type = "text" v-model = "emailSubject" class="accent-accent-500 grow bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Subject"/>
            <input type = "text" v-model = "inviteUserEmail" class="accent-accent-500 bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Email"/>
            <button class="cursor-pointer bg-backdrop-0 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-backdrop-1 hover:scale-105 transition-all duration-300" @click="mailUser(inviteUserEmail)">
                <Mail/>
            </button>
        </div>
        <section v-for = "group in groups" :key = "group.key" class="p-3 my-4 bg-backdrop-2 rounded-lg" :class="group.class">
            <div class="flex items-center gap-4 px-2 py-1">
                <component :is="group.icon"/><h2 class="text-xl  ">{{group.key}}</h2>
            </div>
            <hr class=" border-backdrop-1 border-2 mb-3"/>
            <div class = 'flex flex-row justify-between flex-wrap gap-3'>
                <div v-for = "user in group.users">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-1 shrink">
                            <router-link class=" hover:text-accent-500 transition-all duration-300" :to = "`/profile/${user.displayName.replace(/ /g, '-')}`"><Avatar :image="user.picture" classes="ring-2 mr-2 ring-accent-500 hover:cursor-pointer hover:ring-accent-300 hover:ring-4 transition-all duration-300 avatar w-12 h-12" alt="avatar"/></router-link>
                            <router-link class=" hover:text-accent-500 transition-all duration-300" :to = "`/profile/${user.displayName.replace(/ /g, '-')}`"><h3>{{user.displayName}}</h3></router-link>
                        </div>
                        <MailCheck v-if = "user.verifiedEmail || user.role === 'user'" class="text-emerald-500"/>
                        <MailWarning v-else-if = "!user.displayName.startsWith('anon')" class="text-amber-500"/>

                            <Router :class="duplicateIps.indexOf(user.registeredIp) === -1? 'text-emerald-500':'text-amber-500'"/>

                        <div class="flex items-center gap-1 shrink">
                            <MessageCircleMore/><h3>{{user.comments.length}}</h3>
                        </div>
                        <div class="flex items-center gap-1 shrink">
                            <Flag :class="filterFlaggedComments(user).length > 0 ? 'text-red-500' : ''"/><h3>{{filterFlaggedComments(user).length}}</h3>
                        </div>
                        <div class="flex items-center gap-1 shrink" v-if = "user.role == 'admin' || user.role == 'author'">
                            <Newspaper /><h3>{{getUserPostsLength}}</h3>
                        </div>
                        <button class="cursor-pointer bg-accent-600 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300">
                            <Cog @click="editUser(user._id)"/>
                        </button>
        
                    </div>
                    
                </div>

            </div>
        </section>
    </div>
    <div class="p-5">
        <div id = "current-user-edit" class=" p-5 text-text-1 bg-backdrop-2 rounded-lg transition-all duration-300" :class="active_user._id ? 'opacity-100' : 'opacity-0'">
            <h2 class="text-xl mb-2  ">Edit User</h2>

                <form class = 'flex flex-row justify-between items-end flex-wrap gap-3' @prevent.submit = "updateUser(active_user._id)">
                    <input type = "text" v-model = "active_user.displayName" class="accent-accent-500 bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Display Name"/>
                    <input type = "text" v-model = "active_user.email" class="accent-accent-500 bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Email"/>
                    <input type = "text" v-model = "active_user.website" class="accent-accent-500 bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Website"/>
                    <input type = "text" v-model = "active_user.picture" class="accent-accent-500 bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Avatar"/>
                    <input type = "text" v-model = "active_user.shortBio" class="accent-accent-500 bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Short Bio"/>
                    <input type = "text" v-model = "active_user.longBio" class="accent-accent-500 bg-backdrop-1 text-text-1 px-2 py-2 rounded shadow-backdrop-900" placeholder = "Long Bio"/>
                    <h3 class="flex gap-4 items-center bg-backdrop-1  text-text-1 px-2 py-2 rounded-lg">Role: {{ active_user.role }}</h3>
                    <div class="flex gap-4 items-center px-2 bg-backdrop-1 rounded-lg">
                        <Router/>
                        <h3 class=" text-text-1 px-2 py-2 rounded shadow-backdrop-900">Registered IP: {{ active_user.registeredIp }}</h3>
                        <h3 class=" text-text-1 px-2 py-2 rounded shadow-backdrop-900">Last IP: {{ active_user.lastIp }}</h3>
                    </div>
                    <div class="flex gap-4 items-center px-2 bg-backdrop-1 rounded-lg">
                        <Clock/>
                        <h3 class=" text-text-1 px-2 py-2 rounded shadow-backdrop-900">Last login: {{ new Date(active_user.lastLogin).toLocaleString() }}</h3>
                        <h3 class=" text-text-1 px-2 py-2 rounded shadow-backdrop-900">Last edit: {{ new Date(active_user.lastEdit).toLocaleString() }}</h3>
                    </div>

                </form>

                <h2 class="text-md mt-4  ">Comments</h2>
                    <div class="flex flex-row justify-between items-end flex-wrap gap-3">
                        <div v-for = "comment in active_user.comments">
                            <div class="flex items-center gap-3">
                                <p>{{comment.content}}</p>
                                <Trash/>
                                <Eye/>
                                <PenLine/>
                            </div>
                        </div>
                    </div>

                <h2 class="text-md mt-4  ">Posts</h2>
                    <div class="flex flex-row justify-between items-end flex-wrap gap-3">
                        <div v-for = "post in active_user.posts">
                            <div class="flex items-center gap-3">
                                <p>{{post.title}}</p>
                                <Trash/>
                                <Eye/>
                                <PenLine/>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button class="cursor-pointer bg-accent-600 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 mt-3" @click="updateUser(active_user._id)">
                            <Save/>
                        </button>
                        <button v-if = "active_user.role === 'user' && active_user.role !== 'admin'" class="cursor-pointer bg-green-500 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-green-600 hover:scale-105 transition-all duration-300 mt-3" @click="promoteUserToAuthor(active_user._id)">
                            <BookUser/>
                        </button>
                        <button v-else-if = "active_user.role === 'author'" class="cursor-pointer bg-red-500 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-red-600 hover:scale-105 transition-all duration-300 mt-3" @click="demoteUserToVerified(active_user._id)">
                            <BookX/>
                        </button>
                        
                        <button v-if = "active_user.role === 'admin'" class="cursor-pointer bg-red-500 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-red-600 hover:scale-105 transition-all duration-300 mt-3" @click="demoteUser(active_user._id)">
                            <ShieldMinus/>
                        </button>
                        <button v-else-if ="active_user.role === 'author'" class="cursor-pointer bg-green-500 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-green-600 hover:scale-105 transition-all duration-300 mt-3" @click="promoteUser(active_user._id)">
                            <ShieldCheck/>
                        </button>
                        <div class="w-[1px] h-[40px] mt-[12px] mx-1 border-r-2 border-backdrop-1"></div>
                        
                        <button v-if = "active_user.role !== 'admin'" class="cursor-pointer bg-orange-500 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-orange-600 hover:scale-105 transition-all duration-300 mt-3" @click="anonymizeUser(active_user._id)">
                        <VenetianMask/>
                        </button>
                        <div class="w-[1px] h-[40px] mt-[12px] mx-1 border-r-2 border-backdrop-1"  v-if = "active_user.role !== 'admin'"></div>
                        <button class="cursor-pointer bg-accent-600 px-2 py-2 rounded shadow-backdrop-900 text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 mt-3" @click="deselectUser(active_user._id)">
                            <UserX/>
                        </button>
                        
                        
                    </div>
                    

        </div>

        


    </div>
    
    
</template>

<style scoped>
form input, form div{
    flex-grow: 1;
    min-width:20%;
}
</style>