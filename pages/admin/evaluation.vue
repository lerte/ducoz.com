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
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon left> mdi-plus </v-icon>提交信息
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
                          hide-details
                          label="ASIN"
                          :rules="[rules.required]"
                          v-model="listItem.asin"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
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
                          hide-details
                          type="number"
                          label="总单数"
                          :rules="[rules.required]"
                          v-model="listItem.orders"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="产品主图"
                          :rules="[rules.required]"
                          v-model="listItem.mainImage"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              block
                              v-on="on"
                              v-bind="attrs"
                              color="primary"
                              :disabled="uploading"
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
                          hide-details
                          label="是否免评"
                          :rules="[rules.required]"
                          v-model="listItem.isEvaluation"
                          :items="[
                            { value: true, text: '是' },
                            { value: false, text: '否' }
                          ]"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          outlined
                          auto-grow
                          hide-details
                          label="客户备注"
                          row-height="15"
                          v-model="listItem.clientRemark"
                        />
                      </v-col>

                      <v-card width="100%" v-if="editedIndex > -1">
                        <v-card-title> 反馈信息 </v-card-title>
                        <v-divider />
                        <v-card-text>
                          <v-row>
                            <v-col cols="6">
                              <v-text-field
                                dense
                                outlined
                                clearable
                                hide-details
                                label="税费"
                                v-model="listItem.tax"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                dense
                                outlined
                                clearable
                                hide-details
                                label="汇率"
                                v-model="listItem.exchangeRate"
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                auto-grow
                                hide-details
                                label="订单号"
                                row-height="15"
                                v-model="listItem.orderId"
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                auto-grow
                                hide-details
                                label="评价链接"
                                row-height="15"
                                v-model="listItem.reviewUrl"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-autocomplete
                                dense
                                outlined
                                clearable
                                hide-details
                                label="订单状态"
                                v-model="listItem.orderStatus"
                                :items="['未收本佣', '已收本佣', '已退佣金']"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-autocomplete
                                item
                                dense
                                outlined
                                clearable
                                hide-details
                                label="订单进度"
                                v-model="listItem.orderProgress"
                                :items="[
                                  '正在送测',
                                  '已完成',
                                  'rating',
                                  'feedback'
                                ]"
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                dense
                                outlined
                                clearable
                                hide-details
                                label="待退款金额"
                                v-model="listItem.refund"
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-divider />
                            </v-col>
                            <v-col cols="12">
                              <v-textarea
                                outlined
                                auto-grow
                                hide-details
                                label="备注"
                                row-height="15"
                                v-model="listItem.remark"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
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
          <a href="/ducoz-evaluation.xlsx" target="_blank">
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
          <Search ref="search" @doSearch="doSearch" :headers="headers" />
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
        <v-chip
          small
          label
          color="primary"
          @click.stop="setSearch({ key: '_id', value: item._id })"
        >
          {{ item._id }}
        </v-chip>
      </template>

      <template #[`item._parent`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              small
              label
              v-on="on"
              v-bind="attrs"
              color="secondary"
              @click.stop="setSearch({ key: '_parent', value: item._parent })"
            >
              {{ item._parent }}
            </v-chip>
          </template>
          <p class="text-center">{{ item.clientRemark }}</p>
        </v-tooltip>
      </template>

      <template #[`item.productChineseName`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.productChineseName }}
            </span>
          </template>
          <p class="text-center">{{ item.remark }}</p>
        </v-tooltip>
      </template>

      <template #[`item.asin`]="{ item }">
        <v-chip
          small
          label
          color="warning"
          @click.stop="setSearch({ key: 'asin', value: item.asin })"
        >
          {{ item.asin }}
        </v-chip>
      </template>

      <template #[`item.mainImage`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
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
        <span>
          {{ item.createdAt | format }}
        </span>
      </template>
      <template #[`item.updatedAt`]="{ item }">
        <span>
          {{ item.updatedAt | format }}
        </span>
      </template>

      <template #[`item.isEvaluation`]="{ item }">
        <v-chip
          label
          small
          :color="item.isEvaluation ? 'success' : 'secondary'"
          text-color="white"
        >
          {{ item.isEvaluation ? '是' : '否' }}
        </v-chip>
      </template>

      <template v-slot:[`item.orderId`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.orderId)">
              {{ item.orderId | ellipsis(28) }}
            </span>
          </template>
          <span>{{ item.orderId }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.reviewUrl`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
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
          v-if="!item.email || !item.orderId"
        >
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { read, utils, writeFileXLSX } from 'xlsx'
export default {
  name: 'evaluation',
  layout: 'admin',
  data: () => ({
    loading: true,
    uploading: false,
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
        sortable: false,
        searchable: true
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
        value: 'orders',
        sortable: false
      },
      {
        text: '是否免评',
        value: 'isEvaluation',
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
        text: '订单号',
        value: 'orderId',
        sortable: false
      },
      {
        text: '评价链接',
        value: 'reviewUrl',
        sortable: false
      },
      {
        text: '订单状态',
        value: 'orderStatus',
        sortable: false
      },
      {
        text: '订单进度',
        value: 'orderProgress',
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
    file: null,
    list: [],
    dialog: false,
    dialogDelete: false,
    valid: false,
    rules: {
      required: (value) => (value != null && value != undefined) || '必填项.'
    },
    editedIndex: -1,
    listItem: {
      platform: '亚马逊',
      country: '美国',
      isEvaluation: false // 默认不是免评
    },
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
    doSearch(params) {
      this.searchParams = Object.assign({}, params)
      if (this.options.page == 1) {
        this.getList()
      } else {
        this.options.page = 1
      }
    },
    setSearch(item) {
      this.$refs.search.setSearch(item)
    },
    getParams() {
      const params = []
      for (let param in this.searchParams) {
        if (param == 'status') {
          params.push(this.searchParams[param])
        } else {
          params.push(`${param} == "${this.searchParams[param]}"`)
        }
      }
      return params.join(' && ')
    },
    async getList() {
      this.loading = true
      const params = this.getParams()
      const { page, itemsPerPage } = this.options
      const { data, errors } = await this.$altogic.db
        .model('users.evaluation')
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
    getPureData(data) {
      for (var key in data) {
        if (data[key] == null || data[key] == undefined) {
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
        .model('users.evaluation')
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
            .model('users.evaluation')
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
          .model('users.evaluation')
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
        .model('users.evaluation')
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
      this.uploading = true
      this.$notifier.showMessage({
        content: '文件上传中...',
        color: 'secondary'
      })
      if (/^image\//.test(this.file.type)) {
        // 上传主图
        const { publicPath } = await this.$uploadFile(this.file, 'evaluation')
        this.$set(this.listItem, 'mainImage', publicPath)
      } else {
        // 批量导入
        const ab = await this.readFile()
        // parse workbook
        const wb = read(ab)
        // update data
        const items = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        const params = items.map((item) =>
          this.getPureData({
            asin: item['ASIN'],
            price: item['售价'],
            country: item['国家'],
            platform: item['平台'],
            currency: item['币种'],
            orders: item['总单数'],
            mainImage: item['主图'],
            keywords: item['关键词'],
            listing: item['Listing链接'],
            keywordsPage: item['关键词所在页'],
            dailyOrders: item['期望每日单数'],
            productChineseName: item['产品中文名'],
            isEvaluation: item['是否免评'] == '否' ? false : true
          })
        )
        for (let data of params) {
          const { errors } = await this.$altogic.db
            .model('users.evaluation')
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
          总单数: item['orders'],
          主图: item['mainImage'],
          Listing链接: item['listing'],
          是否免评: item['isEvaluation'] ? '是' : '否',
          // 反馈信息
          税费: item['tax'],
          汇率: item['exchangeRate'],
          订单号: item['orderId'],
          评价链接: item['reviewUrl'],
          订单状态: item['orderStatus'],
          订单进度: item['orderProgress'],
          待退款金额: item['refund']
        }))
        const ws = utils.json_to_sheet(data)
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, '多泽跨境-测评模板')
        const now = Date.now()
        writeFileXLSX(wb, `多泽跨境-测评-${now}.xlsx`)
        this.$notifier.showMessage({
          color: 'success',
          content: '导出成功'
        })
      } else {
        this.$notifier.showMessage({
          color: 'error',
          content: '请选择要删除的条目'
        })
      }
    }
  }
}
</script>
