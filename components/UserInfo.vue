<template>
  <section class="border p-4 w-full">
    <div class="flex items-center justify-center" v-if="changeMode">
      <input
        @keyup.enter="saveName"
        ref="inputRef"
        type="text"
        v-model="username"
        class="border-none text-3xl text-center"
      />
    </div>
    <div class="space-y-4" v-else>
      <h1 class="text-3xl">您好, {{ user?.name }}</h1>
      <button @click="openChangeMode" class="border p-2">修改名称</button>
    </div>
    <div v-if="errors">
      {{ errors }}
    </div>
  </section>
</template>

<script>
export default {
  name: 'UserInfo',
  data: () => ({
    username: '',
    loading: false,
    changeMode: false,
    errors: null
  }),
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    openChangeMode() {
      this.changeMode = true
      this.username = this.user.name
      setTimeout(() => {
        this.$refs.inputRef.focus()
      }, 100)
    },
    async saveName() {
      this.loading = true
      this.errors = null

      const { data, errors: apiErrors } = await this.$altogic.db
        .model('users')
        .object(this.user._id)
        .update({ name: this.username })

      if (apiErrors) {
        this.errors = apiErrors[0].message
      } else {
        this.username = data.name
        this.$store.commit('setUser', data)
      }

      this.loading = false
      this.changeMode = false
    }
  }
}
</script>
