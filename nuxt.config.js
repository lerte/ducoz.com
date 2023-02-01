export default {
  env: {
    ENV_URL: process.env.ENV_URL,
    CLIENT_KEY: process.env.CLIENT_KEY
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '多泽跨境',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.jpg' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/altogic'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],
  serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['three'],
    babel: {
      compact: true
    }
  },
  // Stopping nuxt.js from rebuilding on changes of irrelevant files
  // (Possibly caused by https://github.com/nuxt-community/tailwindcss-module/issues/359)
  watchers: {
    webpack: {
      ignored: [
        '**/*.{md,log,prettierignore,prettierrc,stylelintignore,npmrc,gitignore',
        '**/.git/**'
      ]
    }
  }
}
