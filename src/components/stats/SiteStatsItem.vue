<template>
  <v-card>
    <v-card-title class="heading">
      {{ $t('stats.site.items') }}
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :options="options.table"

      :page.sync="page"

      must-sort
      sort-by="quantity"
      :sort-desc="true"
      :locale="$i18n.locale"
      hide-default-footer

      :mobile-breakpoint="1"

      class="elevation-0 transparentTable container--fluid mx-4 font-weight-bold monospace trend-table"

      :class="{'pt-0': $vuetify.breakpoint.xsOnly}"
    >
      <template v-slot:item.item="{ item }">
        <v-row
          align="center"
          class="cursor-pointer item-name pl-1"
          @click="redirect(item.item.itemId)"
        >
          <Item
            :item="item.item"
            :ratio="0.6"
            disable-tooltip
            disable-link

            class="item-icon"
          />
          <span
            style="padding-left: 44px"
            class="item-name--text"
          >
            {{ strings.translate(item.item, "name") }}
          </span>
          <v-icon
            x-small
            class="ml-1 item-name--chevron"
          >
            mdi-link
          </v-icon>
          <v-divider
            class="mx-4 item-name--line"
          />
        </v-row>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
      cir
      :total-visible="7"
      class="mt-1 mb-3"
      :length="Math.ceil(items.length / options.table.itemsPerPage)"
    />
  </v-card>
</template>

<script>
import Theme from '@/mixins/Theme'
import get from '@/utils/getters'
import strings from '@/utils/strings'
import Item from '@/components/global/Item'

export default {
  name: 'SiteStatsItem',
  components: { Item },
  mixins: [Theme],
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      page: 1,
      options: {
        table: {
          itemsPerPage: 10
        }
      }
    }
  },
  computed: {
    items () {
      return this.data.map(el => Object.assign({}, el)).map(el => {
        el.item = get.items.byItemId(el.itemId, false, false)
        return el
      })
    },
    headers () {
      return [
        {
          text: this.$t('stats.headers.item'),
          value: 'item',
          align: 'left',
          sortable: false,
          width: '250px'
        },
        {
          text: this.$t('stats.headers.quantity'),
          value: 'quantity',
          align: 'left',
          sortable: true,
          width: '100px'
        }
      ]
    },
    strings () {
      return strings
    }
  },
  methods: {
    redirect (itemId) {
      this.$router.push({
        name: 'StatsByItem_SelectedItem',
        params: {
          itemId
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
