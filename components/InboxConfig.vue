<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                dense
                chips
                outlined
                hide-details
                label="邮箱账号"
                :rules="[rules.email]"
                v-model="config.username"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                chips
                outlined
                hide-details
                label="密码"
                :rules="[rules.required]"
                v-model="config.password"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                chips
                outlined
                hide-details
                label="邮箱IMAP地址"
                :rules="[rules.required]"
                v-model="config.host"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click="verify"
        :loading="loading"
        :disabled="!valid || loading"
      >
        验证
      </v-btn>
      <v-btn
        color="success"
        @click="submit"
        :loading="loading"
        :disabled="!valid || !verified || loading"
      >
        提交
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'inbox-config',
  data: () => ({
    loading: false,
    valid: false,
    verified: false,
    config: {
      username: '',
      password: '',
      host: 'imap.qiye.aliyun.com'
    },
    rules: {
      required: (value) =>
        (value != '' && value != null && value != undefined) || '必填项.',
      email: (v) => {
        if (
          v &&
          v.length > 0 &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
        ) {
          return true
        } else {
          return '邮箱地址不正确'
        }
      }
    }
  }),
  watch: {
    user: {
      handler(val) {
        if (val.config) {
          this.config = { ...JSON.parse(val.config) }
        }
      },
      deep: true,
      immediate: true
    },
    config: {
      handler() {
        this.verified = false
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async verify() {
      const params = new URLSearchParams({ ...this.config })
      const response = await fetch(`/api/imap/verifyAccount?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { verify } = await response.json()
      this.verified = verify
      this.$notifier.showMessage({
        content: verify ? '验证成功' : '验证失败',
        color: verify ? 'success' : 'error'
      })
    },
    async submit() {
      this.loading = true
      const { data, errors } = await this.$altogic.db
        .model('users')
        .object(this.user._id)
        .update({ config: JSON.stringify(this.config) })

      if (errors) {
        this.$notifier.showMessage({
          content: errors,
          color: 'error'
        })
      } else {
        this.$store.commit('setUser', data)
        this.$notifier.showMessage({
          content: '提交成功',
          color: 'success'
        })
      }
      this.loading = false
    }
  }
}
</script>
