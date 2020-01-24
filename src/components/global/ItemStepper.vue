<template>
  <v-row
    align="center"
    justify="center"
    class="pr-1 pb-1"
  >
    <v-col>
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
            :ratio="1"
            disable-link
            tooltip-position="bottom"
          />
        </div>
      </v-badge>

      <template v-if="item.itemType === 'ACTIVITY_ITEM_BATCH'">
        <v-row
          class="flex"

          align="center"
          justify="center"
        >
          <div class="text-center mt-2">
            <v-btn
              small
              class="add-quantity-btn"
              @click="increaseQuantity(10)"
            >
              +10
            </v-btn>
          </div>
        </v-row>
      </template>

      <!-- </v-badge> -->
    </v-col>
  </v-row>
</template>

<script>
  import Item from '@/components/global/Item'

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
      bus: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        quantity: 0
      }
    },
    watch: {
      quantity: function (newValue, oldValue) {
        let diff = newValue - oldValue;
        this.$emit("change", [this.item.itemId, diff])
      }
    },
    mounted() {
      this.bus.$on("reset", this.reset)
    },
    methods: {
      increment() {
        this.quantity++;
      },
      increaseQuantity(quantity) {
        this.quantity += quantity;
      },
      reduction() {
        // -1 when greater than 0 to avoid negative number
        // (will not reduce when =0)
        (this.quantity > 0) && this.quantity --
      },
      reset() {
        this.quantity = 0
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

  ::v-deep .add-quantity-btn {
    margin: 0;
    min-width: 32px;
  }

  /* ::v-deep .reduction-badge span.v-badge__badge.red {
    top: -5px;
    right: -5px;
  } */
</style>
