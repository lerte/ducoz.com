<template>
  <v-autocomplete
    dense
    chips
    outlined
    clearable
    cache-items
    hide-details
    deletable-chips
    label="标签"
    :loading="loading"
    :items="tags"
    item-text="TagName"
    item-value="TagName"
    @focus="getTags"
    :value="tag"
    @change="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'select-tag',
  props: ['tag'],
  model: {
    prop: 'tag'
  },
  data: () => ({
    loading: false,
    tags: []
  }),
  methods: {
    async getTags() {
      this.loading = true
      const response = await fetch('/api/mail/QueryTagByParam', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { data, Code } = await response.json()
      if (Code) {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      } else {
        this.tags = data.tag
      }
      this.loading = false
    }
  }
}
</script>
