<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="list"
      show-select
      v-model="selected"
      :options.sync="options"
      :server-items-length="totalCount"
      :loading="loading"
      item-key="id"
      class="elevation-1"
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
          <v-dialog persistent v-model="dialog" max-width="960" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon left> mdi-plus </v-icon>添加信息
              </v-btn>
            </template>
            <v-card>
              <v-toolbar>
                <span class="headline">{{ formTitle }}信息</span>
                <v-spacer></v-spacer>
                <v-icon @click="dialog = false">mdi-close</v-icon>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid">
                    <v-row>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="环境名称"
                          v-model="listItem.env_name"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="环境账号"
                          v-model="listItem.env_account"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="环境密码"
                          v-model="listItem.env_password"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="环境序号"
                          v-model="listItem.env_serial"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="账号昵称"
                          v-model="listItem.account_nick"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="平台"
                          v-model="listItem.platform"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="账号"
                          :rules="[rules.required]"
                          v-model="listItem.account"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="密码"
                          :rules="[rules.required]"
                          v-model="listItem.password"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="证件地址"
                          v-model="listItem.id_address"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="双重验证"
                          v-model="listItem.authenticator"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="商务管理平台ID"
                          v-model="listItem.bm_id"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="商务管理平台ID绑定邮箱"
                          v-model="listItem.bm_email"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="个人绑定手机"
                          v-model="listItem.personal_mobile"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="公司验证信息"
                          v-model="listItem.company_info"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="公司验证地址"
                          v-model="listItem.company_address"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="公司验证电话"
                          v-model="listItem.company_phone"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="公司验证网站"
                          v-model="listItem.company_website"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="绑定IP信息"
                          v-model="listItem.bind_ip"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="绑定IP到期时间"
                          v-model="listItem.bind_ip_expire"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="广告账户名称"
                          v-model="listItem.ad_account"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="广告账号状态"
                          v-model="listItem.ad_account_status"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="商务管理平台状态"
                          v-model="listItem.bm_status"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          dense
                          chips
                          outlined
                          clearable
                          small-chips
                          label="申述进度"
                          v-model="listItem.appeal_state"
                        >
                        </v-text-field>
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
              <v-card-title class="text-h5">{{
                `你确定要删除这${listItem.length || ''}条信息吗?`
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click="dialogDelete = false"
                  >取消</v-btn
                >
                <v-btn color="primary" @click="deleteItemConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider></v-divider>
      </template>

      <template v-for="header in headers" #[`item.${header.value}`]="{ item }">
        <span @click="$copy(item[header.value])" :key="header.value">{{
          item[header.value]
        }}</span>
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
  name: 'info',
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
        text: '环境名称',
        value: 'env_name',
        sortable: false,
        searchable: true
      },
      {
        text: '环境账号',
        value: 'env_account',
        sortable: false,
        searchable: true
      },
      {
        text: '环境密码',
        value: 'env_password',
        sortable: false,
        searchable: true
      },
      {
        text: '环境序列',
        value: 'env_serial',
        sortable: false,
        searchable: true
      },
      {
        text: '账号昵称',
        value: 'account_nick',
        sortable: false,
        searchable: true
      },
      {
        text: '平台',
        value: 'platform',
        sortable: false,
        searchable: true
      },
      {
        text: '账号',
        value: 'account',
        sortable: false,
        searchable: true
      },
      {
        text: '密码',
        value: 'password',
        sortable: false,
        searchable: true
      },
      {
        text: '证件地址',
        value: 'id_adress',
        sortable: false,
        searchable: true
      },
      {
        text: '双重验证',
        value: 'authenticator',
        sortable: false,
        searchable: true
      },
      {
        text: '商务管理平台ID',
        value: 'bm_id',
        sortable: false,
        searchable: true
      },
      {
        text: '商务管理平台ID绑定邮箱',
        value: 'bm_email',
        sortable: false,
        searchable: true
      },
      {
        text: '个人绑定手机',
        value: 'personal_phone',
        sortable: false,
        searchable: true
      },
      {
        text: '公司验证信息',
        value: 'company_info',
        sortable: false,
        searchable: true
      },
      {
        text: '公司验证地址',
        value: 'company_address',
        sortable: false,
        searchable: true
      },
      {
        text: '公司验证电话',
        value: 'company_phone',
        sortable: false,
        searchable: true
      },
      {
        text: '公司验证网站',
        value: 'company_website',
        sortable: false,
        searchable: true
      },
      {
        text: '绑定IP信息',
        value: 'bind_ip',
        sortable: false,
        searchable: true
      },
      {
        text: '绑定IP到期时间',
        value: 'bind_ip_expire',
        sortable: false,
        searchable: true
      },
      {
        text: '广告账号名称',
        value: 'ad_account',
        sortable: false,
        searchable: true
      },
      {
        text: '广告账号状态',
        value: 'ad_account_status',
        sortable: false,
        searchable: true
      },
      {
        text: '商务管理平台状态',
        value: 'bm_status',
        sortable: false,
        searchable: true
      },
      {
        text: '申述进度',
        value: 'appeal_state',
        sortable: false,
        searchable: true
      },
      { text: '操作', value: 'actions' }
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

      await new Promise((r) => setTimeout(r, 1500))
      this.totalCount = 0
      this.list = []

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
      await this.$http.$post('/api/info', params)
      await this.getList()
      this.closeAdd()
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
            content: '请选择要删除的字典',
            color: 'error'
          })
        }
      }
    },
    async deleteItemConfirm() {
      const options = {}
      if (this.listItem.length) {
        const ids = this.listItem.map((item) => item.id)
        options['ids'] = ids.join(',')
      } else {
        options['ids'] = this.listItem.id
      }
      await this.$del(`/api/info/${options.ids}`)
      await this.getList()
      this.closeDelete()
    },
    async updateItem() {
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      delete params['id']
      await this.$put(`/api/info/${this.listItem.id}`, params)
      await this.getList()
      this.closeAdd()
    }
  }
}
</script>
