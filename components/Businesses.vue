<template>
  <section class="bg-white p-4">
    <div class="container mx-auto text-gray-800">
      <h1
        class="w-full my-2 text-4xl md:text-5xl font-bold leading-tight text-center text-primary"
      >
        主营业务<br />
        MAIN BUSINESS
      </h1>
      <div class="w-full mb-8">
        <div class="h-1 mx-auto bg-secondary w-64 my-0 py-0 rounded-t"></div>
      </div>
      <div
        class="max-w-7xl mx-auto grid-cols-1 sm:grid sm:grid-cols-2 lg:gap-40 md:gap-20 sm:gap-10 gap-0 relative"
      >
        <Business name="平台电商服务" :items="items1" />
        <Business name="独立站流量营销" :items="items2" />
        <div
          class="h-full hidden sm:block gradient-vertical w-px absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Businesses',
  data: () => ({
    items1: [
      { title: '海外平台电商测评', to: '/user' },
      { title: '店铺预定及转让', to: '/user' },
      { title: '精准查邮箱', to: '/user/checkmail' },
      { title: '高效删差评', to: '/user' },
      { title: '测评黑名单库查询', to: '/user' },
      { title: '平台账号交易', to: '/user' },
      { title: '精准查站外折扣推广邮箱', to: '/user' },
      { title: '海外商标交易', to: '/user' }
    ],
    items2: [
      { title: 'Facebook广告开户', to: '/user' },
      { title: 'Google广告开户', to: '/user' },
      { title: 'Tiktok广告开户', to: '/user' },
      { title: '海外社媒开户', to: '/user' },
      { title: '电商网站建站', to: '/user' },
      { title: '独立站广告代投', to: '/user' },
      { title: '粉丝人气营销', to: '/user' },
      { title: '网红资源服务', to: '/user' }
    ]
  })
}
</script>
