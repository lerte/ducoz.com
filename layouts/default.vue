<template>
  <div>
    <Header :sticky="true" />
    <Nuxt />
    <Footer />
    <Snackbar />
  </div>
</template>

<script>
export default {
  name: 'defaultLayout'
}
</script>
