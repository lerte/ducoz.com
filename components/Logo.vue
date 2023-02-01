<template>
  <nuxt-link
    to="/"
    :class="classList"
    exact-active-class="logo"
    class="font-bold text-2xl lg:text-4xl"
  >
    <img
      alt="logo"
      v-if="color == 'primary'"
      src="@/assets/img/logo-primary.png"
      class="hover:scale-105 ease-in-out duration-300"
    />
    <img class="h-9" src="@/assets/img/logo.png" alt="logo" v-else />
  </nuxt-link>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    color: {
      type: String,
      default: ''
    },
    isStickable: {
      type: Boolean,
      default: false
    },
    isSticky: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classList() {
      let classList = ''
      if (this.isStickable) {
        classList = this.isSticky ? 'text-gray-800' : 'text-white'
      } else {
        classList = 'text-orange-600'
      }
      return classList
    }
  }
}
</script>
