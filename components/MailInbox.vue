<template>
  <v-container fluid>
    <v-tabs v-model="tab" slider-size="2" class="elevation-3">
      <v-tab v-for="item in items" :key="item.name">
        <v-icon>{{ item.icon }}</v-icon>
        <span class="ml-2">{{ item.title }}</span>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="elevation-1">
      <v-tab-item v-for="item in items" :key="item.name">
        <InboxList @config="tab = 1" v-if="item.name == 'inbox-list'" />
        <InboxConfig v-if="item.name == 'inbox-config'" />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  name: 'mail-inbox',
  data: () => ({
    tab: 0,
    items: [
      {
        name: 'inbox-list',
        title: '邮件列表',
        icon: 'mdi-list-box'
      },
      {
        name: 'inbox-config',
        title: '账号配置',
        icon: 'mdi-tune'
      }
    ]
  })
}
</script>
