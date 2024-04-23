import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

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
      authorize (credentials: any) {
        console.warn('ATTENTION: You should replace this with your real providers or credential provider logic! The current setup is not safe')
// TODO: Connect this to MongoDB through blogapi.josephhansen.dev - first check if the user exists, then check if the password is correct.
// TODO: Remove testUser

        const testUser = { 
          _id: '1',
          email: 'test@email.com',
          displayName: 'Test User',
          password: 'password',
          picture: 'https://www.gravatar.com/avatar/',
          shortBio: 'This is a test user',
          longBio: 'This is a test user',
          role: 'unverified-user',
          displayEmail: 'test@email.com',
          website: 'https://example.com',
        }

        let user = testUser

        if (credentials?.username === user.email && credentials?.password === user.password) {
          let u = {
            id: user._id,
            name: user.displayName,
            username: user.email,
            role: user.role,
            shortBio: user.shortBio,
            picture: user.picture,
          }
          return u
        } else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')

          throw new Error('Invalid credentials')

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
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
            token.role = user ? user.role || '' : '';
            token.shortBio = user ? user.shortBio || '' : '';
            //shortBio is saved in the token so it can be accessed without a database query
            token.picture = user ? user.picture || '' : '';

        }
        return Promise.resolve(token);
    },
    session: async ({
        session,
        token
    }) => {
        (session as any).user.id = token.id;
        (session as any).user.role = token.role;
        (session as any).user.shortBio = token.shortBio;
        (session as any).user.picture = token.picture;

        return Promise.resolve(session)
    },
},
  
})
