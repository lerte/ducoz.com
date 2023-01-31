<template>
  <section class="bg-gray-100 border-b py-8">
    <div class="container max-w-5xl mx-auto m-8">
      <h1
        class="w-full my-2 text-5xl font-bold leading-tight text-center text-primary"
      >
        关于我们
        <br />
        ABOUT US
      </h1>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto bg-secondary w-64 my-0 py-0 rounded-t"></div>
      </div>
      <AboutRight
        headline=""
        content="深圳市多泽科技有限公司成立于2019年，创始团队核心成员曾就职于腾讯、Meta、字节跳动、华为云等互联网公司。
深耕于跨境行业均有8年以上从业经验，服务企业过千家。"
      >
        <img src="@/assets/img/travel-booking.svg?inline" alt slot="svg" />
      </AboutRight>
      <AboutLeft
        headline=""
        content="基于流量为客户提高营销创造力，赋能国内企业出海全模式，拥有完全落地的跨境营销解决方案能力以及丰富配套资源。
多泽跨境服务宗旨:服务放心，落地高效，口碑至上。"
      >
        <img src="@/assets/img/connected-world.svg?inline" alt slot="svg" />
      </AboutLeft>
      <AboutRight
        headline=""
        content="深圳市多泽科技有限公司成立于2019年，创始团队核心成员曾就职于腾讯、Meta、字节跳动、华为云等互联网公司。
深耕于跨境行业均有8年以上从业经验，服务企业过千家。"
      >
        <img src="@/assets/img/travel-booking.svg?inline" alt slot="svg" />
      </AboutRight>
    </div>
  </section>
</template>

<script>
export default {
  name: 'About'
}
</script>
