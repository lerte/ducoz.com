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
          <li
            :key="index"
            :title="icon.title"
            v-html="icon.svg"
            v-for="(icon, index) in icons"
          ></li>
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
        svg: `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M36.9974 21.7112C36.8434 13.0079 29.7401 6 21 6C12.1634 6 5 13.1634 5 22C5 26.1701 6.59531 29.9676 9.20892 32.8154L8.01043 40.0257L15.125 36.9699C18.2597 38.0122 21.218 38.2728 24 37.7516" fill="none"/><path d="M36.9974 21.7112C36.8434 13.0079 29.7401 6 21 6C12.1634 6 5 13.1634 5 22C5 26.1701 6.59531 29.9676 9.20892 32.8154L8.01043 40.0257L15.125 36.9699C18.2597 38.0122 21.218 38.2728 24 37.7516" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.125 20.4667C16.3676 20.4667 17.375 19.4519 17.375 18.2C17.375 16.9482 16.3676 15.9333 15.125 15.9333C13.8824 15.9333 12.875 16.9482 12.875 18.2C12.875 19.4519 13.8824 20.4667 15.125 20.4667Z" fill="#333"/><path d="M24.125 20.4667C25.3676 20.4667 26.375 19.4519 26.375 18.2C26.375 16.9482 25.3676 15.9333 24.125 15.9333C22.8824 15.9333 21.875 16.9482 21.875 18.2C21.875 19.4519 22.8824 20.4667 24.125 20.4667Z" fill="#333"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38.7618 39.9293C37.0135 41.2302 34.8467 42 32.5 42C26.701 42 22 37.299 22 31.5C22 25.701 26.701 21 32.5 21C38.299 21 43 25.701 43 31.5C43 33.0997 42.6423 34.6159 42.0024 35.9728" fill="none"/><path d="M38.7618 39.9293C37.0135 41.2302 34.8467 42 32.5 42C26.701 42 22 37.299 22 31.5C22 25.701 26.701 21 32.5 21C38.299 21 43 25.701 43 31.5C43 33.0997 42.6423 34.6159 42.0024 35.9728" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M42.0024 35.9728L43 42L38.7618 39.9293" fill="none"/><path d="M42.0024 35.9728L43 42L38.7618 39.9293" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.6875 30.7999C34.7555 30.7999 34 30.0388 34 29.0999C34 28.161 34.7555 27.3999 35.6875 27.3999C36.6195 27.3999 37.375 28.161 37.375 29.0999C37.375 30.0388 36.6195 30.7999 35.6875 30.7999Z" fill="#333"/><path d="M28.9375 30.7999C28.0055 30.7999 27.25 30.0388 27.25 29.0999C27.25 28.161 28.0055 27.3999 28.9375 27.3999C29.8695 27.3999 30.625 28.161 30.625 29.0999C30.625 30.0388 29.8695 30.7999 28.9375 30.7999Z" fill="#333"/></svg>`
      },
      {
        title: '支付宝',
        svg: `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0ZM24 4.36364C13.1551 4.36364 4.36364 13.1551 4.36364 24C4.36364 34.8449 13.1551 43.6364 24 43.6364C30.7379 43.6364 36.6832 40.2427 40.2199 35.0715C38.7865 34.647 36.4967 33.9121 33.537 32.6689C32.3002 32.1494 30.4531 31.3299 27.9958 30.2104C25.0556 33.1735 20.769 36 16.1742 36C12.9855 35.9844 7.63636 34.3728 7.63636 29.3458C7.63636 24.3188 12.5923 23.1225 15.8076 23.1225C17.7535 23.1225 21.1973 24.1964 26.1389 26.3443L26.2149 26.3741C27.5413 24.7514 28.4513 22.867 28.9459 20.7208L29.0455 20.2571L20.3944 20.2571C19.0841 20.257 17.6773 20.2569 16.1742 20.2568V17.9371L22.032 17.9367V15.0371L13.8306 15.0375V13.2977L22.032 13.2971L22.033 9.81818H26.72L26.7196 13.2971L36.0941 13.2977V15.0375L26.7196 15.0371V17.9367L34.2059 17.9371C34.0959 18.661 33.9722 19.3186 33.8347 19.91L33.7506 20.2568C33.4061 21.5023 32.6313 23.3162 31.4262 25.6986C31.1062 26.3312 30.6437 27.0626 30.0599 27.838C31.904 28.5215 33.771 29.1844 35.6605 29.8275C38.1068 30.6601 40.2216 31.3339 42.005 31.8487C43.0543 29.445 43.6364 26.7905 43.6364 24C43.6364 13.1551 34.8449 4.36364 24 4.36364ZM10.3154 28.5436C10.3154 31.7418 17.0047 33.0159 22.4246 29.6497C23.0347 29.2707 23.6048 28.8664 24.1348 28.4369L24.1166 28.4286L23.69 28.1665C20.308 26.1089 17.6806 24.9932 15.8076 24.8194C14.0892 24.66 10.3154 25.3455 10.3154 28.5436ZM29.0455 20.2568L29.0455 20.2571L31.2536 20.2574L29.0455 20.2568Z" fill="#333"/></svg>`
      },
      {
        title: '刷卡',
        svg: `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15L19.3714 25.5377C20.5 26.5 22.8282 28 25 26C27.2893 23.8918 25.5 21.5 25 21L17 15" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 8H27L38 18" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 33L44 33.0193" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 18V40H44V18H22.0002" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      },
      {
        title: '数字货币',
        svg: `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 16H25H27C29.2091 16 31 17.7909 31 20C31 22.2091 29.2091 24 27 24H20V16Z" fill="none"/><path d="M20 16V24H27C29.2091 24 31 22.2091 31 20V20C31 17.7909 29.2091 16 27 16H25M20 16H16M20 16V12M20 16H25M25 16V12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 24H29C31.2091 24 33 25.7909 33 28C33 30.2091 31.2091 32 29 32H25H20V24Z" fill="none"/><path d="M20 32V24H29C31.2091 24 33 25.7909 33 28V28C33 30.2091 31.2091 32 29 32H25M20 32V36M20 32H16H25M20 32H25M25 32V36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      },
      {
        title: '美元',
        svg: `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 2V46" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 6C35 6 24.9706 6 20 6C15.0294 6 11 10.0294 11 15C11 19.9706 15.0294 24 20 24" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 42C13 42 23.0294 42 28 42C32.9706 42 37 37.9706 37 33C37 28.0294 32.9706 24 28 24H20" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      },
      {
        title: 'PayPal',
        svg: `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M33.0312 28C39 28 43 25.5 43 20C43 14.5 39 12 33.0312 12H22L17 43H26L28 28H33.0312Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 36H10L15 5H26.0312C32 5 36 7.5 36 13C36 18.5 32 21 26.0312 21H21" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      },
      {
        title: '币种兑换',
        svg: `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38 10L10 38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L12 14L18 6" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 14H19" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 20H19" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14V26" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.8462 26H42V42H22V36.15" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      }
    ]
  }),
  methods: {
    developTips() {
      this.$notifier.showMessage({
        color: 'success',
        content: '网站开发中，敬请期待!'
      })
    }
  }
}
</script>
