<template>
  <v-data-table
    :headers="headers"
    :items="receivers"
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
          <v-icon left> mdi-plus </v-icon>创建收件人列表
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
                      label="列表名称"
                      v-model="editedItem.ReceiversName"
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
                      label="列表别称"
                      v-model="editedItem.ReceiversAlias"
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

    <template #[`item.ReceiversStatus`]="{ item }">
      <v-chip small label :color="item.ReceiversStatus ? 'error' : 'success'">
        {{ ReceiversStatus[item.ReceiversStatus] }}
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
      <v-dialog scrollable persistent v-model="dialogView" width="auto">
        <template #activator="{ on, attrs }">
          <v-btn
            fab
            x-small
            v-on="on"
            v-bind="attrs"
            min-width="0"
            color="primary"
            class="mr-2"
            @click.stop="viewItem(item)"
          >
            <v-icon small> mdi-list-box </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dense>
            <span class="headline">列表详情</span>
            <v-spacer />
            <v-icon @click="dialogView = false">mdi-close</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-simple-table dense>
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">邮箱</th>
                    <th class="text-left">信息({{ DataSchema }})</th>
                    <th class="text-left">创建日期</th>
                    <th class="text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="index" v-for="(detail, index) in details">
                    <td>{{ detail.Email }}</td>
                    <td>{{ detail.Data }}</td>
                    <td>{{ detail.CreateTime | localTime }}</td>
                    <td>
                      <v-btn
                        fab
                        x-small
                        color="error"
                        @click.stop="deleteReceiverDetail(detail)"
                      >
                        <v-icon small> mdi-delete </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="success" dark class="mr-2" @click="getDetail">
              <v-icon left> mdi-refresh </v-icon>刷新
            </v-btn>
            <v-spacer />
            <v-btn color="primary" @click="dialogView = false"> 关闭 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
            你确定要删除这个收件人列表吗?
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
      <v-alert type="warning">
        可以先创建收件人列表，让后把要群发的人添加到列表
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'receiver',
  data: () => ({
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      // { text: '收件人列表ID', value: 'receiverId' },
      { text: '收件人列表名称', value: 'ReceiversName' },
      { text: '收件人列表别名', value: 'ReceiversAlias' },
      { text: '收件人地址总数', value: 'Count' },
      { text: '描述', value: 'Desc' },
      { text: '列表状态', value: 'ReceiversStatus' },
      { text: '创建时间', value: 'CreateTime' },
      { text: '操作', value: 'actions', sortable: false }
    ],
    receivers: [],
    details: [],
    DataSchema: '',
    ReceiversStatus: ['正在上传', '上传完成'],
    search: '',
    dialog: false,
    dialogView: false,
    dialogDelete: false,
    formTitle: '创建收件人列表',
    editedItem: {}
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
      this.formTitle = '创建收件人列表'
      this.dialog = true
    },
    async viewItem(item) {
      this.editedItem = Object.assign({}, item)
      this.getDetail()
      this.dialogView = true
    },
    deleteItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      const { ReceiverId } = this.editedItem
      this.loading = true
      await fetch(`/api/mail/DeleteReceiver?ReceiverId=${ReceiverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await this.getList()
      this.loading = false
      this.dialogDelete = false
    },
    async save() {
      this.loading = true
      // 创建收件人列表
      const params = new URLSearchParams(this.editedItem)
      await fetch(`/api/mail/CreateReceiver?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
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
      const response = await fetch('/api/mail/QueryReceiverByParam', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { data, Code } = await response.json()
      if (data && data.receiver) {
        this.receivers = data.receiver
      } else {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      }
      this.loading = false
    },
    async getDetail() {
      const { ReceiverId } = this.editedItem
      this.loading = true
      const response = await fetch(
        `/api/mail/QueryReceiverDetail?ReceiverId=${ReceiverId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const { data, Code, DataSchema } = await response.json()
      this.DataSchema = DataSchema
      if (data && data.detail) {
        this.details = data.detail
      } else {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      }
      this.loading = false
    },
    async deleteReceiverDetail(item) {
      const { ReceiverId } = this.editedItem
      const { Email } = item
      this.loading = true
      const response = await fetch(
        `/api/mail/DeleteReceiverDetail?ReceiverId=${ReceiverId}&Email=${Email}`,
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
          content: '删除成功',
          color: 'success'
        })
        await this.getDetail()
      }
      this.loading = false
    }
  }
}
</script>
