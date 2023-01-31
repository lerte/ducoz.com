import { createClient } from 'altogic'

const ENV_URL = 'https://ducoz.c1-asia-se.altogic.com' // replace with your envUrl
const CLIENT_KEY = 'fd5fea6285694ea294a770d11e22d26d' // replace with your clientKey

const altogic = createClient(ENV_URL, CLIENT_KEY, {
  signInRedirect: '/login'
})

export default altogic
