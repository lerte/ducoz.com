<template>
  <v-tooltip right>
    <template #activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <img :src="countries[country]" />
      </span>
    </template>
    <span>{{ country }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'Country',
  props: ['country'],
  data: () => ({
    countries: {
      美国: 'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7ce7213b5ac84ba5841',
      日本: 'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7ce98a355627ef9b62a',
      加拿大:
        'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7ce98a355627ef9b628',
      英国: 'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7cec1854bf9ae52c07c',
      德国: 'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7ce7213b5ac84ba5843',
      法国: 'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7cec1854bf9ae52c07b',
      西班牙:
        'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7cfc1854bf9ae52c07d',
      意大利:
        'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7ce98a355627ef9b629',
      印度: 'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c7ce7213b5ac84ba5842',
      澳大利亚:
        'https://c1-asia-se.altogic.com/_storage/63d940c9a1ac9f2d382d6552/6419c641c1854bf9ae52c07a/6419c75898a355627ef9b627'
    }
  })
}
</script>
