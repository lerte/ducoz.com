<template>
  <footer class="bg-white">
    <div class="container mx-auto px-8">
      <div class="w-full flex flex-col md:flex-row py-6">
        <div class="flex-1 mb-6">
          <logo color="primary" />
        </div>

        <div class="flex-1">
          <p class="uppercase text-gray-500 md:mb-6">导航</p>
          <ul class="list-reset mb-6">
            <li
              :key="index"
              v-for="(nav, index) in menu"
              class="mt-2 inline-block mr-2 md:block md:mr-0"
            >
              <nuxt-link
                :to="nav.to"
                class="no-underline hover:underline text-gray-800 hover:text-warning"
              >
                {{ nav.title }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data: () => ({
    menu: [
      { title: '首页', to: '/' },
      { title: '电商出海', to: 'sea' },
      { title: '海外私域', to: 'oversea' },
      { title: '跨境社区', to: 'community' },
      { title: '关于我们', to: 'about' },
      { title: '联系我们', to: 'contact' }
    ]
  })
}
</script>
