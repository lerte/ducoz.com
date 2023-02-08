<template>
  <main
    class="h-[calc(100vh_-_472px)] flex flex-col text-center items-center justify-center bg-gray-100"
  >
    <article v-if="business.length" v-html="business[0].content"></article>
    <article v-else>暂无内容！</article>
  </main>
</template>

<script>
export default {
  name: 'business',
  async asyncData({ app, redirect, params }) {
    if (params.name == 'checkmail') {
      redirect(302, '/user/checkmail')
    } else {
      const { data, errors } = await app.$altogic.db
        .model('businesses')
        .filter(`name == "${params.name}"`)
        .get()
      if (!errors) {
        return { business: data }
      } else {
        return { business: [] }
      }
    }
  }
}
</script>
