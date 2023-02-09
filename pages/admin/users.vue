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
                <v-icon left> mdi-plus </v-icon>添加账号
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dense>
                <span class="headline">{{ formTitle }}账号</span>
                <v-spacer></v-spacer>
                <v-icon @click="closeAdd">mdi-close</v-icon>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="用户名"
                          :rules="[rules.required]"
                          v-model="listItem.name"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="邮箱"
                          :rules="[rules.required]"
                          v-model="listItem.email"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          outlined
                          clearable
                          hide-details
                          label="密码"
                          :rules="[rules.required]"
                          v-model="listItem.password"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="[
                            { value: true, text: '是' },
                            { value: false, text: '否' }
                          ]"
                          chips
                          dense
                          outlined
                          clearable
                          small-chips
                          hide-details
                          label="管理员"
                          v-model="listItem.isAdmin"
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
        <span @click.stop="$copy(item._id)">
          {{ item._id }}
        </span>
      </template>

      <template #[`item.profilePicture`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              height="80"
              width="80"
              v-on="on"
              v-bind="attrs"
              :src="item.profilePicture | avatar(item.name)"
            />
          </template>
          <v-img
            max-height="600"
            max-width="600"
            :src="item.profilePicture | avatar(item.name)"
          />
        </v-tooltip>
      </template>

      <template #[`item.emailVerified`]="{ item }">
        <v-chip
          label
          small
          :color="item.emailVerified ? 'success' : 'secondary'"
          text-color="white"
        >
          {{ item.emailVerified ? '是' : '否' }}
        </v-chip>
      </template>

      <template #[`item.isAdmin`]="{ item }">
        <v-chip
          label
          small
          :color="item.isAdmin ? 'success' : 'secondary'"
          text-color="white"
        >
          {{ item.isAdmin ? '是' : '否' }}
        </v-chip>
      </template>

      <template #[`item.signUpAt`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.signUpAt | format }}
            </span>
          </template>
          <span>{{ item.signUpAt }}</span>
        </v-tooltip>
      </template>
      <template #[`item.lastLoginAt`]="{ item }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.lastLoginAt | format }}
            </span>
          </template>
          <span>{{ item.lastLoginAt }}</span>
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
  </v-container>
</template>

<script>
export default {
  name: 'users',
  layout: 'admin',
  filters: {
    avatar(profilePicture, name) {
      return profilePicture || 'https://ui-avatars.com/api/?name=' + name
    }
  },
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
        text: '头像',
        value: 'profilePicture',
        sortable: false
      },
      {
        text: '用户名',
        value: 'name',
        sortable: false,
        searchable: true
      },
      {
        text: '邮箱',
        value: 'email',
        sortable: false,
        searchable: true
      },
      {
        text: '邮箱是否验证',
        value: 'emailVerified',
        sortable: false,
        searchable: true
      },
      {
        text: '注册时间',
        value: 'signUpAt',
        sortable: false
      },
      {
        text: '最后登录时间',
        value: 'lastLoginAt',
        sortable: false
      },
      {
        text: '管理员',
        value: 'isAdmin',
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
    listItem: {},
    searchParams: {}
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
        if (param == 'name' || param == 'email') {
          params.push(
            `INCLUDES(${param}, "${this.searchParams[param]}", false)`
          )
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
        .model('users')
        .filter(params)
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
