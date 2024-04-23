<script setup lang="ts">
const { status, data, signOut, signIn } = useAuth()
const email = ref('')
const displayName = ref('')
const password = ref('')
const confirmPassword = ref('')
const id = ref('')

const anonymizeUser = async (userId) => {
  let baseUrl = 'http://localhost:3720/user/anonymize'
  let method = 'PUT'
  let urlWithId = baseUrl + '/' + userId
  try {
    const response = await fetch(urlWithId, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`Server responded with status code ${response.status}`)
    }

    const responseData = await response.json()

    console.log(responseData)
  } catch (error) {
    console.error('An error occurred:', error.error? error.error : error.message? error.message : error)
  }

}

const register = async () => {
  try {
    const response = await fetch('http://localhost:3720/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        displayName: displayName.value,
        password: password.value
      })
    })

    if (!response.ok) {
      console.error(`Server responded with status code ${response.status}`)
    }

    const responseData = await response.json()

    console.log(responseData)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

</script>

<template>
<div>
        <p :v-model="status">Status: {{ status }}</p>
        <p :v-model="data">Data: {{ data }}</p>
        <nuxt-link v-if="status==='unauthenticated'" @click="signIn">Sign in</nuxt-link>
        <nuxt-link v-if="status==='authenticated'" @click="signOut">Sign out</nuxt-link>
        <hr/>
        <form @submit.prevent="register">
          <input type="text" v-model="email" placeholder="Email" />
          <input type="text" v-model="displayName" placeholder="Display Name" />
          <input type="password" v-model="password" placeholder="Password" />
          <input type="password" v-model="confirmPassword" placeholder="Confirm Password" />
          <button type = "submit">Register</button>
        </form>
        <hr/>
        <form @submit.prevent="anonymizeUser(id)">
          <input type="text" v-model="id" placeholder="ID" />
          <button type = "submit">Anonymize User</button>
        </form>
    </div>
</template>
