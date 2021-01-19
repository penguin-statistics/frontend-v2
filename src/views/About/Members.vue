<template>
  <div>
    <v-row
      justify="space-around"
    >
      <v-col
        cols="12"
        sm="12"
        md="6"
        lg="6"
        xl="5"
      >
        <!--        <v-subheader>-->
        <!--          {{ $t('members.categories.owner') }}-->
        <!--        </v-subheader>-->
        <MaintainerMemberCard :member="profiles.owner" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="6"
        lg="6"
        xl="5"
      >
        <!--        <v-subheader>-->
        <!--          {{ $t('members.categories.maintainer') }}-->
        <!--        </v-subheader>-->
        <MaintainerMemberCard :member="profiles.maintainer" />
      </v-col>
    </v-row>
    <v-row
      dense
      justify="start"
    >
      <v-col
        cols="12"
        class="pa-0"
      >
        <v-subheader>
          {{ $t('members.categories.contributors') }}
        </v-subheader>
      </v-col>
      <v-col
        v-for="contributor in profiles.contributors"
        :key="contributor.name"
        xl="2"
        md="2"
        sm="3"
        class="col-xs-1-2 align-self-stretch"
        cols="6"
      >
        <ContributorMemberCard
          :member="contributor"
          class="align-self-stretch fill-height members--list-item"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import anime from "animejs";
  import CDN from "@/mixins/CDN";
  import MaintainerMemberCard from "@/components/members/MaintainerMemberCard";
  import ContributorMemberCard from "@/components/members/ContributorMemberCard";
  import members from "@/utils/humans";

  const c = {
    owner: "owner",
    maintainer: "maintainer",
  }

  const r = members.responsibilities;
  export default {
    name: 'Members',
    components: {ContributorMemberCard, MaintainerMemberCard},
    mixins: [CDN],
    data() {
      return {
        profiles: {
          owner: {
            name: "AlvISs_红白",
            role: c.owner,
            responsibility: [
              r.v1frontend,
              r.backend,
              r.maintenance,
              r.customersupport
            ],
            avatar: "hongbai.jpg",
            socials: {
              weibo: "https://www.weibo.com/u/6434065694",
              twitter: "https://twitter.com/AlvISs_Reimu",
              github: "https://github.com/AlvISsReimu",
              qq: "https://wpa.qq.com/msgrd?v=3&uin=498704999&site=qq&menu=yes",
              email: "mailto:alvissreimu@gmail.com"
            }
          },
          maintainer: {
            name: "GalvinGao",
            role: c.maintainer,
            responsibility: [
              r.frontend,
              r.maintenance,
              r.widget,
              r.customersupport
            ],
            avatar: "gg.jpg",
            socials: {
              github: "https://github.com/GalvinGao",
              qq: "https://sighttp.qq.com/authd?IDKEY=19180d0365c9c1bdc56191cecdc6524eb938295d1d609625",
              email: "mailto:me@galvingao.com"
            }
          },
          contributors: [
            {
              name: "YukiC",
              responsibility: [
                r.backend
              ],
              avatar: "yukic.jpg",
              socials: {
                github: "https://github.com/cyj5230"
              }
            },
            {
              name: "根派",
              responsibility: [
                r.arkplanner
              ],
              avatar: "genpai.jpg",
              socials: {
                github: "https://github.com/SQRPI"
              }
            },
            {
              name: "🦀",
              responsibility: [
                r.arkplanner
              ],
              avatar: "xie.jpeg",
              socials: {
                github: "https://github.com/ycremar"
              }
            },
            {
              name: "AsahiLuna",
              responsibility: [
                r.frontend
              ],
              avatar: "luna.png",
              socials: {
                github: "https://github.com/AsahiLuna"
              }
            },
            {
              name: "Syaro",
              responsibility: [
                r.localization.ko
              ],
              avatar: "syaro.png",
              socials: {
                twitter: "https://twitter.com/StarNight_ko"
              }
            },
            {
              name: "方舟航海図",
              responsibility: [
                r.localization.ja
              ],
              avatar: "koukaizu.jpg",
              socials: {
                twitter: "https://twitter.com/Arkn1ghts"
              }
            },
            {
              name: "Kumo ☁️",
              responsibility: [
                r.localization.ja
              ],
              avatar: "kumo.jpg",
              socials: {
                github: "https://github.com/KumoSiunaus",
                weibo: "https://weibo.com/673465600",
                twitter: "https://twitter.com/Kumo_Siunaus",
                email: "mailto:kumosiunaus@gmail.com"
              }
            },
            {
              name: "Einzithy.D",
              responsibility: [
                r.statistics
              ],
              avatar: "j.png",
              socials: {
                github: "https://github.com/Einzithy-D"
              }
            },
            {
              name: "Blealtan",
              responsibility: [
                r.frontend
              ],
              avatar: "blealtan.png",
              socials: {
                github: "https://github.com/Blealtan"
              }
            },
            {
              name: "ChoKhoOu",
              responsibility: [
                r.backend
              ],
              avatar: "chokhoou.jpg",
              socials: {
                github: "https://github.com/ChoKhoOu"
              }
            },
            {
              name: "侠",
              responsibility: [
                r.logo
              ],
              avatar: "xia.png",
              socials: {
                weibo: "https://www.weibo.com/u/2290638732"
              }
            },
            {
              name: "ウィン",
              responsibility: [
                r.localization.ja
              ],
              avatar: "win.png",
              socials: {
                twitter: "https://twitter.com/Winterer000000"
              }
            },
            {
              name: "SrO²",
              responsibility: [
                r.bulkupload
              ],
              avatar: "sr.png",
              socials: {
                github: "https://github.com/Strontium233"
              }
            },
            {
              name: "冰糖雪梨橙#9594",
              responsibility: [
                r.frontend
              ],
              avatar: "wish.png",
              socials: {
                github: "https://github.com/jdgjxxchy"
              }
            },
            {
              name: "darkness",
              responsibility: [
                r.maintenance
              ],
              avatar: "darkness.jpg",
              socials: {
                github: "https://github.com/darknessWONG"
              }
            },
            {
              name: "路夏早苗",
              responsibility: [
                r.frontend
              ],
              avatar: "sanae.jpeg",
              socials: {
                github: "https://github.com/RokaSanae"
              }
            },
            {
              name: "ChaosNiku",
              responsibility: [
                r.backend
              ],
              avatar: "chaosniku.png",
              socials: {
                github: "https://github.com/ChaosNiku"
              }
            },
            {
              name: "Nemunemu",
              responsibility: [
                r.customersupport
              ],
              avatar: "nemunemu.jpg",
              socials: {
                weibo: "https://www.weibo.com/nemunemu"
              }
            },
            {
              name: "水晶泡芙",
              responsibility: [
                r.materials
              ],
              avatar: "paofu.png",
              socials: {
                github: "https://github.com/Evealicemier"
              }
            }
          ]
        }
      }
    },
    mounted() {
      anime({
        targets: '.members--list-item',
        translateY: [48, 0],
        opacity: [0, 1],
        duration: 775,
        delay: (el, i) => i * 35,
        easing: "easeOutQuint"
      })
      // anime({
      //   targets: '.members--list',
      //   translateY: [48, 0],
      //   opacity: [0, 1],
      //   duration: 425,
      //   delay: (el, i) => i * 175,
      //   easing: "easeOutQuint"
      // })
    }
  }
</script>

<style scoped>
  .cursor-default {
    cursor: default;
  }

  .collaborator-profile {
    min-width: 45%;
  }
</style>
