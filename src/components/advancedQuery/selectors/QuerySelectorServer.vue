<template>
  <v-select
    :value="value"
    hide-details
    prepend-icon="mdi-server"

    :menu-props="{ offsetY: true }"
    filled
    :items="servers"
    :label="$t('server.name')"
    transition="slide-y-transition"
    class="mb-1"

    @input="e => $emit('input', e)"
  >
    <template v-slot:item="{item}">
      {{ $t('server.servers.' + item) }}
      <span class="monospace ml-2">
        {{ item }}
      </span>
      <v-spacer />
      <v-icon v-if="item === value">
        mdi-check
      </v-icon>
    </template>

    <template v-slot:selection="{item}">
      {{ $t('server.servers.' + item) }}
    </template>
  </v-select>
</template>

<script>
  import supports from "@/models/supports";

  export default {
    name: "QuerySelectorServer",
    props: {
      value: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        selected: this.$store.getters["dataSource/server"],
        servers: supports.servers
      }
    }
  }
</script>

<style scoped>

</style>