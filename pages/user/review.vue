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
      :items="list"
      item-key="_id"
      :headers="headers"
      :loading="loading"
      v-model="selected"
      class="elevation-1"
      :options.sync="options"
      @click:row="viewOrders"
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
                <v-icon left> mdi-plus </v-icon>提交评测
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
                    <v-file-input
                      v-model="file"
                      class="d-none"
                      ref="uploadFile"
                      accept="image/*"
                      @change="fileChange"
                    />
                    <v-row>
                      <v-col cols="6">
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="平台"
                          v-model="listItem.platform"
                          :items="[
                            '亚马逊',
                            '沃尔玛',
                            '速卖通',
                            '阿里国际站',
                            '易贝',
                            '其他'
                          ]"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="国家"
                          :rules="[rules.required]"
                          v-model="listItem.country"
                          :items="require('@/assets/json/countries.json')"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="产品中文名"
                          :rules="[rules.required]"
                          v-model="listItem.productChineseName"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="币种"
                          :rules="[rules.required]"
                          v-model="listItem.currency"
                          :items="['美元', '欧元', '日元', '加元']"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="售价"
                          type="number"
                          :rules="[rules.required]"
                          v-model="listItem.price"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="ASIN"
                          :rules="[rules.required]"
                          v-model="listItem.asin"
                        />
                      </v-col>
                      <!-- <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="变体"
                          :rules="[rules.required]"
                          v-model="listItem.variant"
                        />
                      </v-col> -->
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="关键词"
                          :rules="[rules.required]"
                          v-model="listItem.keywords"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          type="number"
                          label="关键词所在页"
                          :rules="[rules.required]"
                          v-model="listItem.keywordsPage"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          type="number"
                          label="期望每日单数"
                          :rules="[rules.required]"
                          v-model="listItem.dailyOrders"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          type="number"
                          label="总单数"
                          :rules="[rules.required]"
                          v-model="listItem.totalOrders"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          :disabled="listItem.orderProgress"
                          label="产品主图"
                          :rules="[rules.required]"
                          v-model="listItem.mainImage"
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
                              :disabled="uploading || listItem.orderProgress"
                              @click="uploadFile"
                            >
                              <v-icon left v-if="listItem.mainImage">
                                mdi-image
                              </v-icon>
                              上传主图
                            </v-btn>
                          </template>
                          <v-img
                            max-height="320"
                            max-width="320"
                            v-if="listItem.mainImage"
                            :src="listItem.mainImage"
                            :lazy-src="listItem.mainImage"
                          />
                          <span v-else>请上传图片</span>
                        </v-tooltip>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="Listing链接"
                          :rules="[rules.required]"
                          v-model="listItem.listing"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          :disabled="listItem.orderProgress"
                          hide-details
                          label="评价类型"
                          :rules="[rules.required]"
                          v-model="listItem.reviewType"
                          :items="reviewType"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          :disabled="
                            listItem.orderProgress == '已完成' ||
                            listItem.orderProgress == 'rating' ||
                            listItem.orderProgress == 'feedback'
                          "
                          outlined
                          auto-grow
                          hide-details
                          label="备注"
                          row-height="15"
                          v-model="listItem.clientRemark"
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
          <a href="/ducoz-review.xlsx" target="_blank">
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
                {{ `你确定要删除这${listItem.length || ''}个任务吗?` }}
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

      <template #[`item.country`]="{ item }">
        <Country :country="item.country" />
      </template>

      <template #[`item.mainImage`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-img
              height="80"
              width="80"
              v-on="on"
              v-bind="attrs"
              :src="item.mainImage"
              @click.stop="$copy(item.mainImage)"
            />
          </template>
          <v-img max-height="600" max-width="600" :src="item.mainImage" />
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

      <template #[`item.reviewStatus`]="{ item }">
        <v-chip
          label
          small
          text-color="white"
          v-if="item.reviewStatus"
          :color="
            ['secondary', 'primary', 'success', 'error'][
              reviewStatus.findIndex((status) => status == item.reviewStatus)
            ]
          "
        >
          {{ item.reviewStatus }}
        </v-chip>
      </template>

      <template #[`item.orders`]="{ item }">
        <v-chip
          label
          small
          text-color="white"
          color="success"
          @click.stop="viewOrders(item)"
        >
          {{ item.orders?.length }}
        </v-chip>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              fab
              x-small
              class="mr-2"
              min-width="0"
              color="success"
              @click.stop="copyItem(item)"
            >
              <v-icon small> mdi-content-copy </v-icon>
            </v-btn>
          </template>
          <span>复制，然后修改主图或其他内容，主要用于添加变体</span>
        </v-tooltip>
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
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              fab
              x-small
              class="mr-2"
              min-width="0"
              color="secondary"
              @click.stop="stopReview(item)"
            >
              <v-icon small> mdi-power </v-icon>
            </v-btn>
          </template>
          <span>停止任务</span>
        </v-tooltip>
        <v-btn
          fab
          x-small
          min-width="0"
          color="error"
          @click.stop="deleteItem(item)"
          v-if="!item.reviewStatus"
        >
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogStop" width="auto">
      <v-card>
        <v-card-title class="text-h5"> 你确定要停止该任务吗？ </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="dialogStop = false"> 取消 </v-btn>
          <v-btn color="primary" @click="stopReviewConfirm">确定</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogOrder" scrollable>
      <v-card>
        <v-toolbar dense>
          <span class="headline">订单管理</span>
          <v-spacer />
          <v-icon @click="dialogOrder = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <Order
            v-if="dialogOrder"
            :tax="listItem.tax"
            :_parent="listItem._id"
            :exchangeRate="listItem.exchangeRate"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'review',
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
        text: '平台',
        value: 'platform',
        sortable: false
      },
      {
        text: '国家',
        value: 'country',
        sortable: false
      },
      {
        text: '产品主图',
        value: 'mainImage',
        sortable: false
      },
      {
        text: '产品中文名',
        value: 'productChineseName',
        sortable: false
      },
      {
        text: 'ASIN',
        value: 'asin',
        sortable: false
      },
      {
        text: '关键词',
        value: 'keywords',
        sortable: false
      },
      {
        text: '关键词所在页数',
        value: 'keywordsPage',
        sortable: false
      },
      {
        text: '期望每日单数',
        value: 'dailyOrders',
        sortable: false
      },
      {
        text: '总单数',
        value: 'totalOrders',
        sortable: false
      },
      {
        text: '评价类型',
        value: 'reviewType',
        sortable: false
      },
      {
        text: '备注',
        value: 'clientRemark',
        sortable: false
      },
      {
        text: '任务状态',
        value: 'reviewStatus',
        sortable: false
      },
      {
        text: '订单数',
        value: 'orders',
        sortable: false
      },
      // ------------------------ 反馈信息 ------------------------------
      {
        text: '税费',
        value: 'tax',
        sortable: false
      },
      {
        text: '汇率',
        value: 'exchangeRate',
        sortable: false
      },
      {
        text: '待退款金额',
        value: 'refund',
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
    reviewType: ['免评', 'rating', 'feedback', 'review', '点赞 & QA'],
    reviewStatus: ['已停止', '任务执行中', '已完成'],
    file: null,
    list: [],
    dialog: false,
    dialogDelete: false,
    dialogStop: false,
    dialogOrder: false,
    valid: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    },
    editedIndex: -1,
    listItem: {
      platform: '亚马逊',
      country: '美国',
      reviewType: 'review' // 默认留评
    }
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
        .model('users.review')
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
        this.listItem = {
          platform: '亚马逊',
          country: '美国',
          reviewType: 'review' // 默认留评
        }
        this.editedIndex = -1
      })
    },
    async copyItem(item) {
      // 税费，汇率，待退款金额，任务状态，订单，不复制
      delete item['tax']
      delete item['refund']
      delete item['orders']
      delete item['exchangeRate']
      delete item['reviewStatus']
      this.listItem = Object.assign({}, item)
      await this.addItem()
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
          content: '添加成功，我们的工作人员马上会处理'
        })
        await this.getList()
        this.closeAdd()
        this.$sendMessage({
          msgtype: 'markdown',
          markdown: {
            content:
              '<font color="warning">测评管理-有新的需求</font>\n[点击查看](https://ducoz.com/admin/review)'
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
            .model('users.review')
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
          .model('users.review')
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
      delete params['orders']
      const { errors } = await this.$altogic.db
        .model('users.review')
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
        this.$sendMessage({
          msgtype: 'markdown',
          markdown: {
            content:
              '<font color="warning">测评管理-有更新</font>\n[点击查看](https://ducoz.com/admin/review)'
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
      if (/^image\//.test(this.file.type)) {
        // 上传主图
        const { publicPath } = await this.$uploadFile(this.file, 'review')
        this.$set(this.listItem, 'mainImage', publicPath)
      } else {
        // 批量导入
        const ab = await this.readFile()
        // parse workbook
        const wb = XLSX.read(ab)
        // update data
        const items = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        const params = items.map((item) =>
          this.getPureData({
            asin: item['ASIN'],
            price: item['售价'],
            country: item['国家'],
            platform: item['平台'],
            currency: item['币种'],
            totalOrders: item['总单数'],
            mainImage: this.isUrl(item['主图'])
              ? item['主图']
              : 'https://placehold.co/600x400',
            keywords: item['关键词'],
            listing: item['Listing链接'],
            reviewType: item['评价类型'],
            keywordsPage: item['关键词所在页'],
            dailyOrders: item['期望每日单数'],
            productChineseName: item['产品中文名']
          })
        )
        for (let data of params) {
          const { errors } = await this.$altogic.db
            .model('users.review')
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
          content: '导入成功，我们的工作人员会处理的'
        })
        await this.getList()
      }
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
          平台: item['platform'],
          国家: item['country'],
          币种: item['currency'],
          售价: item['price'],
          ASIN: item['asin'],
          产品中文名: item['productChineseName'],
          关键词: item['keywords'],
          关键词所在页: item['keywordsPage'],
          期望每日单数: item['dailyOrders'],
          总单数: item['totalOrders'],
          主图: item['mainImage'],
          Listing链接: item['listing'],
          评价类型: item['reviewType'],
          // 反馈信息
          税费: item['tax'],
          汇率: item['exchangeRate'],
          待退款金额: item['refund']
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, '多泽跨境-测评模板')
        const now = Date.now()
        XLSX.writeFileXLSX(wb, `多泽跨境-测评-${now}.xlsx`)
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
    },
    stopReview(item) {
      this.editedIndex = this.list.indexOf(item)
      if (this.editedIndex > -1) {
        this.listItem = Object.assign({}, item)
        this.dialogStop = true
      }
    },
    async stopReviewConfirm() {
      const { errors } = await this.$altogic.db
        .model('users.review')
        .object(this.listItem._id)
        .update({
          reviewStatus: this.reviewStatus[0]
        })
      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        await this.getList()
        this.dialogStop = false
      }
    },
    viewOrders(item) {
      this.editedIndex = this.list.indexOf(item)
      if (this.editedIndex > -1) {
        this.listItem = Object.assign({}, item)
        this.dialogOrder = true
      }
    }
  }
}
</script>
