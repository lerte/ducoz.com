<template>
  <section class="container mx-auto text-center py-6 mb-12">
    <h1
      class="w-full my-2 text-4xl md:text-5xl font-bold leading-tight text-center text-white"
    >
      联系我们
      <br />
      CONTACT US
    </h1>
    <div class="w-full mb-4">
      <div
        class="h-1 mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t"
      ></div>
    </div>

    <h3 class="my-4 px-4 text-xl leading-tight">
      若您有合作意向请点击下方联系按钮与我们联系，我们将尽快给您回复并且为您对接专业的商务洽谈专员，谢谢！
    </h3>

    <button
      @click="developTips"
      class="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg"
    >
      马上联系
    </button>
  </section>
</template>

<script>
export default {
  name: 'ContactContent'
}
</script>
