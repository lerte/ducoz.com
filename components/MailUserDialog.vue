<template>
  <v-dialog persistent scrollable max-width="720" v-model="dialog">
    <v-card>
      <v-toolbar dense>
        <span class="headline">{{ formTitle }}</span>
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  chips
                  outlined
                  hide-details
                  label="邮箱"
                  :rules="[rules.email]"
                  v-model="userItem.email"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  chips
                  outlined
                  hide-details
                  label="国家"
                  v-model="userItem.country"
                  :items="require('@/assets/json/countries.json')"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  chips
                  outlined
                  hide-details
                  label="品牌"
                  v-model="userItem.brand"
                  :items="require('@/assets/json/brand.json')"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  chips
                  outlined
                  hide-details
                  label="平台"
                  v-model="userItem.platform"
                  :items="require('@/assets/json/platform.json')"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  chips
                  outlined
                  hide-details
                  label="来源"
                  v-model="userItem.from"
                  :items="require('@/assets/json/from.json')"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  chips
                  outlined
                  hide-details
                  label="名字"
                  v-model="userItem.name"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  chips
                  outlined
                  hide-details
                  label="昵称"
                  v-model="userItem.nickname"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  dense
                  chips
                  outlined
                  hide-details
                  label="性别"
                  :items="['男', '女']"
                  v-model="userItem.gender"
                />
              </v-col>
              <v-col cols="12">
                <DatePicker label="生日" v-model="userItem.birthday" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  chips
                  outlined
                  hide-details
                  label="手机号"
                  v-model="userItem.mobile"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  chips
                  outlined
                  hide-details
                  label="标签"
                  v-model="userItem.tags"
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
          color="success"
          @click="submit"
          :loading="loading"
          :disabled="!valid || loading"
        >
          提交
        </v-btn>
        <v-btn color="secondary" @click="close"> 取消 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'mail-user-dialog',
  props: {
    dialog: {
      type: Boolean
    },
    listItem: {
      type: Object,
      required: true
    }
  },
  model: {
    prop: 'dialog'
  },
  watch: {
    dialog: {
      handler(val) {
        if (val) {
          this.userItem = Object.assign({}, this.listItem)
        }
      },
      immediate: true
    }
  },
  data: () => ({
    loading: false,
    userItem: {},
    valid: false,
    rules: {
      email: (v) => {
        if (
          v &&
          v.length > 0 &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
        ) {
          return true
        } else {
          return '邮箱地址不正确'
        }
      }
    }
  }),
  computed: {
    formTitle() {
      if (this.userItem._id) {
        return '编辑邮箱信息'
      } else {
        return '添加邮箱信息'
      }
    }
  },
  methods: {
    async submit() {
      if (this.userItem._id) {
        // 编辑邮箱信息
        await this.updateItem()
      } else {
        // 添加邮箱信息
        await this.addItem()
      }
    },
    async addItem() {
      this.loading = true
      const data = Object.assign({}, this.userItem)
      const params = this.getPureData(data)
      const { errors } = await this.$altogic.db.model('mails').create(params)

      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          content: '添加成功',
          color: 'success'
        })
        this.$emit('updateList', true)
      }
      this.userItem = {}
      this.loading = false
    },
    async updateItem() {
      this.loading = true
      const data = Object.assign({}, this.userItem)
      const params = this.getPureData(data)
      delete params['createdAt']
      delete params['updatedAt']
      const { errors } = await this.$altogic.db
        .model('mails')
        .object(params._id)
        .update(params)

      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          content: '更新成功',
          color: 'success'
        })
        this.$emit('updateList', true)
      }
      this.loading = false
      this.close()
    },
    close() {
      // 关闭dialog
      this.$emit('input', false)
    }
  }
}
</script>
