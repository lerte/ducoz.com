<script>
export default {
  middleware: ['guest'],
  data() {
    return {
      email: '',
      name: '',
      password: '',
      loading: false,
      errors: null,
      isNeedToVerify: false
    }
  },
  methods: {
    async registerHandler() {
      this.loading = true
      this.errors = null
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          name: this.name
        })
      })
      const { user, session, errors: apiErrors } = await res.json()
      this.loading = false
      if (apiErrors) {
        this.errors = apiErrors
        return
      }
      this.email = ''
      this.password = ''
      this.name = ''

      if (!session) {
        this.isNeedToVerify = true
        return
      }

      this.$store.commit('setUser', user)
      this.$store.commit('setSession', session)
      await this.$router.push('/profile')
    }
  }
}
</script>
<template>
  <section class="flex flex-col items-center justify-center h-96 gap-4 px-2">
    <form
      @submit.prevent="registerHandler"
      class="flex flex-col gap-2 w-full md:w-96"
    >
      <h1 class="self-start text-3xl font-bold text-white">创建账号🎉</h1>

      <div v-if="isNeedToVerify" class="bg-green-500 text-white p-2">
        您的账号已经创建过，请检查您的邮箱，激活账号
      </div>

      <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
        <p v-for="(error, index) in errors.items" :key="index">
          {{ error.message }}
        </p>
      </div>

      <input v-model="email" type="email" placeholder="输入您的邮箱" required />
      <input v-model="name" type="text" placeholder="输入您的名称" required />
      <input
        v-model="password"
        type="password"
        autocomplete="new-password"
        placeholder="输入您的密码"
        required
      />
      <div class="flex justify-between gap-4">
        <NuxtLink class="text-white" to="/login"> 已有账号，点击登录 </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 font-semibold text-sm bg-white rounded-sm text-primary shadow-sm hover:text-secondary"
        >
          注册
        </button>
      </div>
    </form>
  </section>
</template>
