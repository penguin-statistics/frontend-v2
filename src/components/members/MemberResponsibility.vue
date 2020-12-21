<template>
  <v-list-item>
    <v-list-item-avatar
      :size="dense ? 24 : undefined"
      :class="{'mr-2': dense}"
    >
      <v-icon :small="dense">
        {{ responsibility.icon }}
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="v-list--force-line-break">
        {{ $t('members.responsibilities.' + responsibility.id) }}
      </v-list-item-title>
      <v-list-item-subtitle
        v-if="!dense"
        class="monospace"
      >
        {{ responsibility.id }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import CDN from "@/mixins/CDN";

export default {
  name: "MemberResponsibility",
  mixins: [CDN],
  props: {
    responsibility: {
      type: Object,
      required: true
    },
    dense: {
      type: Boolean,
      default: () => false
    }
  },

}
</script>

<style scoped>

</style>