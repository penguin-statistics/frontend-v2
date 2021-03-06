<template>
  <v-dialog
    v-model="dialog"
    max-width="590px"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex flex-row align-center justify-center mt-1">
        <v-tooltip
          content-class="transparent"
          right
          nudge-right="-16"
          transition="slide-x-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
            >
              mdi-treasure-chest
            </v-icon>
          </template>
          <v-card
            max-width="400px"
          >
            <v-card-title>
              {{ $t('query.selector.item.title') }}
            </v-card-title>
            <v-card-text>
              {{ $t('query.selector.item.subtitle') }}
            </v-card-text>
          </v-card>
        </v-tooltip>

        <v-btn
          class="flex-grow-1"
          large
          :disabled="disabled"
          v-bind="attrs"
          v-on="on"
        >
          <template v-if="value.length">
            <v-icon>
              mdi-filter
            </v-icon>
            {{ $t('query.selector.item.selected', {length: value.length}) }}
          </template>
          <template v-else>
            <v-icon
              left
            >
              mdi-treasure-chest
            </v-icon>
            {{ $t('query.selector.item.unspecified') }}
          </template>
        </v-btn>

        <v-expand-x-transition>
          <div v-if="value.length">
            <v-btn
              v-haptic
              icon
              @click="clear"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </v-expand-x-transition>
      </div>
    </template>

    <v-card>
      <v-card-title class="title">
        {{ $t('query.selector.item.title') }}
      </v-card-title>
      <MultiItemSelector
        class="px-4 pb-4"
        :value="value"
        @input="e => $emit('input', e)"
      />
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-haptic
          text
          @click="dialog = false"
        >
          {{ $t('meta.dialog.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MultiItemSelector from '@/components/advancedQuery/selectors/MultiItemSelector'
export default {
  name: 'QuerySelectorItem',
  components: { MultiItemSelector },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    clear () {
      this.$emit('input', [])
    }
  }
}
</script>

<style scoped>

</style>
