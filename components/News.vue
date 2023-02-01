<template>
  <section class="bg-white p-4">
    <div class="container mx-auto flex flex-wrap">
      <h1
        class="w-full my-2 text-4xl md:text-5xl font-bold leading-tight text-center text-primary"
      >
        公司动态
        <br />
        NEWS
      </h1>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto bg-secondary w-64 my-0 py-0 rounded-t"></div>
      </div>

      <div class="container block sm:flex items-center bg-[#f3f4f6]">
        <nuxt-link class="block basis-1/2 sm:p-4 sm:h-full" to="/">
          <img
            class="object-cover h-[calc(100%_-_80px)]"
            src="https://picsum.photos/960/400"
          />
          <div
            class="flex items-center p-4 font-bold bg-primary text-white hover:bg-secondary"
          >
            <div class="w-16 text-xs leading-5 text-left top-1">
              <span class="text-lg border-b">
                {{ news[0]?.updatedAt | getYear }}
              </span>
              <span class="text-[13px] block ml-1">
                {{ news[0]?.updatedAt | getDate }}
              </span>
            </div>
            <div
              class="h-6 text-[13px] overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {{ news[0]?.title }}
            </div>
          </div>
        </nuxt-link>
        <ul class="basis-1/2 sm:p-4 sm:h-full space-y-4">
          <li
            :key="index"
            v-for="(item, index) in news"
            class="p-4 bg-white hover:bg-secondary text-dark hover:text-white"
          >
            <a :href="item.id" class="flex items-center font-medium">
              <div class="w-16 text-xs leading-5 text-left">
                <span class="text-lg border-b">
                  {{ item?.updatedAt | getYear }}
                </span>
                <span class="text-[13px] block ml-1">
                  {{ item?.updatedAt | getDate }}
                </span>
              </div>
              <span>
                {{ item?.title }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'News',
  data: () => ({
    news: []
  }),
  async fetch() {
    const response = await fetch(
      'https://ducoz.c1-asia-se.altogic.com/e:63d940c9a1ac9f2d382d6552/news'
    )
    const { result } = await response.json()
    this.news = result
  },
  filters: {
    getYear(datetime) {
      return dayjs(datetime).get('year')
    },
    getDate(datetime) {
      return dayjs(datetime).format('MM-DD')
    }
  }
}
</script>
