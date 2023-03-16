<template>
  <v-data-table
    :headers="headers"
    :items="accounts"
    :search="search"
    :items-per-page="5"
    class="elevation-1"
  >
    <template #[`item.Sendtype`]="{ item }">
      <v-chip>{{ item.Sendtype }}</v-chip>
    </template>
    <template #top>
      <v-toolbar flat dense>
        <v-btn color="primary" dark class="mr-2" @click="getList">
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

    <template #[`item.actions`]="{ item }">
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

    <template #no-data>
      <v-btn color="primary" @click="addItem">添加发信地址</v-btn>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    headers: [
      // { text: '发信地址ID', value: 'mailAddressId' },
      { text: '发信地址', value: 'AccountName' },
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
    formTitle: '添加发信地址',
    editedItem: {},
    sendtypeOptions: ['batch', 'trigger']
  }),
  methods: {
    addItem() {
      this.formTitle = '添加发信地址'
      this.dialog = true
    },
    editItem(item) {
      this.formTitle = '修改发信地址'
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      console.log(item.mailAddressId)
      // todo make api request
    },
    save() {
      // todo make api request
      console.log(this.editedItem)
      this.close()
    },
    close() {
      this.dialog = false
      this.formTitle = ''
      this.editedItem = {}
    },
    async getList() {
      const response = await fetch('/api/mail/QueryMailAddressByParam', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { data } = await response.json()
      this.accounts = data.mailAddress
    }
  },
  created() {
    this.getList()
  }
}
</script>
