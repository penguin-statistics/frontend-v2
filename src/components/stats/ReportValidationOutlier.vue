<template>
  <v-card class="pa-1">
    <v-list
      v-if="validation.type.length"
      two-line
      subheader
    >
      <v-subheader>
        {{ $t('report.rules.type._name') }}
      </v-subheader>

      <v-list-item
        v-for="type in validation.type"
        :key="type.type"
      >
        <v-list-item-avatar>
          <v-icon>mdi-alert-circle-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="v-list--force-line-break">
            {{ $t('report.rules.type.now', type.extras) }}
          </v-list-item-title>
          <v-list-item-subtitle class="v-list--force-line-break">
            {{ type.message }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider
      v-if="validation.type.length && validation.item.length"
      class="mx-4"
    />
    <v-list
      v-if="validation.item.length"
      two-line
      subheader
    >
      <v-subheader>
        {{ $t('report.rules.item._name') }}
      </v-subheader>
      <v-list-item
        v-for="item in validation.item"
        :key="`${item.extras.stage}--${item.itemId}`"
      >
        <v-list-item-avatar>
          <ItemIcon
            :item="getItem(item.itemId)"
            :ratio="0.5"
            disable-tooltip
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="v-list--force-line-break">
            {{ $t('report.rules.item.now', item.extras) }}
          </v-list-item-title>
          <v-list-item-subtitle class="v-list--force-line-break">
            {{ item.message }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import get from "@/utils/getters";
import ItemIcon from "@/components/global/ItemIcon";
export default {
name: "ReportValidationOutlier",
  components: {ItemIcon},
  props: {
    validation: {
      type: Object,
      required: true
    },
  },
  methods: {
    getItem (itemId) {
      return get.items.byItemId(itemId)
    },
  },
}
</script>

<style scoped>

</style>