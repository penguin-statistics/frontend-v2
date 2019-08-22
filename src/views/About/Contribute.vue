<template>
  <v-card class="mx-auto bkop-light">
    <v-card-title>
      <span>
        {{ $t('contribute.repo') }}
        <v-chip
          class="ma-2"
          color="primary"
          text-color="white"
          @click="goToHref('https://github.com/penguin-statistics/frontend-v2')"
        >
          {{ $t('contribute.frontend') }}
          <v-icon right>mdi-github-circle</v-icon>
        </v-chip>
      </span>
      <span>
        <v-chip
          class="ma-2"
          color="primary"
          text-color="white"
          @click="goToHref('https://github.com/penguin-statistics/backend')"
        >
          {{ $t('contribute.backend') }}
          <v-icon right>mdi-github-circle</v-icon>
        </v-chip>
      </span>
    </v-card-title>

    <v-card-title>
      <div>{{ $t('contribute.contribute_0') }}</div>
    </v-card-title>

    <v-card-title>
      <div>
        <span>
          *
        </span>
        {{ $t('contribute.contribute_1') }}
      </div>
    </v-card-title>

    <v-card-title>
      <v-layout
        align-start
        justify-center
        column
        fill-height
      >
        <v-list class="transparent">
          <template v-for="skill in skills">
            {{ $t(`contribute.skills.${skill}`) }}
            <v-divider
              v-if="skill !== 'others'"
              :key="skill"
            />
          </template>
        </v-list>
      </v-layout>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'Contribute',
  data() {
    return {
      skills: [
        'frontend',
        'backend',
        'maintenance',
        'design',
        'analysis',
        'others'
      ]
    }
  },
  methods: {
    goToHref(href) {
      window.open(href)
    }
  }
}
</script>
