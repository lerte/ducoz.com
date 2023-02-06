<template>
  <section class="bg-gray-100 border-b p-4">
    <div class="container max-w-5xl mx-auto">
      <h1
        class="w-full my-2 text-4xl md:text-5xl font-bold leading-tight text-center text-primary"
      >
        关于我们
        <br />
        ABOUT US
      </h1>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto bg-secondary w-64 my-0 py-0 rounded-t"></div>
      </div>
      <AboutRight
        content="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;深圳市多泽科技有限公司成立于2019年，创始团队核心成员曾就职于腾讯、Meta、字节跳动、华为云等互联网公司。深耕于跨境行业均有8年以上从业经验，服务企业过千家。"
      >
        <img src="@/assets/img/about1.svg" alt slot="svg" />
      </AboutRight>
      <AboutLeft
        content="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;基于流量为客户提升营销创造力，赋能企业高效出海，<strong>多泽跨境&reg;</strong>拥有全行业最新最高效的跨境营销经验以及团队，和丰富的行业配套资源，我们的服务宗旨:服务为先、高效落地、口碑至上。"
      >
        <img src="@/assets/img/about2.svg" alt slot="svg" />
      </AboutLeft>
      <AboutRight
        content="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们的团队成员平均8年以上的跨境行业从业经验，曾参与跨境行业多家知名企业的管理、运营、团队管理、投资等。<br/><strong>多泽跨境&reg;</strong>服务超千家企业，营业额过亿的跨境企业50家以上。"
      >
        <img src="@/assets/img/about3.svg" alt slot="svg" />
      </AboutRight>
    </div>
  </section>
</template>

<script>
export default {
  name: 'About'
}
</script>
