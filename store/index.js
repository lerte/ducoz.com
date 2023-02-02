export const state = () => ({
  user: null,
  session: null,
  allSessions: [],
  sessionToken: null,
  searchText: '', // 搜索关键字
  searchItem: '', // 搜索的类目
  searchItems: [], // 选择搜索的类目
  searching: false // 正则搜索
})

export const mutations = {
  setUser(state, user) {
    state.user = user
    this.$altogic.auth.setSession(user)
  },
  setSession(state, session) {
    state.session = session
    this.$altogic.auth.setSession(session)
  },
  setSessionToken(state, token) {
    state.sessionToken = token
  },
  SET_USER(state, payload) {
    state.user = payload
  },
  SET_SEARCHING(state, payload) {
    state.searching = payload
  },
  SET_SEARCH_TEXT(state, payload) {
    state.searchText = payload
  },
  SET_SEARCH_ITEM(state, payload) {
    state.searchItem = payload
    state.searchText = ''
  },
  SET_SEARCH_ITEMS(state, payload) {
    state.searchItems = payload
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req, res }) {
    const { session_token } = parseCookies(req)
    const { user } = await this.$altogic.auth.getUserFromDBbyCookie(req, res)
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
