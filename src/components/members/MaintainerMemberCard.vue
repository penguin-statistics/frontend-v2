<template>
  <v-card class="bkop-light pt-2">
    <v-list-item>
      <v-list-item-avatar>
        <v-img
          :src="cdnDeliver(`/avatars/${member.avatar}`)"
          aspect-ratio="1"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ member.name }}
        </v-list-item-title>
        <v-list-item-title>
          {{ member.role }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
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
  name: "MaintainerMemberCard",
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