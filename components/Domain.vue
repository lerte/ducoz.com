<template>
  <v-data-table
    :headers="headers"
    :items="domains"
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
          <v-icon left> mdi-plus </v-icon>添加域名
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
                      label="域名"
                      v-model="editedItem.DomainName"
                    />
                  </v-col>
                  <v-col cols="12" v-if="formTitle == '设置域名的SMTP的密码'">
                    <v-text-field
                      dense
                      chips
                      outlined
                      clearable
                      single-line
                      hide-details
                      label="设置域名的SMTP的密码"
                      v-model="editedItem.Password"
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

    <template #[`item.DomainStatus`]="{ item }">
      <v-chip small label :color="item.DomainStatus ? 'error' : 'success'">
        {{ DomainStatus[item.DomainStatus] }}
      </v-chip>
    </template>

    <template #[`item.CreateTime`]="{ item }">
      <v-tooltip right>
        <template #activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs">
            {{ item.CreateTime | format }}
          </span>
        </template>
        <span>{{ item.CreateTime | localTime }}</span>
      </v-tooltip>
    </template>

    <template #[`item.actions`]="{ item }">
      <v-btn
        fab
        x-small
        class="mr-2"
        min-width="0"
        :color="item.DomainStatus ? 'warning' : 'success'"
        @click.stop="checkItem(item)"
      >
        <v-icon small> mdi-check </v-icon>
      </v-btn>

      <v-dialog
        scrollable
        persistent
        width="960"
        v-model="dialogView"
        :retain-focus="false"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            fab
            x-small
            v-on="on"
            v-bind="attrs"
            class="mr-2"
            min-width="0"
            color="secondary"
            @click.stop="viewItem(item)"
          >
            <v-icon small> mdi-tune </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dense>
            <span class="headline">域名配置</span>
            <v-spacer />
            <v-icon @click="closeDesc">mdi-close</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-simple-table dense>
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">类型</th>
                    <th class="text-left">主机记录</th>
                    <th class="text-left">主域名</th>
                    <th class="text-left">记录值</th>
                    <th class="text-left">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>TXT</td>
                    <td>aliyundm</td>
                    <td>{{ descDomain.DomainName }}</td>
                    <td>{{ descDomain.DomainType }}</td>
                    <td>
                      <v-chip
                        small
                        label
                        :color="descDomain.DomainStatus ? 'error' : 'success'"
                      >
                        {{ descDomain.DomainStatus ? '待验证' : '验证通过' }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>TXT</td>
                    <td>@</td>
                    <td>{{ descDomain.DomainName }}</td>
                    <td>{{ descDomain.DnsSpf }}</td>
                    <td>
                      <v-chip
                        small
                        label
                        :color="descDomain.SpfAuthStatus ? 'error' : 'success'"
                      >
                        {{ descDomain.SpfAuthStatus ? '待验证' : '验证通过' }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>MX</td>
                    <td>@</td>
                    <td>{{ descDomain.DomainName }}</td>
                    <td>{{ descDomain.MxRecord }}</td>
                    <td>
                      <v-chip
                        small
                        label
                        :color="descDomain.MxAuthStatus ? 'error' : 'success'"
                      >
                        {{ descDomain.MxAuthStatus ? '待验证' : '验证通过' }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>CNAME</td>
                    <td>{{ descDomain.CnameRecord }}</td>
                    <td>{{ descDomain.DomainName }}</td>
                    <td>{{ descDomain.TracefRecord }}</td>
                    <td>
                      <v-chip
                        small
                        label
                        :color="
                          descDomain.CnameAuthStatus ? 'error' : 'success'
                        "
                      >
                        {{ descDomain.CnameAuthStatus ? '待验证' : '验证通过' }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="success" dark class="mr-2" @click="descItem">
              <v-icon left> mdi-refresh </v-icon>刷新
            </v-btn>
            <v-spacer />
            <v-btn color="primary" @click="closeDesc"> 关闭 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    </template>

    <template #no-data>
      <v-btn color="primary" @click="addItem">添加域名</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'domain',
  data: () => ({
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10
    },
    headers: [
      // { text: '域名ID', value: 'DomainId' },
      { text: '域名', value: 'DomainName' },
      { text: '域名状态', value: 'DomainStatus' },
      { text: '创建时间', value: 'CreateTime' },
      { text: '操作', value: 'actions', sortable: false }
    ],
    domains: [],
    DomainStatus: [
      '可用，已验证通过',
      '不可用，验证未通过',
      '可使用，未做cname，未备案',
      '可使用，未备案',
      '可使用，未做cname'
    ],
    search: '',
    dialog: false,
    dialogView: false,
    descDomain: {},
    formTitle: '添加域名',
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
      this.formTitle = '添加域名'
      this.dialog = true
    },
    editItem(item) {
      this.formTitle = '设置域名的SMTP的密码'
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async save() {
      this.loading = true
      if (this.formTitle == '设置域名的SMTP的密码') {
        // 设置域名的SMTP的密码
        const params = new URLSearchParams({
          DomainName: this.editedItem.DomainName,
          Password: this.editedItem.Password
        })
        const response = await fetch(`/api/mail/ModifyPWByDomain?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const { Code } = await response.json()
        let message = ''
        switch (Code) {
          case 'InvalidDomainPassword.Malformed':
            message = '密码格式错误'
            break
          case 'InvalidDomainPassword.equalcurrent':
            message = '域名格式错误'
            break
          case 'InvalidDomainName.Malformed':
            message = '不能与当前密码重复'
            break
          case 'InvalidDomain.NotFound':
            message = '域名不存在'
            break
          case 'InvalidDomainStatus.Malformed':
            message = '域名状态非法'
            break
          case 'InvalidDomainId.Malformed':
            message = '域名ID错误'
            break
          default:
            break
        }
        this.$notifier.showMessage({
          content: message,
          color: 'error'
        })
      } else {
        // 添加域名
        const params = new URLSearchParams({
          DomainName: this.editedItem.DomainName
        })
        await fetch(`/api/mail/CreateDomain?${params}`, {
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
      const response = await fetch('/api/mail/QueryDomainByParam', {
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
        this.domains = data.domain
      }
      this.loading = false
    },
    async checkItem(item) {
      const response = await fetch(
        `/api/mail/CheckDomain?DomainId=${item.DomainId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const { Code, DomainStatus } = await response.json()
      if (Code) {
        this.$notifier.showMessage({
          content: '[签名不匹配]-请重试',
          color: 'error'
        })
      } else {
        this.$notifier.showMessage({
          content: this.DomainStatus[DomainStatus],
          color: DomainStatus ? 'error' : 'success'
        })
      }
    },
    closeDesc() {
      this.dialogView = false
      this.descDomain = {}
    },
    async viewItem(item) {
      this.editedItem = Object.assign({}, item)
      await this.descItem()
      this.dialogView = true
    },
    async descItem() {
      const { DomainId } = this.editedItem
      this.loading = true
      const response = await fetch(
        `/api/mail/DescDomain?DomainId=${DomainId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      if (data.Code) {
        this.$notifier.showMessage({
          content: '[签名不匹配]-请重试',
          color: 'error'
        })
      } else {
        this.descDomain = data
        this.dialogView = true
      }
      this.loading = false
    }
  }
}
</script>
