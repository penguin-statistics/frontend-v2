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
    <v-card-text class="flex-grow-1">
      <v-list
        dense
        subheader
      >
        <v-subheader v-text="$t('members.responsibilities._name')" />
        <MemberResponsibility
          v-for="responsibility in member.responsibility"
          :key="member.name + '_' + responsibility.id"
          dense
          :responsibility="responsibility"
        />
      </v-list>
    </v-card-text>
    <v-card-actions class="d-flex flex-row justify-center">
      <v-btn
        v-for="[id, url] in Object.entries(member.socials)"
        :key="`${member.name}-${id}`"
        icon
        :href="url"
        target="_blank"
        rel="noopener"
        :title="$t(`members.socials.${id}`)"
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
import members from "@/utils/humans";
import MemberResponsibility from "@/components/members/MemberResponsibility";

export default {
  name: "ContributorMemberCard",
  components: {MemberResponsibility},
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