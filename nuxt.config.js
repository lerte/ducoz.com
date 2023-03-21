import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    ENV_URL: process.env.ENV_URL,
    CLIENT_KEY: process.env.CLIENT_KEY
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '多泽跨境',
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: {
    color: '#102B6A', // 主色调
    height: '4px'
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/base',
    '@/plugins/notifier',
    '@/plugins/altogic',
    { src: '~/plugins/TiptapVuetify', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    defaultAssets: {
      icons: false
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://http.nuxtjs.org/
    '@nuxt/http',
    'nuxt-clipboard'
  ],
  // serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['three', 'vuetify/lib', 'tiptap-vuetify'],
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
