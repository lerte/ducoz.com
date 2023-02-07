<template>
  <ClientOnly>
    <tiptap-vuetify v-model="content" :extensions="extensions" />
    <template #placeholder> Loading... </template>
  </ClientOnly>
</template>

<script>
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HorizontalRule,
  History,
  Image,
  Table,
  TableCell,
  TableHeader,
  TableRow
} from 'tiptap-vuetify'

export default {
  name: 'Editor',
  components: { TiptapVuetify },
  props: ['value'],
  model: {
    prop: 'value',
    event: 'change'
  },
  data: () => ({
    content: '',
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Bold,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Table,
        {
          options: {
            resizable: true
          }
        }
      ],
      TableCell,
      TableHeader,
      TableRow,
      Image,
      HorizontalRule,
      Paragraph,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3, 4]
          }
        }
      ]
    ]
  }),
  watch: {
    content: {
      handler(value) {
        this.$emit('change', value)
      },
      deep: true
    }
  },
  mounted() {
    this.content = this.value
  }
}
</script>
