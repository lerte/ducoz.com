<template>
  <v-text-field
    dense
    outlined
    readonly
    hide-details
    :label="label"
    :value="date"
    :rules="rules"
    @click="show = true"
  >
    <template #append>
      <v-menu
        top
        v-model="show"
        nudge-left="290"
        nudge-bottom="10"
        transition="scale-transition"
        :close-on-content-click="true"
      >
        <template #activator="{ on }">
          <v-icon v-on="on">mdi-calendar</v-icon>
        </template>
        <v-date-picker
          no-title
          :value="date"
          @change="change"
          locale="zh-cn"
          :min="min"
        />
      </v-menu>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'date-picker',
  props: ['label', 'date', 'min', 'max', 'rules'],
  model: {
    prop: 'date',
    event: 'change'
  },
  data: () => ({
    show: false
  }),
  methods: {
    change(event) {
      this.$emit('change', event)
    }
  }
}
</script>
