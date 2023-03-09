<template>
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
          v-model="sendDialog"
          v-if="selected.length"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              dark
              v-on="on"
              v-bind="attrs"
              color="success"
              @click="sendMail"
            >
              <v-icon left> mdi-send </v-icon>群发
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dense>
              <span class="headline">群发邮件</span>
              <v-spacer />
              <v-icon @click="closeSend">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        dense
                        chips
                        outlined
                        clearable
                        hide-details
                        label="发件人"
                        v-model="listItem.from"
                      />
                    </v-col>
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
                        v-model="listItem.to"
                        :items="listItem.emails"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        dense
                        chips
                        outlined
                        clearable
                        hide-details
                        label="主题"
                        v-model="listItem.subject"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        dense
                        chips
                        outlined
                        clearable
                        hide-details
                        label="标题"
                        :rules="[rules.required]"
                        v-model="listItem.title"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        outlined
                        auto-grow
                        hide-details
                        label="内容"
                        row-height="15"
                        :rules="[rules.required]"
                        v-model="listItem.content"
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
                color="primary"
                :disabled="!valid"
                @click="sendMailConfirm"
              >
                <v-icon left>mdi-send</v-icon>
                发送
              </v-btn>
              <v-btn color="secondary" @click="closeSend">
                <v-icon left>mdi-close</v-icon>
                取消
              </v-btn>
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
  </v-data-table>
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
    listItem: {},
    sendDialog: false,
    valid: false,
    rules: {
      required: (value) => !!value || '必填项.'
    }
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
    sendMail() {
      this.listItem.to = this.selected.map((item) => item.email)
      this.listItem.emails = this.selected.map((item) => item.email)
      this.sendDialog = true
    },
    closeSend() {
      this.sendDialog = false
    },
    sendMailConfirm() {
      const params = this.listItem
      delete params['emails']
      console.log(params)
      this.$notifier.showMessage({
        content: '等待接口对接:' + params.to.join(';'),
        color: 'error'
      })
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
    }
  }
}
</script>
