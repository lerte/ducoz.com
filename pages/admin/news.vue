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
            <template #activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon left> mdi-plus </v-icon>添加新闻
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dense>
                <span class="headline">{{ formTitle }}新闻</span>
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
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="图片地址"
                          v-model="listItem.cover"
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
                              <v-icon left v-if="listItem.cover">
                                mdi-image
                              </v-icon>
                              上传封面
                            </v-btn>
                          </template>
                          <v-img
                            max-height="320"
                            max-width="320"
                            v-if="listItem.cover"
                            :src="listItem.cover"
                            :lazy-src="listItem.cover"
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
                          label="标题"
                          :rules="[rules.required]"
                          v-model="listItem.title"
                        />
                      </v-col>
                      <v-col cols="12">
                        <Editor v-model="listItem.content" v-if="dialog" />
                      </v-col>
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

      <template #[`item.cover`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-img
              height="80"
              width="80"
              v-on="on"
              v-bind="attrs"
              @click.stop="$copy(item.cover)"
              :src="item.cover"
            />
          </template>
          <v-img max-height="600" max-width="600" :src="item.cover" />
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
              @click.stop
              :to="`/news/${item._id}`"
            >
              <v-icon small> mdi-apple-safari </v-icon>
            </v-btn>
          </template>
          <span>在前台预览</span>
        </v-tooltip>
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
export default {
  name: 'news',
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
        text: '封面',
        value: 'cover',
        sortable: false
      },
      {
        text: '标题',
        value: 'title',
        sortable: false,
        searchable: true
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
    file: null,
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
      },
      deep: true
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex == -1 ? '添加' : '编辑'
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const { data, errors } = await this.$altogic.db
        .model('news')
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
    uploadFile() {
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
      const { publicPath } = await this.$uploadFile(this.file, 'news')
      this.$set(this.listItem, 'cover', publicPath)
      this.uploading = false
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
        .model('news')
        .object()
        .create(params)
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
            .model('news')
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
          .model('news')
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
        .model('news')
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
