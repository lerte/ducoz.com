<template>
  <section class="h-screen flex flex-col gap-4 justify-center items-center">
    <div class="text-center" v-if="errors">
      <p
        class="text-red-500 text-3xl"
        :key="index"
        v-for="(error, index) in errors.items"
      >
        {{ error.message }}
      </p>
    </div>
    <div class="text-center" v-else>
      <p class="text-6xl text-white">请稍等...</p>
      <p class="text-3xl text-white">马上跳转到用户资料页</p>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'home',
  middleware: ['guest'],
  head() {
    return {
      title: '页面跳转中...'
    }
  },
  data: () => ({
    errors: null
  }),
  async fetch() {
    const { access_token, action } = this.$route.query
    if (action == 'reset-pwd') {
      // 重设密码
      await this.$router.push({
        name: 'reset-password',
        query: {
          access_token
        }
      })
    } else {
      // email-confirm  magic-link
      const res = await fetch(`/api/verify-user?access_token=${access_token}`)
      const { session, user, errors: apiErrors } = await res.json()
      if (apiErrors) {
        this.errors = apiErrors
        return
      }
      this.$store.commit('setUser', user)
      this.$store.commit('setSession', session)
      await this.$router.push('/user')
    }
  },
  fetchOnServer: false
}
</script>
