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
        <p
          class="text-lg leading-[48px] flex justify-center items-center"
          v-for="(item, index) in items"
          :key="index"
        >
          <svg class="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
              class="fill-purple-400 group-hover:fill-purple-500 dark:group-hover:fill-purple-300 dark:fill-slate-600"
            ></path>
            <path
              d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
              class="fill-purple-200 group-hover:fill-purple-300 dark:group-hover:fill-white dark:fill-slate-400"
            ></path>
            <path
              d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
              class="fill-purple-400 group-hover:fill-purple-500 dark:group-hover:fill-purple-300 dark:fill-slate-600"
            ></path>
          </svg>
          {{ item }}
          <svg class="h-6 w-6 ml-3" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
              class="fill-purple-400 group-hover:fill-purple-500 dark:group-hover:fill-purple-300 dark:fill-slate-600"
            ></path>
            <path
              d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
              class="fill-purple-200 group-hover:fill-purple-300 dark:group-hover:fill-white dark:fill-slate-400"
            ></path>
            <path
              d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
              class="fill-purple-400 group-hover:fill-purple-500 dark:group-hover:fill-purple-300 dark:fill-slate-600"
            ></path>
          </svg>
        </p>
      </div>
      <div class="flex items-center justify-center">
        <button
          class="mx-auto lg:mx-0 gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg"
        >
          了解更多...
        </button>
      </div>
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
