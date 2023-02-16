<template>
  <v-container fluid>
    <v-data-table
      :items="list"
      item-key="_id"
      :headers="headers"
      :loading="loading"
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
          <Search
            ref="search"
            @doSearch="doSearch"
            :headers="headers"
            :dicts="{ country }"
          />
        </v-toolbar>
        <v-divider />
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
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'blacklist',
  layout: 'user',
  data: () => ({
    loading: true,
    totalCount: 0,
    options: {
      page: 1,
      itemsPerPage: 12
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
      }
    ],
    country: require('@/assets/json/countries.json'),
    list: [],
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
    }
  }
}
</script>
