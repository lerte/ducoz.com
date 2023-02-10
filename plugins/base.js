import Vue from 'vue'
import dayjs from 'dayjs'

Vue.mixin({
  filters: {
    format(datetime) {
      return dayjs(datetime).format('YYYY-MM-DD')
    },
    ellipsis(str, length) {
      if (str) {
        if (str.length > length) {
          return str.slice(0, length) + '...'
        }
      }
      return str
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
    developTips() {
      this.$notifier.showMessage({
        color: 'error',
        content: '开发中，敬请期待!'
      })
    },
    getPureData(data) {
      for (let key in data) {
        if (data[key] == null || data[key] == undefined) {
          delete data[key]
        }
      }
      return data
    },
    async $uploadFile(file, prefix) {
      const { data, errors } = await this.$altogic.storage
        .bucket(prefix)
        .upload(file.name, file)
      if (errors) throw new Error("Couldn't upload file")
      return data
    }
  }
})
