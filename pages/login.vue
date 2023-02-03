<template>
  <main class="flex flex-col items-center justify-center py-16 h-96 gap-4 px-4">
    <form
      @submit.prevent="loginHandler"
      class="flex flex-col gap-2 w-full md:w-96"
    >
      <h1 class="self-start text-3xl font-bold text-white">登录到您的账号</h1>

      <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
        <p v-for="(error, index) in errors.items" :key="index">
          {{ error.message }}
        </p>
      </div>

      <input v-model="email" type="email" placeholder="输入您的邮箱" required />
      <input
        v-model="password"
        type="password"
        placeholder="输入您的密码"
        required
      />
      <div class="flex items-start justify-between pt-4">
        <NuxtLink class="text-white" to="/register">
          还没有账号？立即注册
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 font-semibold text-sm bg-white rounded-sm text-primary shadow-sm hover:text-secondary"
        >
          登录
        </button>
      </div>
    </form>
  </main>
</template>

<script>
export default {
  name: 'login',
  middleware: ['guest'],
  data: () => ({
    email: '',
    name: '',
    password: '',
    loading: false,
    errors: null
  }),
  methods: {
    async loginHandler() {
      this.loading = true
      this.errors = null
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      })
      const { user, session, errors: apiErrors } = await res.json()
      this.loading = false
      if (apiErrors) {
        this.errors = apiErrors
      } else {
        this.$store.commit('setUser', user)
        this.$store.commit('setSession', session)
        await this.$router.push('/user/profile')
      }
    }
  }
}
</script>
