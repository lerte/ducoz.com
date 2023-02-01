<template>
  <nav :class="headerClassList" class="fixed w-full z-10 top-0 backdrop-blur">
    <div
      class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2"
    >
      <div class="pl-4 flex items-center">
        <logo :isStickable="true" :isSticky="isSticky" />
      </div>
      <div class="block lg:hidden pr-4">
        <button
          class="flex items-center p-1 text-white hover:text-light"
          @click.prevent.stop="onToggleClick"
        >
          <svg
            class="fill-current h-6 w-6"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>菜单</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div
        :class="navContentClassList"
        class="w-full flex-grow lg:flex lg:items-center lg:w-auto mt-2 lg:mt-0 lg:bg-transparent text-black p-4 lg:p-0 z-20"
      >
        <ul class="list-reset lg:flex justify-end flex-1 items-center">
          <li class="mr-3" v-for="(nav, index) in menu" :key="index">
            <nuxt-link
              :to="nav.to"
              class="inline-block py-2 px-4 text-white font-bold no-underline"
            >
              {{ nav.title }}
            </nuxt-link>
          </li>
        </ul>
        <button
          class="px-4 py-2 font-semibold text-sm bg-secondary rounded-sm text-white shadow-sm mr-3"
        >
          注册账号
        </button>
        <button
          class="px-4 py-2 font-semibold text-sm bg-success rounded-sm text-white shadow-sm"
        >
          登录账号
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Header',
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
    isSticky() {
      return this.scrollY > 10
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
