import Vue from 'vue'

Vue.mixin({
  methods: {
    async $copy(text) {
      try {
        await this.$copyText(text)
        this.$notifier.showMessage({
          content: '复制成功',
          color: 'success'
        })
      } catch (e) {
        this.$notifier.showMessage({
          content: '复制失败',
          color: 'secondary'
        })
      }
    }
  }
})
