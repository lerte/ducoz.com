<template>
  <div class="rounded-none lg:rounded-l-lg bg-white">
    <div
      class="flex-1 bg-primary text-gray-600 border-b-[16px] rounded-t-[10px] overflow-hidden shadow"
    >
      <div class="p-8 text-3xl font-bold text-center text-white">
        {{ name }}
      </div>
    </div>
    <div
      class="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6"
    >
      <div class="w-full pt-6 text-3xl text-gray-600 font-bold text-center">
        <NuxtLink
          :key="index"
          :to="`/business/${item.value}`"
          v-for="(item, index) in items"
          class="text-lg leading-[48px] flex justify-center items-center hover:bg-secondary hover:text-white"
        >
          {{ item.text }}
          <v-icon class="ml-2" :style="`color: ${item.color}`">
            {{ item.icon }}
          </v-icon>
        </NuxtLink>
      </div>
      <!-- <div class="flex items-center justify-center">
        <button
          @click="developTips"
          class="mx-auto lg:mx-0 gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg"
        >
          了解更多...
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Business',
  props: {
    name: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  }
}
</script>
