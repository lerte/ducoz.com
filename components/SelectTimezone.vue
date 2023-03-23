<template>
  <v-autocomplete
    dense
    outlined
    clearable
    hide-details
    cache-items
    label="时区选择"
    :value="timezone"
    :items="timezones"
    @focus="getTimezones"
    :loading="loading"
    :rules="rules"
    @change="$emit('input', $event)"
  >
    <template v-slot:append-item>
      <v-list-item
        v-intersect="onIntersect"
        v-if="page > 0 && page < totalPages"
      >
        <v-list-item-content>
          <v-list-item-title> 加载更多... </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'select-timezone',
  props: ['timezone', 'rules'],
  model: {
    prop: 'timezone'
  },
  data: () => ({
    loading: false,
    timezones: [],
    page: 1,
    totalPages: 5
  }),
  methods: {
    async onIntersect() {
      if (this.page > 0 && this.page < this.totalPages) {
        this.page += 1
        await this.getTimezones()
      }
    },
    async getTimezones() {
      this.loading = true
      const { data, errors } = await this.$altogic.db
        .model('timezones')
        .limit(100)
        .page(this.page)
        .get({ returnCountInfo: true })

      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.timezones = [
          ...this.timezones,
          ...data.data.map((item) => item.timezone)
        ]
        this.totalPages = data.info.totalPages
      }
      this.loading = false
    }
  }
}
</script>
