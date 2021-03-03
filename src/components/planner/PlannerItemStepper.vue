<template>
  <v-card
    class="pa-2 ma-0 bkop-medium"
  >
    <v-container>
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <Item
          :item="item"
          disable-link
          :ratio="1"
        />
      </v-row>
    </v-container>
    <v-container class="px-0 pt-0 pb-1 ma-0">
      <v-row
        align="center"
        justify="center"
        no-gutters
        class="mb-2"
      >
        <v-col class="d-flex align-center">
          <div
            class="d-flex"
            style="position: relative"
          >
            <span
              class="caption no-break--text field-caption white--text"
            >
              {{ $t('planner.have') }}
            </span>
          </div>
          <NumberInput
            :value="have"
            size="small"
            center
            controls
            :placeholder="$t('planner.have')"
            class="monospace font-weight-bold number-input-theme transition-all"
            :class="{'number-input-theme--dense': $vuetify.breakpoint.smAndDown}"
            :min="0"
            @change="i => $emit('update:have', i)"
          />
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <v-col class="d-flex align-center mt-2">
          <div
            class="d-flex"
            style="position: relative"
          >
            <span
              class="caption no-break--text field-caption white--text"
            >
              {{ $t('planner.need') }}
            </span>
          </div>
          <NumberInput
            :value="need"
            size="small"
            center
            controls
            :placeholder="$t('planner.need')"
            class="monospace font-weight-bold number-input-theme transition-all"
            :class="{'number-input-theme--dense': $vuetify.breakpoint.smAndDown}"
            :min="0"
            @change="i => $emit('update:need', i)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import get from '@/utils/getters'
import Item from '@/components/global/Item'
import NumberInput from '@/components/NumberInput'
export default {
  name: 'PlannerItemStepper',
  components: { NumberInput, Item },
  props: {
    itemId: {
      type: String,
      required: true
    },
    need: {
      type: Number,
      required: true
    },
    have: {
      type: Number,
      required: true
    }
  },
  computed: {
    item () {
      return get.items.byItemId(this.itemId)
    }
  }
}
</script>

<style scoped>
  .field-caption {
    top: -30px;
    left: 20px;
    position: absolute;
    background: rgba(0, 0, 0, .98);
    font-weight: bold;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 11px !important;
    z-index: 4;

    user-select: none;
  }
</style>
