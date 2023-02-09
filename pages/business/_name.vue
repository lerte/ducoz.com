<template>
  <main
    class="h-min-[calc(100vh_-_472px)] pb-14 flex flex-col text-center items-center justify-center bg-gray-100"
  >
    <div class="container mt-16">
      <article
        class="text-left tiptap-vuetify-editor__content"
        v-if="business.length"
        v-html="business[0]?.content"
      />
      <NuxtLink
        v-if="business.length"
        :to="`/user/${business[0]?.name}`"
        class="px-4 py-2 font-semibold bg-secondary rounded-sm text-white shadow-sm"
      >
        马上进入
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
table {
  border: 1px solid;
}
</style>

<script>
export default {
  name: 'business',
  async asyncData({ app, params }) {
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
</script>
