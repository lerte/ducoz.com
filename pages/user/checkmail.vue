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
        <v-toolbar flat>
          <v-btn color="secondary" dark class="mr-2" @click="getList">
            <v-icon left> mdi-refresh </v-icon>刷新
          </v-btn>
          <v-dialog persistent v-model="dialog" max-width="720" scrollable>
            <template #activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon left> mdi-plus </v-icon>提交信息
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dense>
                <span class="headline">{{ formTitle }}</span>
                <v-spacer />
                <v-icon @click="closeAdd">mdi-close</v-icon>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="6">
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          hide-details
                          label="国家"
                          :rules="[rules.required]"
                          v-model="listItem.country"
                          :items="require('@/assets/json/countries.json')"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          hide-details
                          label="ASIN"
                          :rules="[rules.required]"
                          v-model="listItem.asin"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          hide-details
                          label="评价链接"
                          :rules="[rules.required]"
                          v-model="listItem.reviewUrl"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          hide-details
                          label="评价Id"
                          v-model="listItem.reviewId"
                        />
                      </v-col>
                      <v-card width="100%" v-if="editedIndex > -1">
                        <v-card-title> 反馈信息 </v-card-title>
                        <v-divider />
                        <v-col cols="12">
                          <v-text-field
                            dense
                            disabled
                            outlined
                            clearable
                            hide-details
                            label="邮箱"
                            v-model="listItem.email"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            dense
                            disabled
                            outlined
                            clearable
                            hide-details
                            label="订单号"
                            v-model="listItem.orderId"
                          />
                        </v-col>
                      </v-card>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" :disabled="!valid" @click="submit">
                  提交
                </v-btn>
                <v-btn color="secondary" @click="closeAdd"> 取消 </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <a href="/ducoz-checkmail.xlsx" target="_blank">
            <v-btn color="ml-2 danger" dark>
              <v-icon left> mdi-download </v-icon> 下载导入模板
            </v-btn>
          </a>
          <v-btn color="ml-2 success" dark @click="importExcel">
            <v-icon left> mdi-import </v-icon> 批量导入
          </v-btn>
          <v-btn color="ml-2 success" dark @click="exportExcel">
            <v-icon left> mdi-export </v-icon> 导出数据
          </v-btn>
          <v-dialog v-model="dialogDelete" width="auto">
            <v-card>
              <v-card-title class="text-h5">
                {{ `你确定要删除这${listItem.length || ''}条信息吗?` }}
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
        </v-toolbar>
        <v-divider />
      </template>

      <template #[`item._id`]="{ item }">
        <span @click.stop="$copy(item._id)">
          {{ item._id }}
        </span>
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

      <template #[`item.status`]="{ item }">
        <v-chip
          label
          small
          :color="item.email ? 'success' : 'secondary'"
          text-color="white"
        >
          {{ item.email ? '已反馈' : '未反馈' }}
        </v-chip>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          fab
          x-small
          class="mr-2"
          min-width="0"
          color="primary"
          @click.stop="editItem(item)"
          v-if="!item.email || !item.orderId"
        >
          <v-icon small> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          fab
          x-small
          min-width="0"
          color="error"
          @click.stop="deleteItem(item)"
          v-if="!item.email || !item.orderId"
        >
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog persistent scrollable v-model="dialogTips" max-width="320">
      <v-card>
        <v-toolbar dense>
          <span class="headline">在线支付{{ amount }}</span>
          <v-spacer />
          <v-icon @click="dialogTips = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <img alt="wxpay" src="@/assets/img/wxpay.jpg" style="width: 320px" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn block color="success" @click="addItemConfirm">
            支付成功确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'checkmail',
  layout: 'user',
  head() {
    return {
      script: [
        {
          hid: 'xlsx',
          src: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
          defer: true
        }
      ]
    }
  },
  data: () => ({
    loading: true,
    totalCount: 0,
    selected: [],
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      {
        text: 'Id',
        value: '_id',
        sortable: false,
        searchable: true
      },
      {
        text: '国家',
        value: 'country',
        sortable: false
      },
      {
        text: 'ASIN',
        value: 'asin',
        sortable: false
      },
      {
        text: '评论链接',
        value: 'reviewUrl',
        sortable: false
      },
      {
        text: '评论Id',
        value: 'reviewId',
        sortable: false
      },
      {
        text: '反馈状态',
        value: 'status',
        sortable: false
      },
      {
        text: '邮箱',
        value: 'email',
        sortable: false
      },
      {
        text: '订单Id',
        value: 'orderId',
        sortable: false
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
    file: null,
    list: [],
    dialog: false,
    dialogTips: false, // 提示付款
    amount: 0,
    dialogDelete: false,
    valid: false,
    rules: {
      required: (value) => !!value || '必填项.'
    },
    editedIndex: -1,
    listItem: {}
  }),
  watch: {
    options: {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['user']),
    formTitle() {
      return this.editedIndex == -1 ? '添加' : '编辑'
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const { data, errors } = await this.$altogic.db
        .model('users.checkmail')
        .filter(`_parent == "${this.user._id}"`)
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
    async submit() {
      if (this.editedIndex > -1) {
        await this.updateItem()
      } else {
        await this.addItem()
      }
    },
    closeAdd() {
      this.dialog = false
      this.close()
    },
    closeDelete() {
      this.dialogDelete = false
      this.close()
    },
    close() {
      this.$nextTick(() => {
        this.listItem = {}
        this.editedIndex = -1
      })
    },
    async addItem() {
      this.amount = '100元'
      this.dialogTips = true
    },
    async addItemConfirm() {
      if (!this.dialog) {
        // 批量导入的
        await this.addMultiItems()
        this.dialogTips = false
        return
      }
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db
        .model('users.checkmail')
        .object()
        .append(params, this.user._id)
      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          color: 'success',
          content: '添加成功，付款后，我们的工作人员会处理的'
        })
        await this.getList()
        this.dialogTips = false
        this.closeAdd()
        this.$sendMessage({
          msgtype: 'markdown',
          markdown: {
            content:
              '<font color="warning">查邮管理-有新的需求</font>\n[点击查看](https://ducoz.com/admin/checkmail)'
          }
        })
      }
    },
    editItem(item) {
      this.editedIndex = this.list.indexOf(item)
      this.listItem = Object.assign({}, item)
      this.dialog = true
    },
    async deleteItem(item) {
      if (item.length) {
        // 删除多个
        this.listItem = item
        this.dialogDelete = true
      } else {
        this.editedIndex = this.list.indexOf(item)
        if (this.editedIndex > -1) {
          this.listItem = Object.assign({}, item)
          this.dialogDelete = true
        } else {
          this.$notifier.showMessage({
            color: 'error',
            content: '请选择要删除的条目'
          })
        }
      }
    },
    async deleteItemConfirm() {
      if (this.listItem.length) {
        // 删除多个
        for (let item of this.listItem) {
          const { errors } = await this.$altogic.db
            .model('users.checkmail')
            .object(item._id)
            .delete()
          if (errors) {
            this.$notifier.showMessage({
              content: errors,
              color: 'error'
            })
          }
        }
      } else {
        // 删除单个
        const { errors } = await this.$altogic.db
          .model('users.checkmail')
          .object(this.listItem._id)
          .delete()
        if (errors) {
          this.$notifier.showMessage({
            content: errors,
            color: 'error'
          })
        }
      }
      await this.getList()
      this.closeDelete()
    },
    async updateItem() {
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db
        .model('users.checkmail')
        .object(params['_id'])
        .update(params)
      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        await this.getList()
        this.closeAdd()
        this.$sendMessage({
          msgtype: 'markdown',
          markdown: {
            content:
              '<font color="warning">查邮管理-有更新</font>\n[点击查看](https://ducoz.com/admin/checkmail)'
          }
        })
      }
    },
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
      const ab = await this.readFile()
      // parse workbook
      const wb = XLSX.read(ab)
      // update data
      const items = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      this.amount = items.length * 100 + '元'
      this.dialogTips = true
    },
    async addMultiItems() {
      const ab = await this.readFile()
      // parse workbook
      const wb = read(ab)
      // update data
      const items = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      const params = items.map((item) =>
        this.getPureData({
          country: item['国家'],
          asin: item['ASIN'],
          reviewUrl: item['评论链接'],
          reviewId: item['评论Id']
        })
      )
      for (let data of params) {
        const { errors } = await this.$altogic.db
          .model('users.checkmail')
          .object()
          .append(data, this.user._id)
        if (errors) {
          this.$notifier.showMessage({
            content: errors,
            color: 'error'
          })
        }
      }
      this.$notifier.showMessage({
        color: 'success',
        content: '导入成功，付款后，我们的工作人员会处理的'
      })
      await this.getList()
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
    exportExcel() {
      if (this.selected.length) {
        const data = this.selected.map((item) => ({
          国家: item['country'],
          ASIN: item['asin'],
          评论链接: item['reviewUrl'],
          评论Id: item['reviewId'],
          邮箱: item['email'],
          订单Id: item['orderId']
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, '多泽跨境-查邮模板')
        const now = Date.now()
        XLSX.writeFileXLSX(wb, `多泽跨境-查邮-${now}.xlsx`)
        this.$notifier.showMessage({
          color: 'success',
          content: '导出成功'
        })
      } else {
        this.$notifier.showMessage({
          color: 'error',
          content: '请选择要导出的条目'
        })
      }
    }
  }
}
</script>
