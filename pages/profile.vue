<script>
import Avatar from '~/components/Avatar'
import Sessions from '~/components/Sessions'
import UserInfo from '~/components/UserInfo'
export default {
  middleware: ['auth'],
  components: {
    Avatar,
    Sessions,
    UserInfo
  }
}
</script>
<template>
  <main
    class="h-full py-16 px-4 space-y-4 flex flex-col text-center items-center justify-center"
  >
    <Avatar />
    <UserInfo />
    <Sessions />
  </main>
</template>
