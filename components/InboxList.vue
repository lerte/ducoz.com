<template>
  <div>
    <v-data-table
      :items="list"
      :search="search"
      :headers="headers"
      :loading="loading"
      class="elevation-1"
      @click:row="viewEmail"
      :options.sync="options"
      :footer-props="require('@/assets/json/footer-props.json')"
    >
      <template #top>
        <v-toolbar flat dense>
          <v-btn color="secondary" dark class="mr-2" @click="getList">
            <v-icon left> mdi-refresh </v-icon>刷新
          </v-btn>
          <v-spacer />
          <v-text-field
            dense
            chips
            outlined
            clearable
            single-line
            hide-details
            label="搜索"
            v-model="search"
            append-icon="mdi-magnify"
          />
        </v-toolbar>
        <v-divider />
      </template>

      <template #[`item.date`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.date | format }}
            </span>
          </template>
          <span>{{ item.date | localTime }}</span>
        </v-tooltip>
      </template>

      <template #[`item.from`]="{ item }">
        {{ item.from.text }}
      </template>
      <template #[`item.to`]="{ item }">
        {{ item.to.text }}
      </template>
      <template #no-data v-if="!user.config">
        <v-btn color="primary" @click="$emit('config')">配置账号</v-btn>
      </template>
    </v-data-table>
    <v-dialog persistent scrollable max-width="720" v-model="dialog">
      <v-card>
        <v-toolbar dense>
          <span class="headline">预览邮件</span>
          <v-spacer />
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <div v-html="content"></div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'inbox-list',
  data: () => ({
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      {
        text: '日期',
        align: 'start',
        sortable: false,
        value: 'date'
      },
      {
        text: '发件人',
        align: 'start',
        sortable: false,
        value: 'from'
      },
      {
        text: '收件人',
        align: 'start',
        sortable: false,
        value: 'to'
      },
      {
        text: '主题',
        align: 'start',
        sortable: false,
        value: 'subject'
      },
      {
        text: '内容',
        align: 'start',
        sortable: false,
        value: 'text'
      }
    ],
    search: '',
    list: [],
    dialog: false,
    content: ''
  }),
  computed: {
    ...mapState(['user'])
  },
  watch: {
    options: {
      async handler() {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const config = JSON.parse(this.user.config)
      const params = new URLSearchParams({ ...config })
      const response = await fetch(`/api/imap/getEmails?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      this.list = data
      this.loading = false
    },
    viewEmail(item) {
      this.content = item.html
      this.dialog = true
    }
  }
}
</script>
