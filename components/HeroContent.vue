<template>
  <div class="pt-24">
    <div
      class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center"
    >
      <!--Left Col-->
      <div
        class="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left"
      >
        <p class="uppercase tracking-loose w-full">Traffic service provider</p>
        <h1 class="my-4 text-4xl md:text-5xl font-bold leading-tight">
          跨境流量解决方案服务商
        </h1>
        <p class="w-full leading-normal text-2xl mb-8">
          基于流量 提升营销创造力
        </p>

        <button
          class="mx-auto lg:mx-0 bg-danger text-white font-bold rounded-lg my-6 p-4 shadow-lg"
          @click="sloganClick"
        >
          U Can Obtain, 让每个跨境人都挣钱
        </button>
      </div>
      <!--Right Col-->
      <div class="w-full md:w-3/5 py-6 text-center">
        <Earth />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroContent',
  methods: {
    sloganClick() {
      this.$notifier.showMessage({
        color: 'success',
        content: '网站开发中，敬请期待!'
      })
    }
  }
}
</script>
