<template>
  <MailList />
</template>

<script>
export default {
  name: 'mail-list',
  layout: 'user',
  head() {
    return {
      script: [
        {
          hid: 'xlsx',
          src: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
          defer: true
        }
      ]
    }
  }
}
</script>
