<template>
  <span class="d-inline-flex flex-column align-start">
    <span class="overline mb-1">
      {{ $t('matrixCategory.switch') }}
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
        {{ $t('matrixCategory.all') }}
      </v-btn>
      <v-btn
        v-haptic
        small
        value="automated"
      >
        {{ $t('matrixCategory.auto') }}
      </v-btn>
      <v-btn
        v-haptic
        small
        value="manual"
      >
        {{ $t('matrixCategory.manual') }}
      </v-btn>
    </v-btn-toggle>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MatrixCategoryToggle',
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapGetters('dataSource', ['category']),
    matrixCategory: {
      get () {
        return this.category
      },
      async set (value) {
        this.$store.commit('dataSource/changeCategory', value)
        this.$store.dispatch('data/refreshMatrix', true)
      }
    }
  }
}
</script>

<style scoped>
  .theme--light.data-source-switch {
    border: 1px solid rgba(0, 0, 0, .8);
  }
  .theme--dark.data-source-switch {
    border: 1px solid rgba(255, 255, 255, .6);
  }
</style>
