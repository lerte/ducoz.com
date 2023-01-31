export const state = () => ({
  locales: ['en', 'zh-CN'],
  locale: 'en'
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  }
}
