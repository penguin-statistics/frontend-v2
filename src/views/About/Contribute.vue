<template>
  <v-card
    elevation="5"
    class="bkop-light pa-6"
    style="height: 100%"
  >
    <h1 class="headline">
      {{ $t("menu.about.contribute") }}
    </h1>
    <div class="caption my-2">
      * {{ $t("contribute.contribute_1") }}
    </div>

    <v-row
      class="mx-0 py-1 transparent outline"
      align="center"
      justify="center"
    >
      <v-btn
        v-haptic
        href="https://github.com/penguin-statistics/frontend-v2"
        target="_blank"
        rel="noopener"
        :class="{
          'mx-2': $vuetify.breakpoint.smAndUp,
          'mx-1': $vuetify.breakpoint.xsOnly,
        }"
        text
      >
        {{ $t("contribute.frontend") }}
        <v-icon right>
          mdi-github-circle
        </v-icon>
      </v-btn>

      <v-divider vertical />

      <v-btn
        v-haptic
        href="https://github.com/penguin-statistics/backend-next"
        target="_blank"
        rel="noopener"
        :class="{
          'mx-2': $vuetify.breakpoint.smAndUp,
          'mx-1': $vuetify.breakpoint.xsOnly,
        }"
        text
      >
        {{ $t("contribute.backend") }}
        <v-icon right>
          mdi-github-circle
        </v-icon>
      </v-btn>
    </v-row>

    <p class="subtitle-1 pl-0 mt-2">
      {{ $t("contribute.contribute_0") }}
    </p>

    <ul class="ml-2 mb-2">
      <li>
        <v-icon small>
          mdi-penguin
        </v-icon>
        {{ $t("contribute.qq_group") }}747099627
      </li>
      <li>
        <v-chip
          link
          small
          href="https://discord.gg/uEXJcue"
          target="_blank"
          rel="noopener"
        >
          <v-icon
            left
            small
          >
            mdi-discord
          </v-icon>
          Discord
        </v-chip>
      </li>
    </ul>

    <ul class="ml-2">
      <li
        v-for="(skill, key) in skills"
        :key="key"
        class="subtitle-2"
      >
        <v-icon
          v-if="skill === 'mobile'"
          small
          style="margin-top: -2px"
        >
          mdi-alert-decagram
        </v-icon>
        {{ $t(`contribute.skills.${skill}`) }}
      </li>
    </ul>

    <v-divider class="my-2" />

    <v-row
      justify="center"
      align="center"
    >
      <v-col
        v-for="link in links"
        :key="link.title"
        cols="12"
      >
        <BackdropCard
          hover
          :href="link.url"
          target="_blank"
          rel="noopener"
        >
          <template #backdrop>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </template>

          <v-icon
            x-large
            style="opacity: 0.9"
          >
            {{ link.icon }}
          </v-icon>

          <h2 class="heading my-1">
            {{ $t(link.title) }}
            <v-icon
              v-if="link.external"
              small
            >
              mdi-open-in-new
            </v-icon>
          </h2>
          <h3 class="subtitle-2">
            {{ $t(link.subtitle) }}
          </h3>
        </BackdropCard>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import BackdropCard from "@/components/global/BackdropCard";

export default {
  name: "Contribute",
  components: {
    BackdropCard,
  },
  data() {
    return {
      skills: [
        "frontend",
        "backend",
        "mobile",
        "maintenance",
        "design",
        "analysis",
      ],
      links: [
        // {
        //   url: "https://developer.penguin-stats.io/docs/",
        //   icon: "mdi-api",
        //   title: "link.api",
        //   external: true
        // },
        {
          url: "https://developer.penguin-stats.io",
          icon: "mdi-dev-to",
          title: "link.docs.title",
          subtitle: "link.docs.subtitle",
          external: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.outline {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.54) !important;
  border-radius: 4px;
}
</style>
