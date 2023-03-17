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
        <MailList v-if="item.name == 'list'" />
        <MailInbox v-if="item.name == 'inbox'" />
        <MailOutbox v-if="item.name == 'outbox'" />
        <!-- <MailAnalytics v-if="item.name == 'analytics'" /> -->
        <AccountSummary v-if="item.name == 'account-summary'" />
        <Domain v-if="item.name == 'domain'" />
        <Tag v-if="item.name == 'tag'" />
        <MailAddress v-if="item.name == 'mail-address'" />
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
        name: 'list',
        title: '用户列表',
        icon: 'mdi-list-box'
      },
      {
        name: 'inbox',
        title: '收件箱',
        icon: 'mdi-inbox'
      },
      {
        name: 'outbox',
        title: '发件箱',
        icon: 'mdi-email-arrow-right'
      },
      // {
      //   name: 'analytics',
      //   title: '邮件分析',
      //   icon: 'mdi-google-analytics'
      // },
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
      }
    ]
  })
}
</script>
