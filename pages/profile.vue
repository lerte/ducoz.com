<template>
  <main
    class="h-full py-16 px-4 space-y-4 flex flex-col text-center items-center justify-center"
  >
    <Avatar />
    <UserInfo />
    <Sessions />
  </main>
</template>

<script>
export default {
  name: 'Profile',
  middleware: ['auth']
}
</script>
