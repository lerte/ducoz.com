<template>
  <v-container fluid>
    <v-data-table
      show-select
      :items="list"
      item-key="_id"
      :headers="headers"
      :loading="loading"
      v-model="selected"
      class="elevation-1"
      @click:row="editItem"
      :options.sync="options"
      :server-items-length="totalCount"
      :footer-props="require('@/assets/json/footer-props.json')"
    >
      <template #top>
        <v-toolbar flat>
          <v-btn color="secondary" dark class="mr-2" @click="getList">
            <v-icon left> mdi-refresh </v-icon>刷新
          </v-btn>
          <v-btn color="error" dark class="mr-2" @click="deleteItem(selected)">
            <v-icon left> mdi-delete </v-icon>删除
          </v-btn>
          <v-dialog persistent v-model="dialog" max-width="720" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon left> mdi-plus </v-icon>添加
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dense>
                <span class="headline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
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
                          v-model="listItem.reivewId"
                        />
                      </v-col>
                      <v-card width="100%" v-if="editedIndex > -1">
                        <v-card-title> 反馈信息 </v-card-title>
                        <v-divider />
                        <v-col cols="12">
                          <v-text-field
                            dense
                            chips
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
                            chips
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
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!valid" @click="submit">
                  提交
                </v-btn>
                <v-btn color="secondary" @click="closeAdd"> 取消 </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" width="auto">
            <v-card>
              <v-card-title class="text-h5">
                {{ `你确定要删除这${listItem.length || ''}条信息吗?` }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="dialogDelete = false">
                  取消
                </v-btn>
                <v-btn color="primary" @click="deleteItemConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider></v-divider>
      </template>

      <template #[`item._id`]="{ item }">
        <span @click.stop="$copy(item._id)">
          {{ item._id }}
        </span>
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
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'checkmail',
  layout: 'admin',
  data: () => ({
    loading: true,
    totalCount: 0,
    selected: [],
    options: {
      page: 1,
      itemsPerPage: 12
    },
    headers: [
      {
        text: 'Id',
        value: '_id',
        sortable: false,
        searchable: true
      },
      {
        text: '用户Id',
        value: '_parent',
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
    dialog: false,
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
      async handler() {
        this.getList()
        this.$store.commit('SET_SEARCH_ITEMS', this.headers)
      },
      deep: true
    },
    searching: {
      handler(val) {
        if (val) {
          this.getList()
        }
      }
    },
    searchText: {
      handler(val) {
        if (!val) {
          this.getList()
        }
      }
    }
  },
  computed: {
    ...mapState(['user', 'searchItem', 'searchText', 'searching']),
    formTitle() {
      return this.editedIndex == -1 ? '添加' : '编辑'
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const params = new URLSearchParams({
        page,
        pageSize: itemsPerPage
      })
      if (this.searchItem && this.searchText) {
        params.append(this.searchItem, this.searchText)
      }
      if (this.searching) {
        params.set('page', 1)
        this.options.page = 1
      }

      const { data, errors } = await this.$altogic.db
        .model('users.checkmail')
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
      this.$store.commit('SET_SEARCHING', false)
    },

    async submit() {
      if (this.editedIndex > -1) {
        await this.updateItem()
      } else {
        await this.addItem()
      }
    },
    getPureData(data) {
      for (var key in data) {
        if (!data[key]) {
          delete data[key]
        }
      }
      return data
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
        await this.getList()
        this.closeAdd()
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
      }
    }
  }
}
</script>
