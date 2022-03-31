<template>
  <div
    :class="{
      'drawer-logo primary': true,
      'darken-2': dark,
      'drawer-logo--two-line': $t('app.name_line2') !== '',
    }"
  >
    <!--    <v-img-->
    <!--      :src="cdnDeliver('/images/themes/new-year/portrait.jpg')"-->
    <!--      style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0.3; z-index: 0"-->
    <!--    />-->
    <v-img
      :src="
        cdnDeliver(
          $store.getters['ui/aprilFools']
            ? '/logos/20210401/reunion_logo.png'
            : '/logos/20210401/reunion_future.png'
        )
      "
      aspect-ratio="1"
      height="128px"
      contain
    />
    <div class="white--text description">
      <v-row
        align="center"
        justify="center"
        class="flex-column font-weight-bold text-glow--flipped"
      >
        <span>{{ $t("app.name_line1") }}</span>
        <span>{{ $t("app.name_line2") }}</span>
        <v-btn
          dark
          outlined
          class="mt-4"
          text
          @click="switchAprilFools"
        >
          {{
            $store.getters["ui/aprilFools"]
              ? $t("aprilFools.switcher.current")
              : $t("aprilFools.switcher.past")
          }}
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import Theme from "@/mixins/Theme";
import CDN from "@/mixins/CDN";

export default {
  name: "Logo",
  mixins: [Theme, CDN],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    switchAprilFools() {
      const aprilFoolsState = this.$store.getters["ui/aprilFools"];
      console.log(aprilFoolsState);
      if (aprilFoolsState) {
        this.$store.commit("ui/setAprilFools", false);
      } else {
        this.$confirm(this.$t("aprilFools.confirm.subtitle"), {
          title: this.$t("aprilFools.confirm.title"),
          subtitle: this.$t("aprilFools.confirm.subtitle"),
          color: "warning",
        }).then((permit) => {
          if (permit) this.$store.commit("ui/setAprilFools", true);
        });
      }
    },
  },
};
</script>

<style scoped></style>
