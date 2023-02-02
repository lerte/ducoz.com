<template>
  <v-main>
    <v-container fill-height>
      <v-layout align-center justify-center wrap class="login-wrapper">
        <v-flex xs12 hidden-sm-and-down md6 xl4 elevation-5>
          <v-img
            class="grey lighten-2"
            height="450"
            @click="timestamp = Date.now()"
            :src="`https://picsum.photos/800/600?t=${timestamp}`"
          >
            <v-layout
              slot="placeholder"
              fill-height
              align-center
              justify-center
              ma-0
            >
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-layout>
          </v-img>
        </v-flex>
        <v-flex xs12 sm12 md6 xl4 elevation-5>
          <v-layout align-content-center justify-center wrap pa-5 fill-height>
            <v-flex xs12>
              <v-text-field
                outlined
                clearable
                label="手机号"
                v-model="phone"
                prepend-inner-icon="mdi-cellphone"
                @keyup.enter.native="userLogin"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                outlined
                clearable
                label="密码"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                prepend-inner-icon="mdi-lock"
                @keyup.enter.native="loginHandler"
                @click:append="showPassword = !showPassword"
              />
            </v-flex>
            <v-flex xs12>
              <v-btn
                :loading="loading"
                :disabled="disabled"
                large
                block
                color="primary"
                @click.native="loginHandler"
                >登录
              </v-btn>
              <v-alert
                class="mt-3"
                :value="Boolean(errors)"
                type="info"
                transition="scale-transition"
                v-text="errors"
              />
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<style lang="scss">
#login-page {
  background: #eee;
}
.login-wrapper {
  > .flex {
    height: 450px;
    background: #fff;
  }
}
</style>

<script>
export default {
  name: 'login',
  layout: 'login',
  middleware: ['guest'],
  head: () => ({
    title: '多泽跨境 | 后台登录'
  }),
  data: () => ({
    timestamp: 0,
    errors: null,
    loading: false,
    showPassword: false,
    phone: null,
    password: null
  }),
  computed: {
    disabled() {
      return !this.phone || !this.password
    }
  },
  methods: {
    async loginHandler() {
      this.loading = true
      this.errors = null
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: this.phone,
          password: this.password
        })
      })
      const { user, session, errors: apiErrors } = await response.json()
      this.loading = false
      if (apiErrors) {
        this.errors = apiErrors
      } else {
        this.$store.commit('setUser', user)
        this.$store.commit('setSession', session)
        await this.$router.push('/admin')
      }
    }
  }
}
</script>
