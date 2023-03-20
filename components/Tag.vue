<template>
  <v-data-table
    :headers="headers"
    :items="tags"
    :search="search"
    :loading="loading"
    class="elevation-1"
    :options.sync="options"
    :footer-props="require('@/assets/json/footer-props.json')"
  >
    <template #top>
      <v-toolbar flat dense>
        <v-btn color="primary" dark class="mr-2" @click="getList">
          <v-icon left> mdi-refresh </v-icon>刷新
        </v-btn>
        <v-btn dark class="mr-2" color="secondary" @click="addItem">
          <v-icon left> mdi-plus </v-icon>添加标签
        </v-btn>
        <v-spacer />
        <v-text-field
          dense
          chips
          outlined
          clearable
          single-line
          hide-details
          label="搜索"
          v-model="search"
          append-icon="mdi-magnify"
        />
        <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
          <v-card>
            <v-toolbar dense>
              <span class="headline"> {{ formTitle }} </span>
              <v-spacer />
              <v-icon @click="close">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      chips
                      outlined
                      clearable
                      single-line
                      hide-details
                      label="标签"
                      v-model="editedItem.TagName"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn color="secondary" @click="close"> 取消 </v-btn>
              <v-btn color="primary" @click="save">确定</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-divider />
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

      <v-dialog v-model="dialogDelete" width="auto">
        <template #activator="{ on, attrs }">
          <v-btn
            fab
            v-on="on"
            v-bind="attrs"
            x-small
            min-width="0"
            color="error"
            @click.stop="deleteItem(item)"
          >
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5"> 你确定要删除这个标签吗? </v-card-title>
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
    </template>

    <template #no-data>
      <v-btn color="primary" @click="addItem">添加标签</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'tag',
  data: () => ({
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      // { text: '标签ID', value: 'TagId' },
      { text: '标签', value: 'TagName' },
      { text: '操作', value: 'actions', sortable: false }
    ],
    tags: [],
    search: '',
    dialog: false,
    dialogDelete: false,
    formTitle: '添加标签',
    editedItem: {}
  }),
  watch: {
    options: {
      async handler() {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    addItem() {
      this.formTitle = '添加标签'
      this.dialog = true
    },
    editItem(item) {
      this.formTitle = '修改标签'
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      const { TagId } = this.editedItem
      this.loading = true
      await fetch(`/api/mail/DeleteTag?TagId=${TagId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await this.getList()
      this.loading = false
      this.dialogDelete = false
    },
    async save() {
      this.loading = true
      if (this.editedItem.TagId) {
        // 修改标签名称
        const params = new URLSearchParams({
          TagId: this.editedItem.TagId,
          TagName: this.editedItem.TagName
        })
        await fetch(`/api/mail/ModifyTag?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } else {
        // 添加标签
        const params = new URLSearchParams(this.editedItem)
        await fetch(`/api/mail/CreateTag?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      await this.getList()
      this.loading = false
      this.close()
    },
    close() {
      this.dialog = false
      this.formTitle = ''
      this.editedItem = {}
    },
    async getList() {
      this.loading = true
      const response = await fetch('/api/mail/QueryTagByParam', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { data, Code } = await response.json()
      if (Code) {
        this.$notifier.showMessage({
          content: `[${Code}]请重试`,
          color: 'error'
        })
      } else {
        this.tags = data.tag
      }
      this.loading = false
    }
  }
}
</script>
