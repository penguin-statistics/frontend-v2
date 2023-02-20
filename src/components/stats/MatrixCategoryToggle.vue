<template>
  <span class="d-inline-flex flex-column align-start">
    <span class="overline mb-1">
      {{ $t("matrixCategory.switch") }}
    </span>

    <v-btn-toggle
      v-model="matrixCategory"
      active-class="font-weight-bold"
      mandatory
      borderless
      class="data-source-switch mr-2"
    >
      <v-btn
        v-haptic
        small
        value="all"
      >
        {{ $t("matrixCategory.all.label") }}
      </v-btn>
      <TooltipBtn
        v-haptic
        small
        value="automated"
        :tip="$t('matrixCategory.automated.tooltip')"
        :tooltip-props="{ 'max-width': 300 }"
      >
        {{ $t("matrixCategory.automated.label") }}
      </TooltipBtn>
      <TooltipBtn
        v-haptic
        small
        :tip="$t('matrixCategory.manual.tooltip')"
        value="manual"
        :tooltip-props="{ 'max-width': 300 }"
      >
        {{ $t("matrixCategory.manual.label") }}
      </TooltipBtn>
    </v-btn-toggle>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import TooltipBtn from "../global/TooltipBtn.vue";
export default {
  name: "MatrixCategoryToggle",
  computed: {
    ...mapGetters("auth", ["loggedIn"]),
    ...mapGetters("dataSource", ["category"]),
    matrixCategory: {
      get() {
        return this.category;
      },
      async set(value) {
        this.$store.commit("dataSource/changeCategory", value);
        this.$store.dispatch("data/refreshMatrix", true);
      },
    },
  },
  components: { TooltipBtn },
};
</script>

<style scoped>
.theme--light.data-source-switch {
  border: 1px solid rgba(0, 0, 0, 0.8);
}
.theme--dark.data-source-switch {
  border: 1px solid rgba(255, 255, 255, 0.6);
}
</style>
