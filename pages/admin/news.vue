<template>
  <v-container>
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
                <v-icon left> mdi-plus </v-icon>添加新闻
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dense>
                <span class="headline">{{ formTitle }}新闻</span>
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
                          label="图片地址"
                          v-model="listItem.cover"
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
                        <v-textarea
                          outlined
                          auto-grow
                          hide-details
                          label="内容"
                          row-height="15"
                          :rules="[rules.required]"
                          v-model="listItem.content"
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
        <span @click="$copy(item._id)">
          {{ item._id }}
        </span>
      </template>

      <template #[`item.cover`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              height="80"
              width="80"
              v-on="on"
              v-bind="attrs"
              @click="$copy(item.cover)"
              :src="item.cover"
            />
          </template>
          <v-img max-height="600" max-width="600" :src="item.cover" />
          <p class="text-center">点击即可复制地址</p>
        </v-tooltip>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          fab
          x-small
          class="mr-2"
          min-width="0"
          color="primary"
          @click="editItem(item)"
        >
          <v-icon small> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          fab
          x-small
          min-width="0"
          color="error"
          @click="deleteItem(item)"
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
  name: 'news',
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
        text: '内容',
        value: 'content',
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
      { text: '操作', value: 'actions' }
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
    ...mapState(['searchItem', 'searchText', 'searching']),
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
      const { countInfo, result } = await this.$http.$get(
        `https://ducoz.c1-asia-se.altogic.com/e:63d940c9a1ac9f2d382d6552/news`
      )
      this.totalCount = countInfo.count
      this.list = result
      this.loading = false
      this.$store.commit('SET_SEARCHING', false)
    },
    uploadFile() {
      this.$nextTick(() => {
        this.$refs.uploadFile.$refs.input.click()
      })
    },
    async fileChange() {
      this.uploading = true
      this.$notifier.showMessage({
        content: '文件上传中...',
        color: 'secondary'
      })
      this.$set(this.listItem, 'cover', 'todo')
      this.uploading = false
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
            content: '请选择要删除的字典'
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
      const id = params['_id']
      delete params['id']
      const { errors } = await this.$altogic.db
        .model('news')
        .object(id)
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
