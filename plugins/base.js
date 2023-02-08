import Vue from 'vue'
import dayjs from 'dayjs'

Vue.mixin({
  filters: {
    format(datetime) {
      return dayjs(datetime).format('YYYY-MM-DD')
    }
  },
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
    },
    async $uploadFile(file, prefix) {
      const { data, errors } = await this.$altogic.storage
        .bucket(prefix)
        .upload(`main_image`, file)
      if (errors) throw new Error("Couldn't upload file")
      return data
    }
  }
})
