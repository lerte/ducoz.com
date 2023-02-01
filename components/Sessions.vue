<script>
export default {
  data() {
    return {
      sessions: [],
      token: this.altogic.auth.getSession()?.token
    }
  },
  computed: {
    sessionToken() {
      return this.$store.state.sessionToken
    }
  },
  methods: {
    async logoutSession(session) {
      const { errors } = await altogic.auth.signOut(session.token)
      if (!errors) {
        this.sessions = this.sessions.filter((s) => s.token !== session.token)
      }
    }
  },
  async created() {
    const token =
      this.$store.state.sessionToken ?? altogic.auth.getSession()?.token
    const { sessions } = await altogic.auth.getAllSessions()
    this.sessions = sessions?.map((session) => {
      return {
        ...session,
        isCurrent: session.token === token
      }
    })
  }
}
</script>

<template>
  <div class="border p-4 space-y-4 text-white">
    <p class="text-3xl">所有会话</p>
    <ul class="flex flex-col gap-2">
      <li
        :key="session.token"
        class="flex justify-between gap-12"
        v-for="session in sessions"
      >
        <div>
          <span v-if="session?.isCurrent"> 当前会话 </span>
          <span v-else>
            <strong>设备名称: </strong>
            {{ session?.userAgent?.device?.family }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span>{{
            new Date(session.creationDtm).toLocaleDateString('en-US')
          }}</span>
          <button
            v-if="!session?.isCurrent"
            @click="logoutSession(session)"
            class="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
          >
            X
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
