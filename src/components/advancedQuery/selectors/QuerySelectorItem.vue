<template>
  <v-dialog
    v-model="dialog"
    max-width="590px"
  >
    <template v-slot:activator="{ on }">
      <div class="d-flex flex-row align-center justify-center">
        <v-tooltip
          content-class="transparent"
          right
          nudge-right="-16"
          transition="slide-x-transition"
        >
          <template v-slot:activator="{ on }">
            <v-expand-x-transition>
              <v-icon
                v-if="value.length"
                v-on="on"
              >
                mdi-treasure-chest
              </v-icon>
            </v-expand-x-transition>
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
          :class="{'mx-1': value.length}"
          large
          :disabled="disabled"
          v-on="on"
        >
          <v-icon
            left
            v-on="on"
          >
            mdi-treasure-chest
          </v-icon>
          
          {{ $t('query.selector.item.title') }} (selected {{ value.length }})
        </v-btn>

        <v-expand-x-transition>
          <div v-if="value.length">
            <v-btn
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
  import ItemSelector from "@/components/stats/ItemSelector";
  import ItemById from "@/components/global/ItemById";
  import MultiItemSelector from "@/components/advancedQuery/selectors/MultiItemSelector";
  export default {
    name: "QuerySelectorItem",
    components: {MultiItemSelector},
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
    data() {
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