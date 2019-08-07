<i18n>
  {
    "zh": {
      "rules": {
        "required": ""
      }
    }
  }
</i18n>

<template>
  <v-flex
    class="itemStepper pa-3 ma-2"
    style="display: inline-block"
  >
    <h5 class="title mb-3">
      {{ demoItem.name }}
    </h5>
    <v-text-field
      label="数量"
      type="number"

      outline
      :rules="[rules.required, rules.number]"

      :value="0"

      append-icon="mdi-minus"
      prepend-inner-icon="mdi-plus"

      style="display: inline-flex"
      @click:append-outer="reduction"

      @click:prepend="increment"
    >
      <template v-slot:prepend>
        <Item
          :item="demoItem"
          :ratio="0.5"
          disable-link
          disable-tooltip
        />
      </template>
    </v-text-field>
  </v-flex>
</template>

<script>
  import Item from '@/components/Item'
  export default {
    name: "ItemStepper",
    components: {
      Item
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      min: {
        type: Number,
        required: true,
        validator: value => {
          return value >= 0
        }
      },
      max: {
        type: Number,
        required: true,
        validator: value => {
          return value >= 0
        }
      }
    },
    data () {
      return {
        value: 0,
        rules: {
          required: value => !!value || 'Required.',
          number: value => isNaN(value) || ''
        },
        demoItem: {
          "itemId": "2001",
          "name": "基础作战记录",
          "sortId": 15,
          "rarity": 1,
          "itemType": "CARD_EXP",
          "addTimePoint": 1,
          "spriteCoord": [
            0,
            0
          ],
          "meta": {
            "name": "基础作战记录",
            "color": "green",
            "icon": "mdi-plus"
          }
        }
      }
    },
    methods: {
      increment () {
        if (this.value + 1 <= this.max) {
          this.value += 1
        }
      },
      reduction () {
        if (this.value - 1 >= this.min) {
          this.value -= 1
        }
      }
    }
  }
</script>

<style scoped>
.itemStepper {
}
</style>