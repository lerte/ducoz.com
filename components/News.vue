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
              <span class="text-lg border-b">2023</span>
              <span class="text-[13px] block ml-1">Jan-27</span>
            </div>
            <div
              class="h-6 text-[13px] overflow-hidden whitespace-nowrap text-ellipsis"
            >
              NTD物流与上海海事大学签署战略合作框架协议
            </div>
          </div>
        </nuxt-link>
        <ul class="basis-1/2 sm:p-4 sm:h-full space-y-4">
          <li
            :key="index"
            v-for="(item, index) in news"
            class="p-4 bg-white hover:bg-secondary text-dark hover:text-white"
          >
            <nuxt-link :to="item.link" class="flex items-center font-medium">
              <div class="w-16 text-xs leading-5 text-left">
                <span class="text-lg border-b">2023</span>
                <span class="text-[13px] block ml-1">Jan-27</span>
              </div>
              <span>
                {{ item.title }}
              </span>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'News',
  data: () => ({
    news: [
      {
        date: '2023-01-31',
        title: '标题标题标题标题标题标题标题标题标题',
        link: '/'
      },
      {
        date: '2023-01-31',
        title: '标题标题标题标题标题标题标题标题标题',
        link: '/'
      },
      {
        date: '2023-01-31',
        title: '标题标题标题标题标题标题标题标题标题',
        link: '/'
      },
      {
        date: '2023-01-31',
        title: '标题标题标题标题标题标题标题标题标题',
        link: '/'
      },
      {
        date: '2023-01-31',
        title: '标题标题标题标题标题标题标题标题标题',
        link: '/'
      }
    ]
  })
}
</script>
