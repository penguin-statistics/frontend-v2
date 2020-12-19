<template>
  <v-dialog
    v-model="active"
    max-width="600px"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-haptic
        block
        large
        color="blue"
        outlined
        class="mb-2 black--text"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>
          mdi-share-variant
        </v-icon>
        {{ $t('share.name') }}
      </v-btn>
    </template>

    <v-card color="background overflow-hidden">
      <v-card-title class="headline my-1">
        <v-icon left>
          mdi-share-variant
        </v-icon>
        {{ $t('share.name') }}
      </v-card-title>

      <v-card-text class="pb-0">
        <v-container class="pt-0">
          <v-row class="flex-column">
            <v-text-field
              readonly
              hide-details
              outlined
              :label="$t('share.shortlink.name')"
              :value="link"
              class="monospace-pure my-2"
              append-icon="mdi-content-copy"
              @click:append="copy(link)"
            />
          </v-row>
          <v-row class="justify-start mt-4 position-relative flex-nowrap overflow-x-auto">
            <div
              v-for="social in socials"
              :key="social.id"
              class="d-flex flex-column align-center justify-center text-center mr-3"
              style="width: 60px"
            >
              <v-btn
                v-haptic
                large
                icon
                depressed
                class="mb-1"
                color="white"
                :style="{'background-color': social.color}"
                @click="shareViaSocial(social)"
              >
                <v-icon :size="24">
                  {{ social.icon }}
                </v-icon>
              </v-btn>
              <span class="cursor-default font-condensed">{{ social.name }}</span>
            </div>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-haptic
          text
          @click="active = false"
        >
          {{ $t('meta.dialog.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as clipboard from "clipboard-polyfill";
import snackbar from "@/utils/snackbar";
import humans from "@/utils/humans";
import Console from "@/utils/Console";
import strings from "@/utils/strings";
import share from "@/utils/native/share";
import environment from "@/utils/environment";

export default {
  name: "Share",
  props: {
    stage: {
      type: Object,
      default: () => {}
    },
    item: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    data() {
      if (this.stage !== {}) {
        return this.stage
      } else if (this.item !== {}) {
        return this.item
      } else {
        Console.warn('Share', 'malformed share object defined: none of the props are defined')
        return {}
      }
    },
    id () {
      if (this.data.itemId) return this.data.itemId
      if (this.data.stageId) {
        if (this.data.isGacha) {
          return this.data.stageId
        } else {
          return this.data.code
        }
      }
      return ''
    },
    name () {
      if (this.data.stageId) {
        return `${this.$t('stage.name')} "${strings.translate(this.data, 'code')}"`
      } else {
        return `${this.$t('item.name')} "${strings.translate(this.data, 'name')}"`
      }
    },

    link() {
      return `https://exusi.ai/${this.id}`;
    },

    socials() {
      // const copy = this.copy
      let socials
      if (environment.runtime.isApp) {
        socials = [
          {
            "id": "native",
            "name": "Share",
            "icon": "mdi-export-varient",
            canShare: !!navigator.share,
            share({text, url}) {
              return share({text, url})
            }
          }
        ]
      } else {
        socials = [
          // {
          //   "id": "copy-link",
          //   "name": "Copy Link",
          //   "icon": "mdi-content-copy",
          //   canShare: true,
          //   share({url}) {
          //     return copy(url)
          //   }
          // },
          ...humans.socials,
          {
            "id": "native",
            "name": "More",
            "icon": "mdi-dots-horizontal",
            canShare: !!navigator.share,
            share({text, url}) {
              return share({text, url})
            }
          },
        ]
      }
      return socials.filter(el => el.canShare)
    }
  },
  methods: {
    copy(content) {
      clipboard.writeText(content)
          .then(() => {
            snackbar.launch("success", 5000, "clipboard.success")
          })
          .catch(() => {
            snackbar.launch("error", 5000, "clipboard.error")
          })
    },
    shareViaSocial(social) {
      social.share({
        text: this.$t('share.text', {name: this.name}),
        url: this.link
      })
      setTimeout(() => {
        snackbar.launch("success", 5000, "share.success")
      }, 0)
    }
  },
}
</script>

<style scoped>

</style>