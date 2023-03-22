<template>
  <footer class="bg-white">
    <div class="container mx-auto px-4 sm:px-0">
      <div class="w-full flex flex-col md:flex-row py-6">
        <div>
          <FooterLogo />
        </div>
        <div
          class="flex-1 text-left sm:text-center md:text-left"
          v-for="(menu, index) in menus"
          :key="index"
        >
          <p class="text-dark font-bold text-lg md:mb-6">{{ menu.title }}</p>
          <ul>
            <li
              :key="index"
              v-for="(nav, index) in menu.children"
              class="mt-2 inline-block mr-2 md:block md:mr-0"
            >
              <span
                @click="developTips"
                class="no-underline text-gray-800 hover:bg-primary hover:text-white"
              >
                {{ nav.title }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <hr class="h-px border border-dark" />
      <div
        class="flex-1 sm:flex justify-between text-dark py-10 flex-wrap md:flex-nowrap space-y-2 sm:space-y-0"
      >
        <ul
          class="sm:flex-1 flex space-x-6 sm:space-x-4 justify-center sm:justify-start"
        >
          <li>
            <Dropdowns />
          </li>
          <li>服务条款</li>
          <li>隐私策略</li>
          <li>网站地图</li>
        </ul>
        <ul class="flex space-x-6 sm:space-x-4 justify-center sm:justify-end">
          <li :key="index" :title="icon.title" v-for="(icon, index) in icons">
            <img :src="icon.svg" />
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data: () => ({
    menus: [
      {
        title: '多泽跨境®',
        children: [
          { title: '店铺转让协议', to: '/' },
          { title: '账号交易服务免责声明', to: '/' },
          { title: '平台服务常见问题', to: '/' },
          { title: '商标转让协议', to: '/' }
        ]
      },
      {
        title: 'Duoze ads®',
        children: [
          { title: '广告开户服务协议条款', to: '/' },
          { title: '广告代投服务协议条款', to: '/' },
          { title: '独立站服务常见问题', to: '/' }
        ]
      },
      {
        title: '商务合作',
        children: [
          { title: '新媒体', to: '/' },
          { title: '代理政策', to: '/' },
          { title: '推广政策', to: '/' },
          { title: '广告合作', to: '/' }
        ]
      },
      {
        title: '支持',
        children: [
          { title: '会员权益介绍', to: '/' },
          { title: '跨境社区行为规范', to: '/' },
          { title: '在线客服', to: '/' },
          { title: '投诉反馈', to: '/' }
        ]
      },
      {
        title: '社交媒体',
        children: [
          { title: '微信', to: '/' },
          { title: 'Telegram', to: '/' },
          { title: '抖音', to: '/' },
          { title: '微信视频号', to: '/' },
          { title: '微信公众号', to: '/' }
        ]
      }
    ],
    icons: [
      {
        title: '微信',
        svg: `/svg/wechat.svg`
      },
      {
        title: '支付宝',
        svg: `/svg/alipay.svg`
      },
      {
        title: '刷卡',
        svg: `/svg/cash.svg`
      },
      {
        title: '数字货币',
        svg: `/svg/btc.svg`
      },
      {
        title: '美元',
        svg: `/svg/usd.svg`
      },
      {
        title: 'PayPal',
        svg: `/svg/paypal.svg`
      },
      {
        title: '币种兑换',
        svg: `/svg/exchange.svg`
      }
    ]
  })
}
</script>
