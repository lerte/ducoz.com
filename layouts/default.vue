<template>
  <div class="gradient">
    <Header />
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

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.gradient {
  background: linear-gradient(90deg, #102b6a 0%, #426ab3 100%);
}
.gradient-vertical {
  background: linear-gradient(to bottom, #426ab3 0%, #102b6a 50%, #426ab3 100%);
}
</style>
