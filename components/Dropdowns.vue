<template>
  <section class="relative cursor-pointer" @click="show = !show">
    <svg
      class="inline-block w-5"
      width="24"
      height="24"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
        stroke="#333"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4 24H44"
        stroke="#333"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M24 44C28.4183 44 32 35.0457 32 24C32 12.9543 28.4183 4 24 4C19.5817 4 16 12.9543 16 24C16 35.0457 19.5817 44 24 44Z"
        stroke="#333"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.85791 10.1421C13.4772 13.7614 18.4772 16 24 16C29.5229 16 34.5229 13.7614 38.1422 10.1421"
        stroke="#333"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M38.1422 37.8579C34.5229 34.2386 29.5229 32 24 32C18.4772 32 13.4772 34.2386 9.85791 37.8579"
        stroke="#333"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span>中文</span>
    <svg
      :class="show ? 'rotate-180' : ''"
      class="inline-block w-4 h-4 transition-transform"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
    <!-- Dropdown menu -->
    <div
      :class="show ? 'block' : 'hidden'"
      class="absolute bottom-9 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDividerButton"
      >
        <li>
          <span class="block px-4 py-2 text-dark text-base hover:bg-gray-100">
            English
          </span>
        </li>
        <li>
          <span class="block px-4 py-2 text-dark text-base hover:bg-gray-100">
            繁体中文
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Dropdowns',
  data: () => ({
    show: false
  })
}
</script>
