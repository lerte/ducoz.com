<template>
  <v-simple-table dense>
    <template #top>
      <v-toolbar flat dense>
        <v-btn color="primary" dark class="mr-2" @click="getSummary">
          <v-icon left> mdi-refresh </v-icon>刷新
        </v-btn>
      </v-toolbar>
      <v-divider />
    </template>
    <template #default>
      <thead>
        <tr>
          <th class="text-left">名称</th>
          <th class="text-left">值</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="index" v-for="(item, index) in descAccountSummary">
          <td>{{ translate[item[0]] }}</td>
          <td v-if="item[0] == 'UserStatus'">
            <v-chip
              label
              small
              text-color="white"
              :color="['success', 'secondary', 'warning', 'error'][item[1]]"
            >
              {{ item[1] | readable }}
            </v-chip>
          </td>
          <td v-else>
            {{ item[1] }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'mail-settings',
  data: () => ({
    descAccountSummary: [],
    translate: {
      SmsRecord: 'SmsRecord（该字段已弃用）',
      SmsTemplates: 'SmsTemplates（该字段已弃用）',
      SmsSign: 'SmsSign（该字段已弃用）',
      RequestId: '请求ID',
      DayuStatus: '指示是否已启用短信服务。（该字段已弃用）',
      EnableTimes: '生效时间',
      DailyQuota: '日额度',
      MonthQuota: '月额度',
      Domains: '域名数量',
      Templates: '模板数量',
      Tags: '标签数量',
      MailAddresses: '发信地址数量',
      Receivers: '收件人列表数量',
      QuotaLevel: '信誉度等级',
      MaxQuotaLevel: '最高等级',
      UserStatus: '用户状态'
    }
  }),
  filters: {
    readable(UserStatus) {
      return ['正常', '冻结', '欠费', '限制外发'][UserStatus]
    }
  },
  mounted() {
    this.getSummary()
  },
  methods: {
    async getSummary() {
      const response = await fetch('/api/mail/DescAccountSummary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const obj = await response.json()
      this.descAccountSummary = Object.entries(obj)
    }
  }
}
</script>
