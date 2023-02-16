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
          <Search ref="search" @doSearch="doSearch" :headers="headers" />
        </v-toolbar>
        <v-divider />
      </template>

      <template #[`item._id`]="{ item }">
        <span @click.stop="$copy(item._id)">
          {{ item._id }}
        </span>
      </template>

      <template #[`item.reviewImage`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-img
              height="80"
              width="80"
              v-on="on"
              v-bind="attrs"
              :src="item.reviewImage"
              @click.stop="$copy(item.reviewImage)"
            />
          </template>
          <v-img max-height="600" max-width="600" :src="item.reviewImage" />
          <p class="text-center">点击即可复制地址</p>
        </v-tooltip>
      </template>

      <template #[`item.reviewTime`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.reviewTime | format }}
            </span>
          </template>
          <span>{{ item.reviewTime }}</span>
        </v-tooltip>
      </template>
      <template #[`item.createdAt`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.createdAt | format }}
            </span>
          </template>
          <span>{{ item.createdAt }}</span>
        </v-tooltip>
      </template>
      <template #[`item.updatedAt`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.updatedAt | format }}
            </span>
          </template>
          <span>{{ item.updatedAt }}</span>
        </v-tooltip>
      </template>

      <template #[`item.orderId`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.orderId)">
              {{ item.orderId | ellipsis(28) }}
            </span>
          </template>
          <span>{{ item.orderId }}</span>
        </v-tooltip>
      </template>

      <template #[`item.reviewUrl`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.reviewUrl)">
              {{ item.reviewUrl | ellipsis(28) }}
            </span>
          </template>
          <span>{{ item.reviewUrl }}</span>
        </v-tooltip>
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
    <v-dialog persistent v-model="dialog" max-width="720" scrollable>
      <v-card>
        <v-toolbar dense>
          <span class="headline">订单信息</span>
          <v-spacer></v-spacer>
          <v-icon @click="closeAdd">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-file-input
                v-model="file"
                class="d-none"
                ref="uploadFile"
                accept="image/*"
                @change="fileChange"
              />
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    type="number"
                    label="后台价格"
                    disabled
                    v-model="listItem.price"
                  />
                </v-col>

                <v-card width="100%" v-if="editedIndex > -1">
                  <v-card-title> 反馈信息 </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          hide-details
                          label="结算"
                          :items="[
                            {
                              text: '已结算',
                              value: true
                            },
                            {
                              text: '待结算',
                              value: false
                            }
                          ]"
                          v-model="listItem.settlement"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          type="number"
                          label="佣金"
                          v-model="listItem.commission"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="订单号"
                          v-model="listItem.orderId"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="评价链接"
                          v-model="listItem.reviewUrl"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="评价截图"
                          v-model="listItem.reviewImage"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              block
                              v-on="on"
                              v-bind="attrs"
                              color="primary"
                              :disabled="uploading"
                              @click="uploadFile"
                            >
                              <v-icon left v-if="listItem.reviewImage">
                                mdi-image
                              </v-icon>
                              上传评价截图
                            </v-btn>
                          </template>
                          <v-img
                            max-height="320"
                            max-width="320"
                            v-if="listItem.reviewImage"
                            :src="listItem.reviewImage"
                            :lazy-src="listItem.reviewImage"
                          />
                          <span v-else>请上传图片</span>
                        </v-tooltip>
                      </v-col>
                      <v-col cols="12">
                        <DatePicker
                          label="评价时间"
                          v-model="listItem.reviewTime"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
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
    <v-dialog v-model="dialogDelete" width="auto">
      <v-card>
        <v-card-title class="text-h5">
          {{ `你确定要删除这${listItem.length || ''}个订单吗?` }}
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
import { mapState } from 'vuex'

export default {
  name: 'order',
  layout: 'admin',
  data: () => ({
    loading: true,
    uploading: false,
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
        text: '任务Id',
        value: '_parent',
        sortable: false,
        searchable: true
      },
      {
        text: '订单号',
        value: 'orderId',
        sortable: false,
        searchable: true
      },
      {
        text: '评价链接',
        value: 'reviewUrl',
        sortable: false
      },
      {
        text: '评价截图',
        value: 'reviewImage',
        sortable: false
      },
      {
        text: '评价时间',
        value: 'reviewTime',
        sortable: false
      },
      {
        text: '后台价格',
        value: 'price',
        sortable: false
      },
      {
        text: '佣金',
        value: 'commission',
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
    dialogDelete: false,
    valid: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    },
    editedIndex: -1,
    listItem: {},
    searchParams: {}
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
    ...mapState(['user'])
  },
  methods: {
    doSearch(params) {
      this.searchParams = Object.assign({}, params)
      if (this.options.page == 1) {
        this.getList()
      } else {
        this.options.page = 1
      }
    },
    getParams() {
      const params = []
      for (let param in this.searchParams) {
        params.push(`${param} == "${this.searchParams[param]}"`)
      }
      return params.join(' && ')
    },
    async getList() {
      this.loading = true
      const params = this.getParams()
      const { page, itemsPerPage } = this.options
      const { data, errors } = await this.$altogic.db
        .model('users.review.orders')
        .filter(params)
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
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db
        .model('users.review')
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
          content: '添加成功'
        })
        await this.getList()
        this.closeAdd()
      }
    },
    editItem(item) {
      this.editedIndex = this.list.indexOf(item)
      this.listItem = Object.assign({}, item)
      this.dialog = true
    },
    async updateItem() {
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db
        .model('users.review.orders')
        .object(params._id)
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
            .model('users.review.orders')
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
          .model('users.review.orders')
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
    uploadFile() {
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
      const { publicPath } = await this.$uploadFile(this.file, 'order')
      this.$set(this.listItem, 'reviewImage', publicPath)
      this.uploading = false
    }
  }
}
</script>
