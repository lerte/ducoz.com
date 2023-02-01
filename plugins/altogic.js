import Vue from 'vue'
import { createClient } from 'altogic'

const ENV_URL = process.env.ENV_URL
const CLIENT_KEY = process.env.CLIENT_KEY

const altogic = createClient(ENV_URL, CLIENT_KEY, {
  signInRedirect: '/login'
})

Vue.prototype.altogic = altogic
