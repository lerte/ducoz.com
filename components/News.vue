<template>
  <section class="bg-white py-8">
    <div class="container mx-auto flex flex-wrap pt-4 pb-12">
      <h1
        class="w-full my-2 text-5xl font-bold leading-tight text-center text-primary"
      >
        公司动态
        <br />
        NEWS
      </h1>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto bg-secondary w-64 my-0 py-0 rounded-t"></div>
      </div>

      <div class="container block sm:flex items-center">
        <nuxt-link
          class="block basis-1/2 mx-4 sm:p-5 sm:h-full bg-[#f3f4f6]"
          to="/"
        >
          <img class="object-cover" src="https://picsum.photos/768/320" />
          <div
            class="flex items-center px-4 py-4 font-bold bg-primary text-white hover:bg-secondary"
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
        <ul class="basis-1/2 px-4 sm:pl-4 sm:h-full bg-[#f3f4f6]">
          <li
            :key="index"
            v-for="(item, index) in news"
            class="my-2 px-4 py-4 bg-white hover:bg-secondary text-dark hover:text-white"
          >
            <nuxt-link :to="item.link" class="flex items-center">
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
