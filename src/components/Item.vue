<template>
  <span
    :class="{ 'cursor-pointer': !disableLink }"
    @click="redirectItemPage"
  >
    <v-tooltip
      v-if="!disableTooltip"
      :open-delay="100"
      :nudge-top="10"

      bottom
      lazy
    >
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <ItemIcon
            :item="item"
            :ratio="ratio"
            :disable-tooltip="disableTooltip"
          />
        </span>
      </template>
      <span>{{ name }}</span>
    </v-tooltip>
    <span v-if="disableTooltip">
      <ItemIcon
        :item="item"
        :ratio="ratio"
        :disable-tooltip="disableTooltip"
      />
    </span>
  </span>
</template>

<script>
  import ItemIcon from "@/components/ItemIcon";
  export default {
    name: "Item",
    components: {ItemIcon},
    props: {
      item: {
        type: Object,
        required: true
      },
      ratio: {
        type: Number,
        default() {
          return 0.75;
        }
      },
      disableTooltip: {
        type: Boolean,
        default() {
          return false;
        }
      },
      disableLink: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        showTooltip: false
      };
    },
    computed: {
      name() {
        if (this.item["name_i18n"]) {
          return this.item["name_i18n"][this.$i18n.locale] || ""
        } else if (this.item) {
          return this.item.name
        } else {
          return ""
        }
      }
    },
    methods: {
      redirectItemPage() {
        if (!this.disableLink) {
          this.showTooltip = false;
          this.$router.push({
            name: "StatsByItem_SelectedItem",
            params: {
              itemId: this.item.itemId
            }
          });
        }
      }
    },
  };
</script>

<style scoped>
</style>
