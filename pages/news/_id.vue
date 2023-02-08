<template>
  <main
    class="h-[calc(100vh_-_472px)] flex flex-col text-center items-center justify-center bg-gray-100"
  >
    <article>
      <p>{{ news.title }}</p>
      <p>{{ news.content }}</p>
    </article>
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
