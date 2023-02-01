<template>
  <section class="bg-[#f8fafc] py-8">
    <div class="container mx-auto flex flex-wrap pt-4">
      <h1
        class="w-full my-2 text-5xl font-bold leading-tight text-center text-primary"
      >
        合作伙伴
        <br />
        BRAND CASE
      </h1>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto bg-secondary w-64 my-0 py-0 rounded-t"></div>
      </div>
    </div>
    <div
      class="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      <div v-for="(cs, index) in cases" :key="index" class="mx-auto">
        <img :src="cs.img" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Cases',
  data: () => ({
    cases: [
      { img: require('@/assets/img/shopplus.png') },
      { img: require('@/assets/img/shopline.png') },
      { img: require('@/assets/img/dorian-ads.png') },
      { img: require('@/assets/img/pacypay.png') },
      { img: require('@/assets/img/paypal.png') },
      { img: require('@/assets/img/shopify.png') },
      { img: require('@/assets/img/ost.jpg') },
      { img: require('@/assets/img/sh.jpg') },
      { img: require('@/assets/img/jx.jpg') },
      { img: require('@/assets/img/qh.jpg') },
      { img: require('@/assets/img/smarteam.png') },
      { img: require('@/assets/img/dealmap.png') }
    ]
  })
}
</script>
