<template>
  <main>
    <v-btn @click="login" v-if="facebookSdkReady" color="primary" dark>
      授权登录
    </v-btn>
    <span>
      {{ info }}
    </span>
  </main>
</template>

<script>
export default {
  layout: 'admin',
  name: 'meta-smart-service',
  head() {
    return {
      script: [
        {
          src: 'https://connect.facebook.net/en_US/sdk.js'
        }
      ]
    }
  },
  data: () => ({
    facebookSdkReady: false,
    info: ''
  }),
  mounted() {
    this.init()
  },
  methods: {
    init() {
      window.fbAsyncInit = () => {
        FB.init({
          appId: '518242687131507',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v16.0'
        })
        FB.AppEvents.logPageView()
        this.facebookSdkReady = true
      }
    },
    login() {
      FB.login((response) => {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ')
          FB.api('/me', (response) => {
            this.info = '欢迎你: ' + response.name
          })
        } else {
          console.log('User cancelled login or did not fully authorize.')
        }
      })
    }
  }
}
</script>
