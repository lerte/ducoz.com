<template>
  <div class="flex flex-wrap items-center flex-col-reverse sm:flex-row">
    <div class="w-full sm:w-1/2 py-4">
      <slot name="svg" />
    </div>
    <div class="w-full sm:w-1/2 py-4">
      <div class="align-middle">
        <p class="text-gray-600" v-html="content"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutLeft',
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
