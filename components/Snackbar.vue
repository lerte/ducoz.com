<template>
  <v-snackbar v-model="show" :color="color" timeout="1500">
    {{ message }}
    <template #action="{ attrs }">
      <v-btn text v-bind="attrs" @click="show = false"> 关闭 </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'snackbar',
  data: () => ({
    show: false,
    message: '',
    color: ''
  }),
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
      }
    })
  }
}
</script>
