<template>
  <v-container fluid>
    <v-file-input
      class="d-none"
      accept=".json"
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
          <v-menu bottom offset-y transition="scale-transition">
            <template #activator="{ attrs, on }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                color="success"
                :disabled="importFileName"
              >
                <v-icon left> mdi-import </v-icon>
                {{ importFileName || '批量导入' }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-btn
                  color="primary"
                  @click="importJSON"
                  :loading="uploading"
                  :disabled="uploading"
                >
                  <v-icon left> mdi-file </v-icon> 选择单个文件
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn
                  color="primary"
                  @click="importFolder"
                  :loading="uploading"
                  :disabled="uploading"
                >
                  <v-icon left> mdi-folder </v-icon> 选择文件夹
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
          <Search
            ref="search"
            @doSearch="doSearch"
            :headers="headers"
            :dicts="{ country }"
          />
        </v-toolbar>
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
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading"
                @click="deleteItemConfirm"
              >
                确定
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider />
      </template>

      <template #[`item.country`]="{ item }">
        <Country :country="item.country" />
      </template>

      <template #[`item.summary`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.summary)">
              {{ item.summary | ellipsis(10) }}
            </span>
          </template>
          <span>{{ item.summary }}</span>
        </v-tooltip>
      </template>

      <template #[`item.name`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.name)">
              {{ item.name | ellipsis(10) }}
            </span>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </template>

      <template #[`item.wechat`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.wechat)">
              {{ item.wechat | ellipsis(10) }}
            </span>
          </template>
          <span>{{ item.wechat }}</span>
        </v-tooltip>
      </template>

      <template #[`item.email`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.email)">
              {{ item.email | ellipsis(10) }}
            </span>
          </template>
          <span>{{ item.email }}</span>
        </v-tooltip>
      </template>

      <template #[`item.facebookUrl`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.facebookUrl)">
              {{ item.facebookUrl | ellipsis(10) }}
            </span>
          </template>
          <span>{{ item.facebookUrl }}</span>
        </v-tooltip>
      </template>

      <template #[`item.url`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.url)">
              {{ item.url | ellipsis(10) }}
            </span>
          </template>
          <span>{{ item.url }}</span>
        </v-tooltip>
      </template>

      <template #[`item.twitterIdCode`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" @click="$copy(item.twitterIdCode)">
              {{ item.twitterIdCode | ellipsis(10) }}
            </span>
          </template>
          <span>{{ item.twitterIdCode }}</span>
        </v-tooltip>
      </template>

      <template #[`item.createdTime`]="{ item }">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
              {{ item.createdTime | format }}
            </span>
          </template>
          <span>{{ item.createdTime }}</span>
        </v-tooltip>
      </template>

      <template #[`item.actions`]="{ item }">
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
import dayjs from 'dayjs'
export default {
  name: 'blacklist',
  layout: 'admin',
  data: () => ({
    loading: true,
    totalCount: 0,
    selected: [],
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      {
        text: 'Id',
        value: 'id',
        sortable: false,
        searchable: true
      },
      {
        text: '国家',
        value: 'country',
        sortable: false,
        searchable: true
      },
      {
        text: '被曝光人',
        value: 'name',
        sortable: false
      },
      {
        text: '投诉内容',
        value: 'summary',
        sortable: false
      },
      {
        text: '微信',
        value: 'wechat',
        sortable: false
      },
      {
        text: '邮箱',
        value: 'email',
        sortable: false,
        searchable: true
      },
      {
        text: 'FB主页',
        value: 'facebookUrl',
        sortable: false
      },
      {
        text: '亚马逊主页',
        value: 'url',
        sortable: false
      },
      {
        text: '推特ID',
        value: 'twitterIdCode',
        sortable: false
      },
      {
        text: '发布时间',
        value: 'createdTime',
        sortable: false
      },
      { text: '操作', value: 'actions', sortable: false }
    ],
    country: require('@/assets/json/countries.json'),
    file: null,
    importFileName: null,
    uploading: false,
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
        .model('blacklist')
        .filter(params)
        .sort('createdTime', 'desc')
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
        .model('blacklist')
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
    deleteItem(item) {
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
      this.loading = true
      if (this.listItem.length) {
        // 删除多个
        for (let item of this.listItem) {
          const { errors } = await this.$altogic.db
            .model('blacklist')
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
          .model('blacklist')
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
      this.selected = []
      this.loading = false
      this.closeDelete()
    },
    async updateItem() {
      const data = Object.assign({}, this.listItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db
        .model('blacklist')
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
    importJSON() {
      this.file = null
      this.$nextTick(() => {
        this.$refs.uploadFile.$refs.input.click()
      })
    },
    isValidDate(d) {
      return d instanceof Date && !isNaN(d)
    },
    async fileChange() {
      if (!this.file) {
        return
      }
      const fileName = this.file.name.slice(0, 10)
      const datetime = new Date(fileName)
      if (!this.isValidDate(datetime)) {
        this.$notifier.showMessage({
          color: 'error',
          content: '文件名不对，不符合日期格式'
        })
        return
      }
      this.uploading = true
      this.$notifier.showMessage({
        content: '文件上传中...',
        color: 'secondary'
      })
      await this.importFile(this.file)
      this.$notifier.showMessage({
        color: 'success',
        content: '导入成功'
      })
      await this.getList()
      this.uploading = false
    },
    readAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file)
      })
    },
    async importFile(file) {
      this.importFileName = file.name
      const fileName = file.name.slice(0, 10)
      const text = await this.readAsText(file)
      const { list } = JSON.parse(text)
      const data = list.map((item, index) => {
        let createdTime = item.createdTime
        if (!this.isValidDate(new Date(createdTime))) {
          // 如果数据里面的创建时间不符合日期格式，就使用文件名的日期
          createdTime = dayjs(fileName).add(60 * 24 - (index + 1), 'minute')
        }
        return this.getPureData({
          id: item['id'],
          createdTime,
          country: item['marketName'],
          summary: item['summary'],
          wechat: item['reviewerExposure']['wechat'],
          email: item['reviewerExposure']['email'],
          facebookUrl: item['reviewerExposure']['facebookUrl'],
          url: item['reviewerExposure']['url'],
          twitterIdCode: item['reviewerExposure']['twitterIdCode'],
          name: item['reviewerExposure']['name']
        })
      })
      for (let params of data) {
        const { errors } = await this.$altogic.db
          .model('blacklist')
          .object()
          .create(params)
        if (errors) {
          this.$notifier.showMessage({
            content: errors,
            color: 'error'
          })
        }
      }
      this.importFileName = null
    },
    async importFolder() {
      try {
        const dirHandle = await window.showDirectoryPicker()
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile()
            await this.importFile(file)
          }
        }
      } catch (error) {
        this.$notifier.showMessage({
          content: error.message,
          color: 'error'
        })
      }
    }
  }
}
</script>
