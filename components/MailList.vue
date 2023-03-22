<template>
  <v-container fluid>
    <v-file-input
      class="d-none"
      accept=".xls,.xlsx"
      ref="uploadFile"
      v-model="file"
      @change="fileChange"
    />
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
          <v-btn color="secondary" dark class="mr-2" @click="getList">
            <v-icon left> mdi-refresh </v-icon>刷新
          </v-btn>
          <v-btn color="primary" dark class="mr-2" @click="editItem({})">
            <v-icon left> mdi-plus </v-icon>添加邮箱
          </v-btn>
          <a href="/ducoz-email.xlsx" target="_blank">
            <v-btn color="mr-2 danger" dark>
              <v-icon left> mdi-download </v-icon> 下载导入模板
            </v-btn>
          </a>
          <v-btn color="mr-2 success" dark @click="importExcel">
            <v-icon left> mdi-import </v-icon> 批量导入
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
                        <SelectReceiver v-model="listItem.receiver" />
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

      <template #[`item.birthday`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.birthday | format }}
            </span>
          </template>
          <span>{{ item.birthday | localTime }}</span>
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
          @click.stop="singleSendMail(item)"
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
    <MailUserDialog
      v-model="editDialog"
      :listItem="listItem"
      @updateList="getList"
    />
    <SendMailDialog
      :sendType="sendType"
      v-model="sendDialog"
      :listItem="listItem"
    />
    <v-dialog v-model="dialogDelete" width="auto">
      <v-card>
        <v-card-title class="text-h5">
          {{ `你确定要删除这${listItem.length || ''}个邮箱吗?` }}
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="dialogDelete = false"> 取消 </v-btn>
          <v-btn color="primary" @click="deleteItemConfirm">确定</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
        text: '国家',
        align: 'start',
        sortable: false,
        value: 'country'
      },
      {
        text: '品牌',
        align: 'start',
        sortable: false,
        value: 'brand'
      },
      {
        text: '平台',
        align: 'start',
        sortable: false,
        value: 'platform'
      },
      {
        text: '来源',
        align: 'start',
        sortable: false,
        value: 'from'
      },
      {
        text: '名字',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      {
        text: '昵称',
        align: 'start',
        sortable: false,
        value: 'nickname'
      },
      {
        text: '性别',
        align: 'start',
        sortable: false,
        value: 'gender'
      },
      {
        text: '生日',
        align: 'start',
        sortable: false,
        value: 'birthday'
      },
      {
        text: '手机号',
        align: 'start',
        sortable: false,
        value: 'mobile'
      },
      {
        text: '标签',
        align: 'start',
        sortable: false,
        value: 'tags'
      },
      {
        text: '更新时间',
        value: 'updatedAt',
        sortable: false
      },
      { text: '操作', value: 'actions', sortable: false }
    ],
    list: [],
    file: null,
    valid: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    },
    listItem: {},
    dialogDelete: false,
    addDialog: false,
    editDialog: false,
    sendDialog: false,
    sendType: 'Single'
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
    importExcel() {
      this.file = null
      this.$nextTick(() => {
        this.$refs.uploadFile.$refs.input.click()
      })
    },
    async fileChange() {
      if (!this.file) {
        return
      }
      this.uploading = true
      this.$notifier.showMessage({
        content: '文件上传中...',
        color: 'secondary'
      })

      // 批量导入
      const ab = await this.readFile()
      // parse workbook
      const wb = XLSX.read(ab)
      // update data
      const items = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      const params = items.map((item) =>
        this.getPureData({
          email: item['邮箱'],
          country: item['国家'],
          brand: item['品牌'],
          platform: item['平台'],
          from: item['来源'],
          name: item['名字'],
          nickname: item['昵称'],
          gender: item['性别'],
          birthday: item['生日'],
          mobile: item['手机号'],
          tags: item['标签']
        })
      )
      const { errors } = await this.$altogic.db.model('mails').create(params)
      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          color: 'success',
          content: '导入成功!'
        })
      }
      await this.getList()
      this.uploading = false
    },
    readFile() {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(this.file)
      })
    },
    addToReceiver() {
      this.listItem.email = Object.assign([], this.selected)
      this.listItem.emails = Object.assign([], this.selected)
      this.addDialog = true
    },
    closeAdd() {
      this.addDialog = false
    },
    editItem(item) {
      this.listItem = Object.assign({}, item)
      this.editDialog = true
    },
    deleteItem(item) {
      this.listItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      this.loading = true
      const { errors } = await this.$altogic.db
        .model('mails')
        .object(this.listItem._id)
        .delete()
      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          content: '删除成功',
          color: 'success'
        })
        await this.getList()
      }

      this.loading = false
      this.dialogDelete = false
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
    async addToReceiverConfirm() {
      const { email, receiver } = this.listItem
      this.loading = true
      const params = new URLSearchParams({
        ReceiverId: receiver.ReceiverId,
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
    singleSendMail(item) {
      this.sendType = 'Single'
      this.listItem = Object.assign({}, item)
      this.sendDialog = true
    },
    batchSendMail() {
      this.sendType = 'Batch'
      this.sendDialog = true
    }
  }
}
</script>
