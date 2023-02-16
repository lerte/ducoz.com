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
          <v-menu bottom offset-y transition="scale-transition">
            <template #activator="{ attrs, on }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon left> mdi-plus </v-icon>提交开户信息
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-btn dark @click="dialog = true">
                  <v-icon left>mdi-home</v-icon>Facebook国内广告开户
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn dark color="secondary" @click="developTips">
                  <v-icon left>mdi-web</v-icon>Facebook海外广告开户
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
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
          v-if="!item.tax"
        >
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog persistent v-model="dialog" max-width="720" scrollable>
      <v-card>
        <v-toolbar dense>
          <span class="headline">{{ formTitle }}开户信息</span>
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
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="姓"
                    :rules="[rules.required]"
                    v-model="listItem.lastName"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="名"
                    :rules="[rules.required]"
                    v-model="listItem.firstName"
                  />
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    dense
                    outlined
                    clearable
                    hide-details
                    label="性别"
                    :rules="[rules.required]"
                    v-model="listItem.sex"
                    :items="['男', '女']"
                  />
                </v-col>
                <v-col cols="6">
                  <DatePicker label="生日" v-model="listItem.birthday" />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    outlined
                    clearable
                    hide-details
                    label="行业类型"
                    :rules="[rules.required]"
                    v-model="listItem.sex"
                    :items="require('@/assets/json/industries.json')"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="营业执照"
                    :rules="[rules.required]"
                    v-model="listItem.businessLicense"
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
                        <v-icon left v-if="listItem.businessLicense">
                          mdi-image
                        </v-icon>
                        上传营业执照
                      </v-btn>
                    </template>
                    <v-img
                      max-height="320"
                      max-width="320"
                      v-if="listItem.businessLicense"
                      :src="listItem.businessLicense"
                      :lazy-src="listItem.businessLicense"
                    />
                    <span v-else>请上传图片</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    clearable
                    hide-details
                    label="营业执照信息"
                    :rules="[rules.required]"
                    v-model="listItem.businessLicense"
                  />
                </v-col>
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
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'facebook-ad-account',
  layout: 'user',
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
        text: '姓',
        value: 'lastName',
        sortable: false
      },
      {
        text: '名',
        value: 'firstName',
        sortable: false
      },
      {
        text: '性别',
        value: 'sex',
        sortable: false
      },
      {
        text: '行业类型',
        value: 'industryType',
        sortable: false
      },
      {
        text: '上传你的营业执照',
        value: 'businessLicense',
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
        .model('users.facebook_ad_account')
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
      const { errors } = await this.$altogic.db
        .model('users.review')
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
        // 上传营业执照
        const { publicPath } = await this.$uploadFile(this.file, 'review')
        this.$set(this.listItem, 'mainImage', publicPath)
      }
    }
  }
}
</script>
