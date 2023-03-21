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
        <AccountSummary v-if="item.name == 'account-summary'" />
        <Domain v-if="item.name == 'domain'" />
        <Tag v-if="item.name == 'tag'" />
        <MailAddress v-if="item.name == 'mail-address'" />
        <Receiver v-if="item.name == 'receiver'" />
        <SenderStatistics v-if="item.name == 'sender-statistics'" />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  name: 'mail',
  data: () => ({
    tab: 0,
    items: [
      {
        name: 'account-summary',
        title: '账户信息',
        icon: 'mdi-information-outline'
      },
      {
        name: 'domain',
        title: '域名',
        icon: 'mdi-domain'
      },
      {
        name: 'tag',
        title: '标签',
        icon: 'mdi-tag'
      },
      {
        name: 'mail-address',
        title: '发信地址',
        icon: 'mdi-card-account-mail'
      },
      {
        name: 'receiver',
        title: '收件人列表',
        icon: 'mdi-card-account-mail-outline'
      },
      {
        name: 'sender-statistics',
        title: '发送数据',
        icon: 'mdi-email-arrow-right'
      }
    ]
  })
}
</script>
