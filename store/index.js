import { createClient } from 'altogic'

export const state = () => ({
  user: null,
  session: null,
  allSessions: [],
  sessionToken: null,
  ENV_URL: process.env.ENV_URL, // altogic env_url
  CLIENT_KEY: process.env.CLIENT_KEY // altogic client_key
})

export const mutations = {
  setUser(state, user) {
    const altogic = createClient(state.ENV_URL, state.CLIENT_KEY, {
      signInRedirect: '/login'
    })
    state.user = user
    altogic.auth.setSession(user)
  },
  setSession(state, session) {
    const altogic = createClient(state.ENV_URL, state.CLIENT_KEY, {
      signInRedirect: '/login'
    })
    state.session = session
    altogic.auth.setSession(session)
  },
  setSessionToken(state, token) {
    state.sessionToken = token
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { env, req, res }) {
    const { session_token } = parseCookies(req)
    const { ENV_URL, CLIENT_KEY } = env
    const altogic = createClient(ENV_URL, CLIENT_KEY, {
      signInRedirect: '/login'
    })
    const { user } = await altogic.auth.getUserFromDBbyCookie(req, res)
    if (user) {
      commit('setUser', user)
      commit('setSessionToken', session_token)
    }
  }
}

function parseCookies(req) {
  const list = {}
  const rc = req.headers.cookie

  rc &&
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=')
      list[parts.shift().trim()] = decodeURI(parts.join('='))
    })

  return list
}
