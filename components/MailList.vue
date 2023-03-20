<template>
  <div>
    <v-data-table
      show-select
      :items="list"
      item-key="_id"
      :headers="headers"
      :loading="loading"
      v-model="selected"
      class="elevation-1"
      :options.sync="options"
      :server-items-length="totalCount"
      :footer-props="require('@/assets/json/footer-props.json')"
    >
      <template #top>
        <v-toolbar flat dense>
          <v-btn color="primary" dark class="mr-2" @click="getList">
            <v-icon left> mdi-refresh </v-icon>刷新
          </v-btn>
          <v-dialog
            persistent
            scrollable
            max-width="720"
            v-model="addDialog"
            v-if="selected.length"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                dark
                v-on="on"
                v-bind="attrs"
                color="warning"
                @click="addToReceiver"
              >
                <v-icon left> mdi-plus </v-icon>添加到收件人列表
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dense>
                <span class="headline">添加到收件人列表</span>
                <v-spacer />
                <v-icon @click="closeAdd">mdi-close</v-icon>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          dense
                          chips
                          outlined
                          multiple
                          clearable
                          hide-details
                          deletable-chips
                          label="收件人"
                          v-model="listItem.email"
                          :items="listItem.emails"
                          item-text="email"
                          return-object
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          dense
                          chips
                          outlined
                          clearable
                          cache-items
                          hide-details
                          deletable-chips
                          label="收件人列表"
                          :rules="[rules.required]"
                          :items="
                            receivers.map((receiver) => ({
                              text: `${receiver.ReceiversName}-${receiver.ReceiversAlias}-${receiver.Count}`,
                              value: receiver.ReceiverId
                            }))
                          "
                          @focus="getReceivers"
                          v-model="listItem.receiver"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="warning"
                  :disabled="!valid"
                  @click="addToReceiverConfirm"
                >
                  <v-icon left>mdi-plus</v-icon>
                  提交
                </v-btn>
                <v-btn color="secondary" @click="closeAdd">
                  <v-icon left>mdi-close</v-icon>
                  取消
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider />
      </template>

      <template #[`item.createdAt`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.createdAt | format }}
            </span>
          </template>
          <span>{{ item.createdAt | localTime }}</span>
        </v-tooltip>
      </template>
      <template #[`item.updatedAt`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.updatedAt | format }}
            </span>
          </template>
          <span>{{ item.updatedAt | localTime }}</span>
        </v-tooltip>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          fab
          x-small
          class="mr-2"
          min-width="0"
          color="success"
          @click.stop="sendMail(item)"
        >
          <v-icon small> mdi-send </v-icon>
        </v-btn>
        <v-btn
          fab
          x-small
          class="mr-2"
          min-width="0"
          color="primary"
          @click.stop="editItem(item)"
        >
          <v-icon small> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          fab
          x-small
          min-width="0"
          color="error"
          @click.stop="deleteItem(item)"
        >
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <SendMailDialog v-model="sendDialog" :user="listItem" />
  </div>
</template>

<script>
export default {
  name: 'mail-list',
  data: () => ({
    loading: false,
    totalCount: 0,
    selected: [],
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      {
        text: '邮箱',
        align: 'start',
        sortable: false,
        value: 'email'
      },
      {
        text: '名字',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      {
        text: '标签',
        align: 'start',
        sortable: false,
        value: 'tags'
      },
      {
        text: '创建时间',
        value: 'createdAt',
        sortable: false
      },
      {
        text: '更新时间',
        value: 'updatedAt',
        sortable: false
      },
      { text: '操作', value: 'actions', sortable: false }
    ],
    list: [],
    receivers: [],
    valid: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    },
    listItem: {},
    addDialog: false,
    sendDialog: false
  }),
  watch: {
    options: {
      async handler() {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    addToReceiver() {
      this.listItem.email = Object.assign([], this.selected)
      this.listItem.emails = Object.assign([], this.selected)
      this.addDialog = true
    },
    closeAdd() {
      this.addDialog = false
    },
    editItem() {
      this.developTips()
    },
    deleteItem() {
      this.developTips()
    },
    async getList() {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const { data, errors } = await this.$altogic.db
        .model('mails')
        .sort('updatedAt', 'desc')
        .limit(itemsPerPage)
        .page(page)
        .get({ returnCountInfo: true })

      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.list = data.data
        this.totalCount = data.info.count
      }
      this.loading = false
    },
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
    },
    async addToReceiverConfirm() {
      const { email, receiver } = this.listItem
      this.loading = true
      const params = new URLSearchParams({
        ReceiverId: receiver,
        Detail: JSON.stringify(
          email.map((item) => ({
            b: item.birthday,
            e: item.email,
            g: item.gender,
            m: item.mobile,
            n: item.nickname,
            u: item.name
          }))
        )
      })
      const response = await fetch(`/api/mail/SaveReceiverDetail?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { Code, ErrorCount, SuccessCount } = await response.json()
      if (Code) {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          content: `成功添加${SuccessCount},失败${ErrorCount}`,
          color: 'success'
        })
        this.addDialog = false
      }
      this.loading = false
    },
    sendMail(item) {
      this.listItem = Object.assign({}, item)
      this.sendDialog = true
    }
  }
}
</script>
