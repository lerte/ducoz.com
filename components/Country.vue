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
      美国: require('@/assets/svg/us.svg'),
      日本: require('@/assets/svg/jp.svg'),
      加拿大: require('@/assets/svg/ca.svg'),
      英国: require('@/assets/svg/uk.svg'),
      德国: require('@/assets/svg/de.svg'),
      法国: require('@/assets/svg/fr.svg'),
      西班牙: require('@/assets/svg/es.svg'),
      意大利: require('@/assets/svg/it.svg'),
      印度: require('@/assets/svg/in.svg'),
      澳大利亚: require('@/assets/svg/au.svg')
    }
  })
}
</script>
