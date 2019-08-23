<i18n>
  {
    "zh": {
      "rules": {
        "gte": "“{item}” 应至少有 {quantity} 个",
        "lte": "“{item}” 应至多有 {quantity} 个",
        "not": "“{item}” 不应有 {quantity} 个",
        "natural": "数量值应为自然数"
      }
    },
    "en": {
      "rules": {
        "gte": "Quantity of \"{item}\" should ≥ {quantity}",
        "lte": "Quantity of \"{item}\" should ≤ {quantity}",
        "not": "Quantity of \"{item}\" should ≠ {quantity}",
        "natural": "Value of quantity should be a natural number"
      }
    },
    "ja": {
      "rules": {
        "gte": "Quantity of \"{item}\" should ≥ {quantity}",
        "lte": "Quantity of \"{item}\" should ≤ {quantity}",
        "not": "Quantity of \"{item}\" should ≠ {quantity}",
        "natural": "Value of quantity should be a natural number"
      }
    }
  }
</i18n>

<template>
  <v-layout
    row
    wrap
    align-center
    justify-start
    class="px-1 pb-1"
  >
    <v-flex>
      <!-- <v-badge
        color="red"
        :value="quantity > 0"
        class="cursor-pointer reduction-badge"
      >
        <template v-slot:badge>
          <span @click="reduction">
            <v-icon>mdi-minus</v-icon>
          </span>
        </template> -->
      <v-badge
        :value="quantity > 0"
        right
        bottom
        color="secondary"
        overlap
        transition="scale-transition"
        origin="top left"
        class="cursor-pointer"
      >
        <template v-slot:badge>
          <span class="disabled">
            {{ quantity }}
          </span>
        </template>
        <div
          @click.left="increment"
          @click.right.prevent="reduction"
        >
          <Item
            :item="item"
            :ratio="0.8"
            :disable-tooltip="true"
            disable-link
          />
        </div>
      </v-badge>
      <!-- </v-badge> -->
    </v-flex>
  </v-layout>
</template>

<script>
  import get from '@/utils/getters'
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
      stage: {
        type: String,
        required: true
      },
      bus: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        rawQuantity: 0,
        disable: {
          actual: false, // the actual disable state of the component
          should: false // indicates the types have already been fulfilled, but the component should not been disabled due to errors in the input
        },
        error: false
      }
    },
    computed: {
      quantity: {
        get() {
          return this.rawQuantity
        },
        set(v) {
          this.rawQuantity = parseInt(v)
        }
      },
      limitations() {
        return get.limitations.byStageId(this.stage);
      },
      validationRules() {
        let limitation = this.limitations.itemQuantityBounds.find(v => v.itemId === this.item.itemId);
        if (!limitation) {
          return [];
        }
        const gte = (value) => {
          return (compare) => {
            return compare >= value ? true : this.$t('rules.gte', { item: this.item.name, quantity: value })
          }
        };

        const lte = (value) => {
          return (compare) => {
            return compare <= value ? true : this.$t('rules.lte', { item: this.item.name, quantity: value })
          }
        };

        const notIncludes = (values) => {
          return (compare) => {
            return values.indexOf(compare) === -1 ? true : this.$t('rules.not', { item: this.item.name, quantity: values.join(", ") })
          }
        };

        const isNatural = (compare) => {
          return ((compare >= 0.0) && (Math.floor(compare) === compare) && compare !== Infinity && !isNaN(compare)) ? true : this.$t('rules.natural');
        };

        return [
          gte(limitation.bounds.lower),
          lte(limitation.bounds.upper),
          notIncludes(limitation.bounds.exceptions),
          isNatural
        ]
      },
      valid() {
        return this.validForm(this.quantity)
      },
      exceedMax() {
        return !this.validForm(this.quantity + 1);
      },
      exceedMin() {
        return !this.validForm(this.quantity - 1);
      }
    },
    watch: {
      quantity: function (value) {
        // this form have no errors
        this.$emit("change", [this.item.itemId, value])
      },
      valid: function (value) {
        // the component should be disabled and it's now ready to do it
        if (this.valid && this.quantity === 0 && this.disable.should && !this.disable.actual) this.disable.actual = true;
        this.$emit("change:valid", value)
      }
    },
    mounted() {
      this.bus.$on("fulfilled", this.changeDisable);
      this.bus.$on("reset", this.reset)
    },
    methods: {
      increment() {
        this.quantity += 1;
      },
      reduction() {
        this.quantity = parseInt(this.quantity);
        this.quantity > 0 && (this.quantity -= 1);
        this.quantity <= 0 && (this.quantity = 0);
      },
      changeDisable(fulfilled) {
        if (fulfilled) {
          this.disable.should = true;
          if (this.quantity === 0 && this.valid) {
            this.disable.actual = true
          }
        } else {
          this.disable.should = false;
          this.disable.actual = false
        }
      },
      reset() {
        this.quantity = 0
      },
      validForm(quantity) {
        for (let rule of this.validationRules) {
          if (rule(quantity) !== true) return false
        }
        return true
      }
    }
  }
</script>

<style scoped>
  .quantity {
    font-family: Consolas, Courier New, Courier, monospace;
    font-weight: 700;
  }

  .disabled {
    user-select: none;
  }

  .stepper-button {
    padding: 0;
    color: black !important;
    transition: background-color 150ms cubic-bezier(.25,.8,.5,1) !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  /* ::v-deep .reduction-badge span.v-badge__badge.red {
    top: -5px;
    right: -5px;
  } */
</style>
