<template>
  <main class="flex flex-col items-center justify-center py-16 h-96 gap-4 px-4">
    <h1 v-if="error.statusCode === 404" class="text-white">页面没找到</h1>
    <h1 v-else class="text-white">服务器出错</h1>
    <NuxtLink to="/" class="text-white font-bold text-lg md:mb-6">
      返回首页
    </NuxtLink>
  </main>
</template>

<script>
export default {
  props: ['error'],
  layout: 'error' // you can set a custom layout for the error page
}
</script>
