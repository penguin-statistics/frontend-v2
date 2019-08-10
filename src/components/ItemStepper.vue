<i18n>
  {
    "zh": {
      "rules": {
        "gte": "“{item}” 应多于或等于 {quantity}",
        "lte": "“{item}” 应少于或等于 {quantity}",
        "not": "“{item}” 的数量应不等于 {quantity}",
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
    }
  }
</i18n>

<template>
  <v-layout
    row
    wrap
    align-center
    justify-start
  >
    <v-flex>
      <Item
        :item="item"
        :ratio="0.75"
        disable-link
      />
    </v-flex>

    <v-flex>
      <v-btn
        flat
        icon
        :disabled="disable.actual || exceed.max"

        @click="increment"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-flex>

    <v-flex>
      <span
        class="quantity title"
        :class="{ 'grey--text disabled': disable.actual }"
      >
        {{ quantity }}
      </span>
    </v-flex>

    <v-flex>
      <v-btn
        flat
        icon
        :disabled="disable.actual || exceed.min"

        @click="reduction"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-flex>
    <!--    <v-text-field-->
    <!--      ref="quantityInput"-->
    <!--      v-model="quantity"-->

    <!--      label="数量"-->
    <!--      type="number"-->

    <!--      outline-->

    <!--      :rules="validationRules"-->
    <!--      append-icon="mdi-minus"-->
    <!--      :disabled="disable.actual"-->

    <!--      prepend-inner-icon="mdi-plus"-->

    <!--      @click:append="reduction(item.itemId)"-->

    <!--      @click:prepend-inner="increment(item.itemId)"-->

    <!--      @update:error="status => error = status"-->
    <!--    >-->
    <!--      <template v-slot:prepend />-->
    <!--    </v-text-field>-->
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
    data () {
      return {
        rawQuantity: 0,
        disable: {
          actual: false, // the actual disable state of the component
          should: false // indicates the types have already been fulfilled, but the component should not been disabled due to errors in the input
        },
        exceed: {
          min: false,
          max: false
        },
        error: false
      }
    },
    computed: {
      quantity: {
        get () {
          return this.rawQuantity
        },
        set (v) {
          this.rawQuantity = parseInt(v)
        }
      },
      limitations () {
        return get.limitations.byStageId(this.stage);
      },
      validationRules () {
        let limitation = this.limitations.itemQuantityBounds.find(v => v.itemId === this.item.itemId);
        const gte = (value) => {
          return (compare) => {
            return compare >= value ? true : this.$t('rules.gte', {item: this.item.name, quantity: value})
          }
        };

        const lte = (value) => {
          return (compare) => {
            return compare <= value ? true : this.$t('rules.lte', {item: this.item.name, quantity: value})
          }
        };

        const notIncludes = (values) => {
          return (compare) => {
            return values.indexOf(compare) === -1 ? true : this.$t('rules.not', {item: this.item.name, quantity: values.join(", ")})
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
      valid () {
        return this.validForm(this.quantity)
      }
    },
    watch: {
      quantity: function (value) {
        if (!this.valid) return;
        this.$emit("change", [this.item.itemId, value])
      },
      valid: function (value) {
        // the component should be disabled and it's now ready to do it
        if (this.valid && this.quantity === 0 && this.disable.should && !this.disable.actual) this.disable.actual = true;
        this.$emit("change:valid", value)
      }
    },
    mounted () {
      this.updateExceed();
      this.bus.$on("fulfilled", this.changeDisable);
      this.bus.$on("reset", this.reset)
    },
    methods: {
      updateExceed () {
        this.exceed.max = !this.validForm(this.quantity + 1);
        this.exceed.min = !this.validForm(this.quantity - 1);
        // console.log("quantity", this.quantity, "max", this.exceed.max, "min", this.exceed.min, "min1", !this.validForm(this.quantity - 1), "min2", this.quantity - 1 === 0)
      },
      increment () {
        this.validForm(this.quantity + 1) && (this.quantity += 1);
        this.updateExceed();
      },
      reduction () {
        this.quantity = parseInt(this.quantity);
        this.quantity > 0 && (this.quantity -= 1);
        this.quantity <= 0 && (this.quantity = 0);
        this.updateExceed()
      },
      changeDisable (fulfilled) {
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
      reset () {
        this.quantity = 0;
        this.updateExceed()
      },
      validForm (quantity) {
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
</style>
