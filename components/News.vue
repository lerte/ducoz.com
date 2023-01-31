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

      <div class="container flex items-center">
        <div class="basis-1/2 pr-2">
          <img src="https://picsum.photos/768/320" alt="" class="rounded-md" />
        </div>
        <div class="basis-1/2">
          <ul>
            <li
              :key="index"
              v-for="(item, index) in news"
              class="py-4 max-w-md space-y-1 text-gray-600"
            >
              <nuxt-link :to="item.link">
                <time>
                  {{ item.date }}
                </time>
                <span>
                  {{ item.title }}
                </span>
              </nuxt-link>
            </li>
          </ul>
        </div>
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
