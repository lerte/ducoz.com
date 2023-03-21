<template>
  <v-autocomplete
    dense
    chips
    outlined
    clearable
    cache-items
    hide-details
    deletable-chips
    label="收件人列表名称"
    :loading="loading"
    :rules="[rules.required]"
    :items="receivers"
    item-text="ReceiversName"
    return-object
    @focus="getReceivers"
    :value="receiver"
    @change="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'select-receiver',
  props: ['receiver'],
  model: {
    prop: 'receiver'
  },
  data: () => ({
    loading: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    },
    receivers: []
  }),
  methods: {
    async getReceivers() {
      this.loading = true
      const response = await fetch('/api/mail/QueryReceiverByParam', {
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
        this.receivers = data.receiver
      }
      this.loading = false
    }
  }
}
</script>
