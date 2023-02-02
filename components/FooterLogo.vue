<template>
  <NuxtLink to="/">
    <img
      alt="logo"
      src="@/assets/img/logo-primary.png"
      class="hidden md:block hover:scale-105 ease-in-out duration-300"
    />
    <img
      alt="logo"
      src="@/assets/img/logo-primary-mobile.png"
      class="md:hidden hover:scale-105 ease-in-out duration-300"
    />
  </NuxtLink>
</template>

<script>
export default {
  name: 'FooterLogo'
}
</script>
