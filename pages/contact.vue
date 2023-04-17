<template>
  <main
    class="h-min-[calc(100vh_-_104px)] flex flex-col items-center justify-center bg-gray-100"
  >
    <article class="mt-24 w-full max-w-6xl px-4 sm:px-0">
      <iframe
        src="https://lbs.amap.com/tools/showmap?1_1200_540_113.965705_22.571176&=%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%A4%9A%E6%B3%BD%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&=%E7%8F%A0%E5%85%89%E5%88%9B%E6%96%B0%E7%A7%91%E6%8A%80%E5%9B%AD2%E6%A0%8B512&=&=130-4939-9980&="
        frameborder="0"
        height="540px"
        scrolling="no"
        width="100%"
      >
      </iframe>
      <p class="h-8"></p>
    </article>
  </main>
</template>

<script>
export default {
  name: 'contact',
  head() {
    return {
      title: '联系我们'
    }
  }
}
</script>
