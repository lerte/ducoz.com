<template>
  <main class="flex flex-col items-center justify-center h-96 gap-4 px-4">
    <div class="text-white">
      <p>{{ news.title }}</p>
      <p>{{ news.content }}</p>
    </div>
  </main>
</template>

<script>
export default {
  name: 'news',
  async asyncData({ params, $http }) {
    const news = await $http.$get(
      `https://ducoz.c1-asia-se.altogic.com/e:63d940c9a1ac9f2d382d6552/news/${params.id}`
    )
    return {
      news
    }
  }
}
</script>
