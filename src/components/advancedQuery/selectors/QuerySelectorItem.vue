<template>
  <v-dialog
    v-model="dialog"
    max-width="550px"
  >
    <template v-slot:activator="{ on }">
      <div class="d-flex flex-row align-center justify-center">
        <v-expand-x-transition>
          <v-icon
            v-if="value"
          >
            mdi-treasure-chest
          </v-icon>
        </v-expand-x-transition>
        <v-btn
          class="flex-grow-1"
          :class="{'mx-1': value}"
          large
          v-on="on"
        >
          <ItemById
            v-if="value"
            :id="value"
          />
          <div
            v-else
            class="d-flex align-center"
          >
            <v-icon left>
              mdi-treasure-chest
            </v-icon>
            选择素材
          </div>
        </v-btn>
        <v-expand-x-transition>
          <div v-if="value">
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
        选择素材
      </v-card-title>
      <ItemSelector
        class="px-4 pb-4"
        @select="select"
      />
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="dialog = false"
        >
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import ItemSelector from "@/components/stats/ItemSelector";
  import ItemById from "@/components/global/ItemById";
  export default {
    name: "QuerySelectorItem",
    components: {ItemSelector, ItemById},
    props: {
      value: {
        type: String,
        default () {
          return null
        }
      }
    },
    data() {
      return {
        search: "",
        dialog: false
      }
    },
    methods: {
      select (id) {
        this.$emit('input', id);
        this.dialog = false;
      },
      clear () {
        this.$emit('input', null)
      }
    }
  }
</script>

<style scoped>

</style>