export const index = () => ({
  user: null,
  session: null,
  allSessions: [],
  sessionToken: null
})

// export const mutations = {
//   setUser(state, user) {
//     state.user = user
//     this.altogic.auth.setSession(user)
//   },
//   setSession(state, session) {
//     state.session = session
//     this.altogic.auth.setSession(session)
//   },
//   setSessionToken(state, token) {
//     state.sessionToken = token
//   }
// }

// export const actions = {
//   async nuxtServerInit({ commit }, { req, res }) {
//     const { session_token } = parseCookies(req)
//     const { user } = await this.altogic.auth.getUserFromDBbyCookie(req, res)
//     if (user) {
//       commit('setUser', user)
//       commit('setSessionToken', session_token)
//     }
//   }
// }

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
