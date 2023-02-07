<template>
  <main
    class="h-full py-16 px-4 space-y-4 flex flex-col text-center items-center justify-center"
  >
    <p>更多功能正在开发中...</p>
    <v-btn color="primary" to="/">
      <v-icon left>mdi-home</v-icon>返回首页
    </v-btn>
  </main>
</template>

<script>
export default {
  name: 'index',
  asyncData({ redirect, params }) {
    if (params.name == 'checkmail') {
      redirect(302, '/user/checkmail')
    }
  }
}
</script>
