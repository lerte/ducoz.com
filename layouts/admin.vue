<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-text-field
        solo
        dense
        clearable
        hide-details
        label="搜索"
        v-model="searchText"
        append-icon="mdi-magnify"
        @click:append="doSearching"
        @keyup.enter.native="doSearching"
      >
        <template v-slot:prepend-inner>
          <v-select
            solo
            dense
            hide-details
            label="搜索条件"
            class="inner-select"
            v-model="searchItem"
            :items="searchItems.filter((i) => i.searchable == true)"
          ></v-select>
        </template>
      </v-text-field>
      <v-spacer />
      <v-menu bottom offset-y open-on-hover transition="scale-transition">
        <template v-slot:activator="{ attrs, on }">
          <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <a href="/api/logout">
          <v-btn> <v-icon>mdi-logout</v-icon>退出登录 </v-btn>
        </a>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <Snackbar />
  </v-app>
</template>

<style lang="scss">
.inner-select {
  width: 120px;
  &.v-text-field--solo:not(.v-text-field--solo-flat)
    > .v-input__control
    > .v-input__slot {
    box-shadow: none;
  }
}
</style>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AdminLayout',
  middleware: ['auth'],
  head: () => ({
    title: '多泽跨境 | 管理后台'
  }),
  data: () => ({
    clipped: true,
    drawer: true,
    fixed: false,
    items: [
      {
        icon: 'mdi-chart-bubble',
        title: '信息管理',
        to: '/admin/info'
      },
      {
        icon: 'mdi-newspaper-variant-outline',
        title: '新闻管理',
        to: '/admin/news'
      }
    ],
    miniVariant: false,
    title: '后台'
  }),
  computed: {
    ...mapState(['searchItems', 'sessionToken']),
    searchText: {
      get() {
        return this.$store.state.searchText
      },
      set(val) {
        this.$store.commit('SET_SEARCH_TEXT', val && val.trim())
      }
    },
    searchItem: {
      get() {
        return this.$store.state.searchItem
      },
      set(val) {
        this.$store.commit('SET_SEARCH_ITEM', val)
      }
    }
  },
  methods: {
    doSearching() {
      if (this.searchItem && this.searchText) {
        this.$store.commit('SET_SEARCHING', true)
      }
    }
  }
}
</script>
