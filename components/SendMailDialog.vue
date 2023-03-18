<template>
  <v-dialog persistent scrollable max-width="720" v-model="dialog">
    <v-card>
      <v-toolbar dense>
        <span class="headline">{{ formTitle }}</span>
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  chips
                  outlined
                  clearable
                  cache-items
                  hide-details
                  deletable-chips
                  label="发信地址"
                  :items="accountNames"
                  :rules="[rules.required]"
                  @focus="getAccountNames"
                  item-text="AccountName"
                  item-key="AccountName"
                  v-model="sendItem.AccountName"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  chips
                  outlined
                  clearable
                  cache-items
                  hide-details
                  deletable-chips
                  label="地址类型"
                  :items="[
                    { text: '随机账号', value: 0 },
                    { text: '发信地址', value: 1 }
                  ]"
                  :rules="[rules.required]"
                  v-model="sendItem.AddressType"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  chips
                  outlined
                  hide-details
                  label="收信地址"
                  v-model="sendItem.ToAddress"
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
                  label="是否启用管理控制台中配置好回信地址"
                  :items="[
                    { text: '是', value: 'true' },
                    { text: '否', value: 'false' }
                  ]"
                  :rules="[rules.required]"
                  v-model="sendItem.ReplyToAddress"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  chips
                  outlined
                  clearable
                  hide-details
                  label="邮件主题"
                  :rules="[rules.required]"
                  v-model="sendItem.Subject"
                />
              </v-col>
              <v-col cols="12">
                <Editor
                  :rules="[rules.required]"
                  v-model="sendItem.HtmlBody"
                  v-if="dialog"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" :disabled="!valid" @click="sendMail">
          <v-icon left>mdi-send</v-icon>
          发送
        </v-btn>
        <v-btn color="secondary" @click="close">
          <v-icon left>mdi-close</v-icon>
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'send-mail-dialog',
  props: {
    dialog: {
      type: Boolean
    },
    sendType: {
      type: String,
      default: 'Single',
      validator: (value) => ['Single', 'Batch'].includes(value)
    },
    user: {
      type: Object,
      required: true
    }
  },
  model: {
    prop: 'dialog'
  },
  watch: {
    dialog: {
      handler(val) {
        if (val) {
          this.$set(this.sendItem, 'ToAddress', this.user.email)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data: () => ({
    accountNames: [],
    emails: [],
    sendItem: {},
    valid: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    }
  }),
  computed: {
    formTitle() {
      if (this.sendType == 'Single') {
        return '发送单条邮件'
      }
      if (this.sendType == 'Batch') {
        return '批量发送邮件'
      }
    }
  },
  methods: {
    async getAccountNames() {
      this.loading = true
      const response = await fetch('/api/mail/QueryMailAddressByParam', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { data, Code } = await response.json()
      if (data && data.mailAddress) {
        this.accountNames = data.mailAddress
      } else {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      }
      this.loading = false
    },
    async sendMail() {
      const params = Object.assign({}, this.sendItem)
      const response = await fetch(
        `/api/mail/${this.sendType}SendMail?${new URLSearchParams(params)}`,
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
      } else {
        this.$notifier.showMessage({
          content: '发送成功',
          color: 'success'
        })
        this.close()
      }
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
