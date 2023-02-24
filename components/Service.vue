<template>
  <v-container fluid>
    <v-data-table
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
          <v-dialog persistent v-model="dialog" max-width="540" scrollable>
            <template #activator="{ on, attrs }">
              <v-btn
                dark
                v-on="on"
                v-bind="attrs"
                class="mr-2"
                color="primary"
                v-if="$route.path.startsWith('/user')"
              >
                <v-icon left> mdi-plus </v-icon>发起服务
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dense>
                <span class="headline">{{ formTitle }}服务</span>
                <v-spacer />
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
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          hide-details
                          label="服务类型"
                          :items="serviceType"
                          :rules="[rules.required]"
                          v-model="listItem.serviceType"
                          :disabled="$route.path.startsWith('/admin')"
                        />
                      </v-col>
                      <v-col cols="12" v-if="listItem.serviceType == '充值'">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="充值金额"
                          type="number"
                          prefix="$"
                          placeholder="2000起充"
                          v-model="listItem.recharge"
                          :rules="[rules.min]"
                          :disabled="$route.path.startsWith('/admin')"
                        />
                      </v-col>
                      <v-col cols="6" v-if="listItem.serviceType == '充值'">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="充值截图"
                          v-model="listItem.rechargeShot"
                        />
                      </v-col>
                      <v-col cols="6" v-if="listItem.serviceType == '充值'">
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
                              <v-icon left v-if="listItem.rechargeShot">
                                mdi-image
                              </v-icon>
                              上传充值截图
                            </v-btn>
                          </template>
                          <v-img
                            max-height="320"
                            max-width="320"
                            v-if="listItem.rechargeShot"
                            :src="listItem.rechargeShot"
                            :lazy-src="listItem.rechargeShot"
                          />
                          <span v-else>请上传图片</span>
                        </v-tooltip>
                      </v-col>
                      <v-col cols="12" v-if="listItem.serviceType == 'BM换绑'">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="换绑至"
                          :rules="[rules.required]"
                          v-model="listItem.changeBM"
                          :disabled="$route.path.startsWith('/admin')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        v-if="listItem.serviceType == 'Pixel授权'"
                      >
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="授权至"
                          :rules="[rules.required]"
                          v-model="listItem.changePixel"
                          :disabled="$route.path.startsWith('/admin')"
                        />
                      </v-col>
                      <v-col cols="12" v-if="listItem.serviceType == '转余额'">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="转余额至"
                          :rules="[rules.required]"
                          v-model="listItem.changeAct"
                          :disabled="$route.path.startsWith('/admin')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        v-if="listItem.serviceType == '其他问题'"
                      >
                        <v-textarea
                          outlined
                          auto-grow
                          hide-details
                          label="其他问题"
                          row-height="15"
                          :rules="[rules.required]"
                          v-model="listItem.other"
                        />
                      </v-col>
                      <v-card width="100%" v-if="editedIndex > -1">
                        <v-card-title> 反馈信息 </v-card-title>
                        <v-divider />
                        <v-card-text>
                          <v-row>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                auto-grow
                                hide-details
                                label="服务反馈"
                                row-height="15"
                                :disabled="$route.path.startsWith('/user')"
                                v-model="listItem.serviceStatus"
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
                <v-btn
                  @click="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="!valid || loading"
                >
                  提交
                </v-btn>
                <v-btn color="secondary" @click="closeAdd"> 取消 </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <Search
            ref="search"
            @doSearch="doSearch"
            :headers="headers"
            :dicts="{ serviceType }"
          />
        </v-toolbar>
        <v-divider />
      </template>

      <template #[`item._id`]="{ item }">
        <span @click.stop="$copy(item._id)">
          {{ item._id }}
        </span>
      </template>

      <template #[`item.rechargeShot`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-img
              height="80"
              width="80"
              v-on="on"
              v-bind="attrs"
              :src="item.rechargeShot"
              @click.stop="$copy(item.rechargeShot)"
            />
          </template>
          <v-img max-height="600" max-width="600" :src="item.rechargeShot" />
          <p class="text-center">点击即可复制地址</p>
        </v-tooltip>
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

      <template #[`item.serviceStatus`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.serviceStatus)">
              {{ item.serviceStatus | ellipsis(28) }}
            </span>
          </template>
          <span>{{ item.serviceStatus }}</span>
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
          v-if="$route.path.startsWith('/admin')"
        >
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
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
  name: 'service',
  props: {
    _parent: {
      type: String
    }
  },
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
        text: '服务类型',
        value: 'serviceType',
        sortable: false,
        searchable: true
      },
      {
        text: '充值金额',
        value: 'recharge',
        sortable: false
      },
      {
        text: '充值截图',
        value: 'rechargeShot',
        sortable: false
      },
      {
        text: 'BM换绑至',
        value: 'changeBM',
        sortable: false
      },
      {
        text: 'Pixel授权至',
        value: 'changePixel',
        sortable: false
      },
      {
        text: '转余额至',
        value: 'changeAct',
        sortable: false
      },
      {
        text: '服务反馈',
        value: 'serviceStatus',
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
    serviceType: [
      '充值',
      '广告账户申诉',
      'BM换绑',
      'Pixel授权',
      '转余额',
      '广告余额退款',
      '其他问题'
    ],
    file: null,
    list: [],
    dialog: false,
    dialogDelete: false,
    valid: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.',
      min: (v) => v >= 2000 || '最少2000$起'
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
    ...mapState(['user']),
    formTitle() {
      return this.editedIndex == -1 ? '添加' : '编辑'
    }
  },
  methods: {
    calcBalance(item) {
      // 计算本佣: 汇率*后台价格 + 佣金 + 税费
      return (
        item.price * this.exchangeRate +
        parseFloat(item.commission) +
        parseFloat(this.tax)
      ).toFixed(2)
    },
    doSearch(params) {
      this.searchParams = Object.assign({}, params)
      if (this.options.page == 1) {
        this.getList()
      } else {
        this.options.page = 1
      }
    },
    getParams() {
      const params = [`_parent == "${this._parent}"`]
      for (let param in this.searchParams) {
        if (param == 'settlement') {
          if (!this.searchParams[param]) {
            params.push(`${param} != true`)
          } else {
            params.push(`${param} == ${this.searchParams[param]}`)
          }
        } else {
          params.push(`${param} == ${this.searchParams[param]}`)
        }
      }
      return params.join(' && ')
    },
    async getList() {
      this.loading = true
      const params = this.getParams()
      const { page, itemsPerPage } = this.options
      const { data, errors } = await this.$altogic.db
        .model('users.facebook_ad_account.requestService')
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
      const params = { serviceType: data.serviceType }
      if (data.serviceType == '充值') {
        params['recharge'] = data['recharge']
        params['rechargeShot'] = data['rechargeShot']
      }
      if (data.serviceType == 'BM换绑') {
        params['changeBM'] = data['changeBM']
      }
      if (data.serviceType == 'Pixel授权') {
        params['changePixel'] = data['changePixel']
      }
      if (data.serviceType == '转余额') {
        params['changeAct'] = data['changeAct']
      }
      if (data.serviceType == '其他问题') {
        params['other'] = data['other']
      }
      const { errors } = await this.$altogic.db
        .model('users.facebook_ad_account.requestService')
        .object()
        .append(params, this._parent)
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
        .model('users.facebook_ad_account.requestService')
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
      const { publicPath } = await this.$uploadFile(this.file, 'service')
      this.$set(this.listItem, 'rechargeShot', publicPath)
      this.uploading = false
    }
  }
}
</script>
