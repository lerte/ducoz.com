<template>
  <v-app dark>
    <v-navigation-drawer
      app
      fixed
      v-model="drawer"
      :clipped="clipped"
      :mini-variant="miniVariant"
    >
      <v-list nav expand dense>
        <template v-for="item in items">
          <v-list-group
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.icon"
            v-if="item.children"
            :active-class="`secondary white--text`"
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :to="child.to"
              :active-class="`primary white--text`"
            >
              <v-list-item-icon v-if="child.icon">
                <v-icon>
                  {{ child.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-icon v-if="child.svg">
                <i class="icon" v-html="child.svg"></i>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :to="item.to"
            :key="item.title"
            :active-class="`primary white--text`"
          >
            <v-list-item-icon>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <NuxtLink to="/">
        <v-btn fab text>
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </NuxtLink>
      <v-menu bottom offset-y open-on-hover transition="scale-transition">
        <template #activator="{ attrs, on }">
          <v-btn class="ml-2" min-width="0" fab text v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <a href="/api/logout">
          <v-btn> <v-icon>mdi-logout</v-icon>退出登录 </v-btn>
        </a>
      </v-menu>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span> {{ new Date().getFullYear() }}&copy;</span>
      <strong>多泽跨境&reg;</strong>
    </v-footer>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserLayout',
  middleware: ['auth'],
  head: () => ({
    title: '多泽跨境 | 工作台'
  }),
  data: () => ({
    title: '工作台',
    clipped: true,
    drawer: true,
    fixed: false,
    miniVariant: false,
    sidebar: require('@/assets/json/sidebar-user.json')
  }),
  computed: {
    ...mapState(['user']),
    items() {
      if (this.user.isAdmin) {
        // 如果是管理员
        return this.sidebar
      } else if (this.user.remark) {
        // 如果有备注
        return this.sidebar.filter(
          (item) => !item.remark || item.mark == this.user.remark
        )
      } else {
        // 如果是普通用户
        return this.sidebar.filter((item) => !item.remark)
      }
    }
  }
}
</script>
