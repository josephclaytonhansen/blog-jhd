import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import axios from 'axios'
import bcrypt from 'bcryptjs'
export default NuxtAuthHandler({
  /* pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  }, */
 // TODO: Build custom auth pages - /auth/signin, /auth/signout, /auth/error, /auth/verify-request, /auth/new-user
 // TODO: Configure .env variables for the secret and the providers
  secret: process.env.AUTH_SECRET || 'my-auth-secret',

  providers: [
    CredentialsProvider.default({
      name: 'Credentials',
      
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials: any) => {
        console.warn('ATTENTION: You should replace this with your real providers or credential provider logic! The current setup is not safe')
        let usersUrl = 'http://localhost:3720/user'
        try {
            const response = await axios.get(usersUrl).then((res) => res).catch((err) => console.error(err))
            let users = response.data
            if (users) {
                let user = users.find((u: any) => u.email === credentials?.username)
                console.log('User:', user)
                if (credentials?.username === user.email) {
                    let passwordMatch = await bcrypt.compare(credentials.password, user.password)
                    console.log('Password match:', passwordMatch)
                    if (!passwordMatch) {
                        console.error('Warning: password match failed')
                        throw new Error('Invalid credentials')
                    } else {
                        let u = {
                            id: user._id,
                            name: user.displayName,
                            username: user.email,
                            shortBio: user.shortBio,
                            picture: user.picture,
                            verifiedEmail: user.verifiedEmail,
                        }
                        return u
                    }
                } else {
                    console.error('Warning: Malicious login attempt registered, bad credentials provided')
                    throw new Error('Invalid credentials')
                }
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }
    })
  ],
  callbacks: {
    jwt: async ({
        token,
        user
    }) => {
        const isSignIn = user ? true : false;
        if (isSignIn) {
            token.id = user ? user.id || '' : '';
            token.shortBio = user ? user.shortBio || '' : '';
            token.picture = user ? user.picture || '' : '';
            token.verifiedEmail = user ? user.verifiedEmail || '' : '';

        }
        return Promise.resolve(token);
    },
    session: async ({
        session,
        token
    }) => {
        (session as any).user.id = token.id;
        (session as any).user.shortBio = token.shortBio;
        (session as any).user.picture = token.picture;
        (session as any).user.verifiedEmail = token.verifiedEmail;

        return Promise.resolve(session)
    },
},
  
})
