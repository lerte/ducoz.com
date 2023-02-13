<template>
  <main
    class="h-min-[calc(100vh_-_104px)] flex flex-col text-center items-center justify-center bg-gray-100"
  >
    <div
      class="mt-16 bg-white container h-[calc(100vh_-_104px)] overflow-hidden overflow-y-auto"
    >
      <article
        v-if="!loading && business.length"
        v-html="business[0]?.content"
        class="text-left tiptap-vuetify-editor__content"
      />
      <div v-else class="h-full flex items-center justify-center">
        <Spinner />
      </div>
    </div>
    <NuxtLink
      v-if="business.length"
      :to="`/user/${business[0]?.name}`"
      class="px-4 py-2 font-semibold bg-secondary rounded-sm text-white shadow-sm"
    >
      马上进入
    </NuxtLink>
  </main>
</template>

<script>
export default {
  name: 'business',
  data: () => ({
    loading: true,
    business: []
  }),
  async created() {
    const { params } = this.$route
    const { data, errors } = await this.$altogic.db
      .model('businesses')
      .filter(`name == "${params.name}"`)
      .get()
    if (!errors) {
      this.business = data
    }
    this.loading = false
  }
}
</script>
