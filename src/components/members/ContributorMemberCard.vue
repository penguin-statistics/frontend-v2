<template>
  <v-card class="bkop-light pt-1 d-flex flex-column justify-center">
    <v-card-title class="text-center d-flex flex-column">
      <v-avatar
        class="mx-auto mb-2"
        :size="64"
      >
        <v-img
          :src="cdnDeliver(`/avatars/${member.avatar}`)"
          aspect-ratio="1"
        />
      </v-avatar>
      
      {{ member.name }}
    </v-card-title>
    <v-card-text>
      desc
    </v-card-text>
    <v-card-actions class="d-flex flex-row justify-center">
      <v-btn
        v-for="[id, url] in Object.entries(member.socials)"
        :key="`${member.name}-${id}`"
        icon
        :href="url"
        target="_blank"
        rel="noreferrer noopener"
        :title="$t(`socials.${id}`)"
      >
        <v-icon>
          {{ getSocial(id).icon }}
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CDN from "@/mixins/CDN";
import members from "@/utils/members";

export default {
  name: "ContributorMemberCard",
  mixins: [CDN],
  props: {
    member: {
      type: Object,
      required: true
    },
  },
  methods: {
    getSocial: members.getSocial
  },
}
</script>

<style scoped>

</style>