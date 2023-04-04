<template>
  <v-data-table
    :headers="headers"
    :items="accounts"
    :search="search"
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
        <v-btn dark class="mr-2" color="secondary" @click="addItem">
          <v-icon left> mdi-plus </v-icon>添加发信地址
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
        <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
          <v-card>
            <v-toolbar dense>
              <span class="headline"> {{ formTitle }} </span>
              <v-spacer />
              <v-icon @click="close">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      chips
                      outlined
                      clearable
                      single-line
                      hide-details
                      label="发信地址"
                      v-model="editedItem.AccountName"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      label="发信类型"
                      dense
                      chips
                      outlined
                      clearable
                      hide-details
                      :items="sendtypeOptions"
                      v-model="editedItem.Sendtype"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      chips
                      outlined
                      clearable
                      single-line
                      hide-details
                      label="回信地址"
                      v-model="editedItem.ReplyAddress"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn color="secondary" @click="close"> 取消 </v-btn>
              <v-btn color="primary" @click="save">确定</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-divider />
    </template>

    <template #[`item.ReplyAddress`]="{ item }">
      <v-chip
        small
        label
        v-if="item.ReplyAddress"
        :color="item.ReplyStatus ? 'error' : 'warning'"
      >
        {{ `${item.ReplyAddress}(${item.ReplyStatus ? '未通过' : '通过'})` }}
      </v-chip>
    </template>

    <template #[`item.Sendtype`]="{ item }">
      <v-chip
        small
        label
        :color="item.Sendtype == 'batch' ? 'primary' : 'secondary'"
      >
        {{ sendtypeMap[item.Sendtype] }}
      </v-chip>
    </template>

    <template #[`item.AccountStatus`]="{ item }">
      <v-chip small label :color="item.AccountStatus ? 'error' : 'success'">
        {{ item.AccountStatus ? '冻结' : '正常' }}
      </v-chip>
    </template>

    <template #[`item.DomainStatus`]="{ item }">
      <v-chip small label :color="item.DomainStatus ? 'error' : 'success'">
        {{ item.DomainStatus ? '异常' : '正常' }}
      </v-chip>
    </template>

    <template #[`item.CreateTime`]="{ item }">
      <v-tooltip right>
        <template #activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs">
            {{ item.CreateTime | format }}
          </span>
        </template>
        <span>{{ item.CreateTime | localTime }}</span>
      </v-tooltip>
    </template>

    <template #[`item.actions`]="{ item }">
      <v-chip
        small
        color="warning"
        v-if="item.ReplyStatus == 1"
        @click="CheckReplyToMailAddress(item)"
      >
        验证回信地址
      </v-chip>
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

      <v-dialog v-model="dialogDelete" width="auto">
        <template #activator="{ on, attrs }">
          <v-btn
            fab
            v-on="on"
            v-bind="attrs"
            x-small
            min-width="0"
            color="error"
            @click.stop="deleteItem(item)"
          >
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
            你确定要删除这个发信地址吗?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="secondary" @click="dialogDelete = false">
              取消
            </v-btn>
            <v-btn color="primary" @click="deleteItemConfirm">确定</v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template #no-data>
      <v-btn color="primary" @click="addItem">添加发信地址</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'mail-address',
  data: () => ({
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      // { text: '发信地址ID', value: 'mailAddressId' },
      { text: '发信地址', value: 'AccountName' },
      { text: '回信地址（状态）', value: 'ReplyAddress' },
      { text: '发信类型', value: 'Sendtype' },
      { text: '账号状态', value: 'AccountStatus' },
      { text: '域名状态', value: 'DomainStatus' },
      { text: '日额度', value: 'DailyReqCount' },
      { text: '月额度', value: 'MonthReqCount' },
      // { text: '日额度限额', value: 'DailyCount' },
      // { text: '月额度限额', value: 'MonthCount' },
      { text: '创建时间', value: 'CreateTime' },
      { text: '操作', value: 'actions', sortable: false }
    ],
    accounts: [],
    search: '',
    dialog: false,
    dialogDelete: false,
    formTitle: '添加发信地址',
    editedItem: {},
    sendtypeMap: {
      batch: '批量邮件',
      trigger: '触发邮件'
    },
    sendtypeOptions: [
      {
        text: '批量邮件',
        value: 'batch'
      },
      {
        text: '触发邮件',
        value: 'trigger'
      }
    ]
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
    addItem() {
      this.formTitle = '添加发信地址'
      this.dialog = true
    },
    editItem(item) {
      this.formTitle = '修改回信地址'
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      const { MailAddressId } = this.editedItem
      this.loading = true
      await fetch(
        `/api/mail/DeleteMailAddress?MailAddressId=${MailAddressId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      await this.getList()
      this.loading = false
      this.dialogDelete = false
    },
    async save() {
      this.loading = true
      if (this.editedItem.MailAddressId) {
        // 修改回信地址
        const params = new URLSearchParams({
          MailAddressId: this.editedItem.MailAddressId,
          ReplyAddress: this.editedItem.ReplyAddress
        })
        await fetch(`/api/mail/ModifyMailAddress?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } else {
        // 添加发信地址
        const params = new URLSearchParams(this.editedItem)
        await fetch(`/api/mail/CreateMailAddress?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      await this.getList()
      this.loading = false
      this.close()
    },
    close() {
      this.dialog = false
      this.formTitle = ''
      this.editedItem = {}
    },
    async getList() {
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
    async CheckReplyToMailAddress(item) {
      // 验证回信地址发送邮件。
      this.loading = true
      const params = new URLSearchParams({
        MailAddressId: item.MailAddressId
      })
      const response = await fetch(
        `/api/mail/CheckReplyToMailAddress?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const { Code } = await response.json()
      if (Code) {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      }
      this.loading = false
    }
  }
}
</script>
