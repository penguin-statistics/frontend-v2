<template>
  <v-card
    class="d-flex flex-column link-card bkop-light position-relative"
  >
    <v-card-title
      v-if="link.title"
      primary-title
      class="px-4 pt-4 pb-2"
    >
      <div>
        <div class="title">
          {{ link.title }}
        </div>
        <span
          v-if="link.author"
          class="subtitle-1"
        >by {{ link.author }}</span>
      </div>
    </v-card-title>

    <v-card-title
      v-if="link.features"
      primary-title
      class="px-4 py-1"
    >
      <v-chip
        v-for="(feature, featIndex) in link.features"
        :key="featIndex"
        :color="feature.color"
        class="ma-1"

        text-color="white"
      >
        {{ $t(`links.tags.${feature.name}`) }}
      </v-chip>
    </v-card-title>

    <v-card-text v-if="link.description">
      <p
        v-marked
        class="markdown-content-inline"
        v-text="link.description"
      />
    </v-card-text>

    <v-row
      v-if="link.url"
      class="flex-grow-1 px-4 pt-2"
      align="end"
      justify="center"
    >
      <v-btn
        v-ripple
        color="secondary"
        class="ma-2 mb-4"
        text-color="white"
        :href="link.url"
        target="_blank"
        rel="noopener"
        @click="$emit('navigate', link.url)"
      >
        <span
          class="subtitle-1 "
          style="text-transform: initial"
        >
          {{ link.shorten }}
        </span>
        <v-icon
          right
          small
        >
          mdi-open-in-new
        </v-icon>
      </v-btn>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: 'LinkCard',
  props: {
    link: Object
  }
}
</script>
<style scoped>
.link-card {
  width: 100%;
  /*border: 1px solid rgba(255, 255, 255, 0.75) !important;*/
}

.theme--light .link-card {
  /*border: 1px solid rgba(0, 0, 0, 0.75) !important;*/
}
</style>
