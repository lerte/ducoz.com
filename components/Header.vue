<template>
  <nav :class="headerClassList" class="fixed w-full z-10 top-0">
    <div
      class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2"
    >
      <div class="pl-4 flex items-center">
        <logo :isStickable="true" :isSticky="isSticky" />
      </div>
      <div class="block lg:hidden pr-4">
        <button
          @click.prevent.stop="onToggleClick"
          class="group flex items-center p-1 hover:bg-white"
        >
          <div
            :class="isOpen ? 'rotate-90' : ''"
            class="w-8 h-8 flex flex-col justify-evenly items-center transition-transform"
          >
            <div
              :class="isOpen ? 'rotate-45 translate-y-[5px]' : ''"
              class="h-0.5 w-5 bg-white group-hover:bg-primary"
            ></div>
            <div
              :class="isOpen ? 'hidden' : ''"
              class="h-0.5 w-5 bg-white group-hover:bg-primary"
            ></div>
            <div
              :class="isOpen ? '-rotate-45 -translate-y-[5px]' : ''"
              class="h-0.5 w-5 bg-white group-hover:bg-primary"
            ></div>
          </div>
        </button>
      </div>

      <div
        :class="navContentClassList"
        class="w-full flex-grow lg:flex lg:items-center lg:w-auto mt-2 lg:mt-0 lg:bg-transparent text-black p-4 lg:p-0 z-20"
      >
        <ul class="list-reset lg:flex justify-end flex-1 items-center">
          <li class="mr-3 text-white" v-for="(nav, index) in menu" :key="index">
            <nuxt-link
              :to="nav.to"
              exact-active-class="bg-white text-primary"
              class="block py-2 px-4 font-bold hover:bg-white hover:text-primary"
            >
              {{ nav.title }}
            </nuxt-link>
          </li>
        </ul>
        <span v-if="user">
          <NuxtLink
            to="/admin"
            v-if="user.isAdmin"
            class="px-4 py-2 font-semibold bg-secondary rounded-sm text-white shadow-sm mr-3"
          >
            管理后台
          </NuxtLink>
          <NuxtLink
            v-else
            to="/user/profile"
            class="px-4 py-2 font-semibold bg-secondary rounded-sm text-white shadow-sm mr-3"
          >
            {{ user?.name }}
          </NuxtLink>
          <a
            href="/api/logout"
            class="px-4 py-2 font-semibold bg-success rounded-sm text-white shadow-sm"
          >
            退出登录
          </a>
        </span>
        <span v-else>
          <NuxtLink to="/register">
            <button
              class="px-4 py-2 font-semibold bg-secondary rounded-sm text-white shadow-sm mr-3"
            >
              注册账号
            </button>
          </NuxtLink>
          <NuxtLink to="/login">
            <button
              class="px-4 py-2 font-semibold bg-success rounded-sm text-white shadow-sm"
            >
              登录账号
            </button>
          </NuxtLink>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Header',
  props: ['sticky'],
  data: () => ({
    scrollY: 0,
    isOpen: false,
    menu: [
      { title: '首页', to: '/' },
      { title: '电商出海', to: 'sea' },
      { title: '海外私域', to: 'oversea' },
      { title: '跨境社区', to: 'community' },
      { title: '关于我们', to: 'about' },
      { title: '联系我们', to: 'contact' }
    ]
  }),
  computed: {
    ...mapState({
      user: (state) => state.user
    }),
    isSticky() {
      return this.sticky || this.scrollY > 10
    },
    headerClassList() {
      return this.isSticky ? 'bg-primary shadow' : ''
    },
    navActionClassList() {
      return this.isSticky ? 'gradient text-white' : 'bg-white text-gray-800'
    },
    navContentClassList() {
      let classList = this.isSticky ? 'bg-secondary' : 'bg-primary'
      if (!this.isOpen) {
        classList += ` hidden`
      }
      return classList
    }
  },
  methods: {
    onClick() {
      this.isOpen = false
    },
    onScroll() {
      this.scrollY = window.scrollY
    },
    onToggleClick() {
      this.isOpen = !this.isOpen
    }
  },
  mounted() {
    this.scrollY = window.scrollY
    document.addEventListener('click', this.onClick)
    document.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClick, true)
    document.removeEventListener('scroll', this.onScroll, true)
  }
}
</script>
