<template>
  <v-card class="background">
    <v-card-title
      class="indigo pb-4 elevation-2 white--text"
      style="background: #a14042; line-height: 1.1;"
    >
      <div
        class="overline d-block"
        style="width: 100%"
      >
        {{ subtitle }}
      </div>
      <br>
      <div
        class="headline font-weight-bold d-block"
        style="width: 100%"
      >
        {{ title }}
      </div>
    </v-card-title>
    <v-card-text class="overflow-auto">
      <slot />
    </v-card-text>

    <v-card-actions class="elevation-4">
      <v-btn
        v-haptic
        text
        block
        large
        @click="$emit('close')"
      >
        <v-divider style="opacity: 0.3" />
        <span class="mx-4 d-flex align-center">
          <v-icon left>mdi-close</v-icon>{{ $t('meta.dialog.close') }}
        </span>
        <v-divider style="opacity: 0.3" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DialogCard',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
