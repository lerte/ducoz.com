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
  name: 'news-detail',
  async asyncData({ app, params }) {
    const { data, errors } = await app.$altogic.db
      .model('news')
      .object(params.id)
      .get()
    if (!errors) {
      return { news: data }
    } else {
      return { news: {} }
    }
  }
}
</script>
