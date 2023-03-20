<template>
  <v-data-table
    :headers="headers"
    :items="trackList"
    :loading="loading"
    class="elevation-1"
    :options.sync="options"
    :footer-props="require('@/assets/json/footer-props.json')"
  >
    <template #top>
      <v-toolbar flat dense>
        <v-btn color="primary" dark class="mr-2" @click="getList">
          <v-icon left> mdi-refresh </v-icon>刷新
        </v-btn>
        <v-autocomplete
          class="mr-2"
          dense
          chips
          outlined
          clearable
          cache-items
          hide-details
          deletable-chips
          label="发信地址"
          :items="
            accounts.map((account) => ({
              text: `${account.AccountName}`,
              value: `${account.AccountName}`
            }))
          "
          @focus="getAccountNames"
          v-model="searchParams.AccountName"
          append-icon="mdi-card-account-mail"
        />
        <v-autocomplete
          class="mr-2"
          dense
          chips
          outlined
          clearable
          cache-items
          hide-details
          deletable-chips
          label="邮件标签"
          :items="
            tags.map((tag) => ({
              text: `${tag.TagName}`,
              value: `${tag.TagName}`
            }))
          "
          @focus="getTags"
          v-model="searchParams.TagName"
          append-icon="mdi-tag"
        />
        <DatePicker
          class="mr-2"
          label="起始时间"
          v-model="searchParams.StartTime"
          :min="min"
          :max="searchParams.EndTime"
        />
        <DatePicker
          label="结束时间"
          v-model="searchParams.EndTime"
          :max="today"
        />
        <v-spacer />
      </v-toolbar>
      <v-divider />
    </template>
  </v-data-table>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'mail-outbox',
  data: () => ({
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      { text: '创建时间', value: 'CreateTime' },
      { text: '失败数量', value: 'faildCount', sortable: false },
      { text: '请求数量', value: 'requestCount', sortable: false },
      { text: '成功率', value: 'succeededPercent', sortable: false },
      { text: '成功数量', value: 'successCount', sortable: false },
      { text: '无效数量', value: 'unavailableCount', sortable: false },
      { text: '无效率', value: 'unavailablePercent', sortable: false }
    ],
    accounts: [],
    tags: [],
    trackList: [],
    today: dayjs().format('YYYY-MM-DD'),
    searchParams: {
      AccountName: '', // 发信地址；不填，代表所有地址
      TagName: '', // 邮件标签；不填，代表所有标签
      StartTime: dayjs().subtract(6, 'days').format('YYYY-MM-DD'), // 起始时间，时间不能早于30日，格式yyyy-MM-dd
      EndTime: dayjs().format('YYYY-MM-DD') // 结束时间，和起始时间跨度不能超出7天, 格式yyyy-MM-dd
    },
    listItem: {}
  }),
  watch: {
    options: {
      async handler() {
        this.getList()
      },
      deep: true
    },
    searchParams: {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  computed: {
    min() {
      return dayjs(this.searchParams.EndTime)
        .subtract(6, 'days')
        .format('YYYY-MM-DD')
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const params = new URLSearchParams(this.getPureData(this.searchParams))
      const response = await fetch(
        `/api/mail/SenderStatisticsByTagNameAndBatchID?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const { data, Code } = await response.json()
      if (Code) {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      } else {
        this.trackList = data.stat
      }
      this.loading = false
    },
    async getAccountNames() {
      this.loading = true
      const response = await fetch('/api/mail/QueryMailAddressByParam', {
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
        this.accounts = data.mailAddress
      }
      this.loading = false
    },
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
