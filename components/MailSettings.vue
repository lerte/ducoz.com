<template>
  <div>
    <p>日额度: {{ descAccountSummary.DailyQuota }}</p>
    <p>月额度: {{ descAccountSummary.MonthQuota }}</p>
    <p>收件人数量: {{ descAccountSummary.Receivers }}</p>
    <p>模板数量: {{ descAccountSummary.Templates }}</p>
    <p>
      用户状态:
      {{ descAccountSummary.UserStatus }}
      (用户状态：0表示正常，1表示冻结，2表示欠费，3表示限制外发。)
    </p>
    <p>域名数量: {{ descAccountSummary.Domains }}</p>
    <p>信誉度等级: {{ descAccountSummary.QuotaLevel }}</p>
    <p>最高等级: {{ descAccountSummary.MaxQuotaLevel }}</p>
    <p>标签数量: {{ descAccountSummary.Tags }}</p>
    <p>发信地址数量: {{ descAccountSummary.MailAddresses }}</p>
    <!-- <p>生效时间: {{ descAccountSummary.EnableTimes }}</p> -->
  </div>
</template>

<script>
export default {
  name: 'mail-settings',
  data: () => ({
    descAccountSummary: ''
  }),
  async mounted() {
    const response = await fetch('/api/mail/descAccountSummary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    this.descAccountSummary = data
  }
}
</script>
