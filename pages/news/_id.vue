<template>
  <main
    class="h-[calc(100vh_-_472px)] flex flex-col text-center items-center justify-center bg-gray-100"
  >
    <div v-if="loading" class="h-full flex items-center justify-center">
      <Spinner />
    </div>
    <article v-else>
      <p>{{ news.title }}</p>
      <p>{{ news.content }}</p>
    </article>
  </main>
</template>

<script>
export default {
  name: 'news-detail',
  data: () => ({
    loading: true,
    news: {}
  }),
  async created() {
    const { params } = this.$route
    const { data, errors } = await this.$altogic.db
      .model('news')
      .object(params.id)
      .get()
    if (!errors) {
      this.news = data
    }
    this.loading = false
  }
}
</script>
