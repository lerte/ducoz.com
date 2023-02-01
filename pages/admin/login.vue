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
                v-model="login.username"
                prepend-inner-icon="mdi-cellphone"
                @keyup.enter.native="userLogin"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                outlined
                clearable
                label="密码"
                v-model="login.password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                prepend-inner-icon="mdi-lock"
                @keyup.enter.native="userLogin"
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
                @click.native="userLogin"
                >登录</v-btn
              >
              <v-alert
                class="mt-3"
                :value="Boolean(message)"
                type="info"
                transition="scale-transition"
                v-text="message"
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
  head: () => ({
    title: '登录'
  }),
  data: () => ({
    timestamp: 0,
    message: null,
    loading: false,
    showPassword: false,
    login: {
      username: null,
      password: null
    }
  }),
  computed: {
    disabled() {
      return !this.login.username || !this.login.password
    }
  },
  methods: {
    async userLogin() {
      this.loading = true
      const response = await this.$post('/api/auth/login', {
        mobile: this.login.username,
        userPwd: this.login.password
      })
      if (response.code == 0) {
        this.$notifier.showMessage({
          content: '登录成功',
          color: 'primary'
        })
        this.$store.commit('SET_USER', response.user)
        if (this.$route.query && this.$route.query.to) {
          this.$router.push(this.$route.query.to)
        } else {
          this.$router.push('/')
        }
      } else {
        // 账号或密码错误
        this.$notifier.showMessage({
          content: '账号或密码错误',
          color: 'error'
        })
      }
      this.loading = false
    }
  }
}
</script>
