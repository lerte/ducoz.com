<template>
  <div class="flex flex-wrap items-center">
    <div class="w-full sm:w-1/2 py-4">
      <h3 class="text-3xl text-gray-800 font-bold leading-none mb-3">
        {{ headline }}
      </h3>
      <p class="text-gray-600">
        {{ content }}
      </p>
    </div>
    <div class="w-full sm:w-1/2 py-4">
      <slot name="svg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutRight',
  props: {
    headline: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    }
  }
}
</script>
