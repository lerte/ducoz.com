<template>
  <v-tooltip right>
    <template #activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <img :src="platforms[platform]" />
      </span>
    </template>
    <span>{{ platform }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'Platform',
  props: ['platform'],
  data: () => ({
    platforms: {
      亚马逊: require('@/assets/png/amazon.png'),
      沃尔玛: require('@/assets/png/walmart.png'),
      速卖通: require('@/assets/png/aliexpress.png'),
      阿里国际站: require('@/assets/png/alibaba.png'),
      易贝: require('@/assets/png/ebay.png'),
      其他: require('@/assets/png/other.png')
    }
  })
}
</script>
