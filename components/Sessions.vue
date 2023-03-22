<template>
  <div class="border p-4 space-y-4">
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
          <span>{{ session.creationDtm | localTime }}</span>
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

<script>
import { mapState } from 'vuex'

export default {
  name: 'Sessions',
  data: () => ({
    sessions: []
  }),
  computed: {
    ...mapState(['sessionToken'])
  },
  methods: {
    async logoutSession(session) {
      const { errors } = await this.$altogic.auth.signOut(session.token)
      if (!errors) {
        this.sessions = this.sessions.filter((s) => s.token !== session.token)
      }
    }
  },
  async created() {
    const { sessions } = await this.$altogic.auth.getAllSessions()
    this.sessions = sessions?.map((session) => {
      return {
        ...session,
        isCurrent: session.token === this.sessionToken
      }
    })
  }
}
</script>
