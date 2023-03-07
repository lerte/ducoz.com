<template>
  <main>
    <v-btn @click="login"> 授权登录 </v-btn>
  </main>
</template>

<script>
export default {
  layout: 'user',
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      FB.init({
        appId: '518242687131507',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v16.0'
      })
    },
    login() {
      FB.login(function (response) {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ')
          FB.api('/me', function (response) {
            console.log('Good to see you, ' + response.name + '.')
          })
        } else {
          console.log('User cancelled login or did not fully authorize.')
        }
      })
    }
  }
}
</script>
