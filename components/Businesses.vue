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
        <Business name="平台电商服务" :items="items[0]" />
        <Business name="独立站流量营销" :items="items[1]" />
        <div
          class="h-full hidden sm:block gradient-vertical w-px absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
    </div>
  </section>
</template>

<script>
import chunk from 'lodash/chunk'
const businesses = require('@/assets/json/businesses.json')

export default {
  name: 'Businesses',
  data: () => ({
    items: chunk(businesses, Math.ceil(businesses.length / 2))
  })
}
</script>
