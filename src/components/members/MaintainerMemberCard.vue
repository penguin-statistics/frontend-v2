<template>
  <v-card class="bkop-light pt-2">
    <v-list-item
      class="d-inline-flex mx-auto"
    >
      <v-list-item-avatar
        :size="64"
      >
        <v-img
          :src="cdnDeliver(`/avatars/${member.avatar}`)"
          aspect-ratio="1"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ member.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="subtitle-1">
          {{ $t('members.categories.' + member.role) }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      <v-list
        subheader
        class="background"
      >
        <v-subheader v-text="$t('members.responsibilities._name')" /> 
        <MemberResponsibility
          v-for="responsibility in member.responsibility"
          :key="member.name + '_' + responsibility.id"
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
        rel="noreferrer noopener"
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
  name: "MaintainerMemberCard",
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