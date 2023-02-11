<template>
  <div>
    <v-row
      dense
      class="ml-2"
      :key="index"
      v-for="(items, index) in searchItems"
    >
      <v-col :key="searchItem.value" v-for="searchItem in items">
        <v-autocomplete
          v-if="dicts[searchItem.value]"
          dense
          outlined
          clearable
          hide-details
          :label="searchItem.text"
          :items="dicts[searchItem.value]"
          v-model="search[searchItem.value]"
        />
        <v-text-field
          v-else
          dense
          outlined
          clearable
          hide-details
          :label="searchItem.text"
          @keyup.enter.native="doSearch"
          v-model="search[searchItem.value]"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import chunk from 'lodash/chunk'
import debounce from 'lodash/debounce'
export default {
  name: 'search',
  props: {
    dicts: {
      type: Object,
      default: () => ({})
    },
    headers: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    search: {}
  }),
  watch: {
    search: {
      handler() {
        this.doSearch()
      },
      deep: true
    }
  },
  computed: {
    searchItems() {
      const items = this.headers.filter((i) => i.searchable == true)
      if (items.length <= 10) {
        return chunk(items, 10)
      } else {
        return chunk(items, Math.ceil(items.length / 2))
      }
    }
  },
  created() {
    const items = this.headers.filter((i) => i.default)
    items.forEach((item) => {
      this.$set(this.search, item.value, item.default)
    })

    const keys = Object.keys(this.$route.params)
    keys.forEach((key) => {
      this.$set(this.search, key, this.$route.params[key])
    })
  },
  methods: {
    removeEmpty(obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] == null || obj[key] == undefined) {
          delete obj[key]
        }
      })
      return obj
    },
    doSearch: debounce(function () {
      this.$emit('doSearch', this.removeEmpty(this.search))
    }, 800),
    setSearch({ key, value }) {
      this.$set(this.search, key, value)
    }
  }
}
</script>
