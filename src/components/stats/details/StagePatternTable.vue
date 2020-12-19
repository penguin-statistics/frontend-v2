<template>
  <v-data-table
    ref="dataTable"
    :headers="headers"

    :items="items"
    :page.sync="page"

    :items-per-page="itemsPerPage"
    must-sort
    sort-by="percentage"
    :sort-desc="true"

    :locale="$i18n.locale"

    :mobile-breakpoint="1"
    class="elevation-0 transparent container--fluid font-weight-bold transition-all"

    :class="{'pt-0': $vuetify.breakpoint.xsOnly}"
  >
    <template #header.quantity>
      <HeaderWithTooltip :name="$t('stats.headers.quantity')">
        {{ $t('stats.headerDesc.quantity') }}
      </HeaderWithTooltip>
    </template>
    <template #header.percentage>
      <HeaderWithTooltip :name="$t('stats.headers.percentage')">
        {{ $t('stats.headerDesc.patternPercentage') }}
      </HeaderWithTooltip>
    </template>
    <template #item="{ item }">
      <tr
        :class="{'table-row-hover': item.i === active}"
        class="monospace"
      >
        <td class="text-left">
          {{ item.i }}
        </td>
        <td class="text-left">
          <v-row
            v-if="item.pattern.length"
            align="center"
          >
            <v-badge
              v-for="it in item.pattern"
              :key="it.itemId"
              bordered
              bottom
              overlap

              :offset-x="16"
              :offset-y="16"

              color="secondary"
              class="d-inline-flex mr-1"
              :content="it.quantity"
            >
              <span>
                <Item
                  :item="it.item"
                  :ratio="0.6"
                />
              </span>
            </v-badge>
          </v-row>
          <div
            v-else
            class="d-flex align-end justify-left ml-n2"
          >
            <v-icon left>
              mdi-circle-off-outline
            </v-icon>
            {{ $t('pattern.empty') }}
          </div>
        </td>
        <td class="text-left">
          {{ item.quantity }}
        </td>
        <td class="text-left">
          {{ item.percentageText }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import get from "@/utils/getters";
import timeFormatter from "@/utils/timeFormatter";
import Item from "@/components/global/Item";
import HeaderWithTooltip from "@/components/stats/HeaderWithTooltip";

export default {
  name: "StagePatternTable",
  components: {HeaderWithTooltip, Item},
  props: {
    patterns: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    items() {
      return this.patterns.map(el => {
        return {
          ...el,
          pattern: el.pattern.drops.map(ell => ({
            ...ell,
            item: get.items.byItemId(ell.itemId)
          }))
        }
      })
    },
    headers() {
      return [
        {
          text: '#',
          value: "i",
          align: "left",
          sortable: false,
          width: "10px"
        },
        {
          text: this.$t("stats.headers.pattern"),
          value: "pattern",
          align: "left",
          sortable: false,
          width: "144px"
        },
        {
          text: this.$t("stats.headers.quantity"),
          value: "quantity",
          align: "left",
          sortable: true,
          width: "90px"
        },
        {
          text: this.$t("stats.headers.percentage"),
          value: "percentage",
          align: "left",
          sortable: true,
          width: "90px"
        }
      ]
    },
    timeRange () {
      return timeFormatter.dates([this.patterns.start, this.patterns.end]).join(" ~ ")
    }
  },
  // watch: {
  //   active(newValue) {
  //     // this.page = Math.ceil(newValue / this.itemsPerPage)
  //   }
  // },
}
</script>

<style scoped lang="scss">
.table-row-hover {
  box-shadow: inset 0 0 4px rgba(0, 0, 0, .8);
}
.theme--dark .table-row-hover {
  background: rgba(97, 97, 97, .8)
}
.theme--light .table-row-hover {
  background: rgba(238, 238, 238, .9);
}
</style>