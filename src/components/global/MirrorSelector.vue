<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="550px"
    >
      <v-card
        class="py-2 px-1"
        style="z-index: 2147483648"
      >
        <v-card-title class="headline">
          <v-icon left>
            mdi-message-bulleted-off
          </v-icon>
          {{ $t('mirrors._notification.ignore.title') }}
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1">
            {{ $t('mirrors._notification.ignore.subtitle') }}
          </p>
        </v-card-text>
        <v-card-actions class="mx-4">
          <v-spacer />
          <v-btn
            v-haptic
            text
            @click="() => {dialog = false; enabled = true}"
          >
            {{ $t('meta.dialog.cancel') }}
          </v-btn>
          <v-btn
            v-haptic
            color="error"
            @click="ignore"
          >
            <v-icon left>
              mdi-cancel
            </v-icon>

            {{ $t('meta.dialog.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-if="enabled && mirror"
      v-model="enabled"
      :color="`stripped--${dark ? 'dark' : 'light'}`"
      :timeout="0"
      top
    >
      <v-row
        align="center"
        :class="`mx-0 d-flex align-center font-weight-bold ${color}--text`"
      >
        <v-icon
          :color="color"
          class="mr-3"
        >
          mdi-earth
        </v-icon>

        <i18n
          :class="`${color}--text d-inline-block align-center`"
          tag="span"
          :path="`mirrors.${mirror}.notification`"
        >
          <v-btn
            v-haptic
            small
            outlined
            class="mx-1"
            :loading="busy"

            @click="redirect(link.v)"
          >
            <v-icon
              small
              left
            >
              mdi-link-box-variant
            </v-icon>
            <span class="normal">
              {{ link.t }}
            </span>
          </v-btn>
        </i18n>

        <v-spacer />

        <v-btn
          v-haptic
          icon
          x-small
          class="ml-2"
          :color="color"
          @click="() => {dialog = true; enabled = false}"
        >
          <v-icon small>
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
    </v-snackbar>
  </div>
</template>

<script>
  import Theme from "@/mixins/Theme";
  import external from "@/apis/external";
  import Console from "@/utils/Console";
  import Mirror from "@/mixins/Mirror";
  import {mapGetters} from "vuex";

  export default {
    name: "MirrorSelector",
    mixins: [Theme, Mirror],
    data() {
      return {
        enabled: false,
        mirror: null, // must be "cn" or "global"
        dialog: false,
        busy: false
      }
    },
    computed: {
      ...mapGetters("mirror", ["ignoreNotification"]),
      color() {
        return this.dark ? "white" : "black";
      },
      link () {
        if (this.mirror === "cn") {
          return {
            t: "penguin-stats.cn",
            v: "https://penguin-stats.cn/?utm_source=penguin-stats&utm_medium=mirror-notification"
          }
        } else if (this.mirror === "global") {
          return {
            t: "penguin-stats.io",
            v: "https://penguin-stats.io/?utm_source=penguin-stats&utm_medium=mirror-notification"
          }
        } else {
          return null
        }
      }
    },
    created () {
      if (this.ignoreNotification) {
        Console.info("MirrorSelector", "ignored notification")
      } else {
        external.geoip()
          .then(({data}) => {
            Console.info("MirrorSelector", "successfully retrived geoip info", data)
            if (data["country_code"] === "CN") {
              this.mirror = "cn"
            } else {
              this.mirror = "global"
            }
            if (
              (this.isCNMirror && this.mirror === "global") ||
              (!this.isCNMirror && this.mirror === "cn")
            ) {
              this.enabled = true
              this.$ga.event(
                'mirror',
                'notification',
                'opened',
                this.mirror
              )
            }
            Console.info("MirrorSelector", "current mirror:", this.mirror, "| popup?", this.enabled)
          })
          .catch((err) => {
            this.$ga.event(
              'mirror',
              'notification',
              'get_ip_failed'
            )
            Console.warn("MirrorSelector", "failed to refresh geoip information", err)
          })
      }
    },
    methods: {
      ignore() {
        this.enabled = false;
        this.$store.commit("mirror/changeIgnoreNotification", true)
        this.dialog = false;
        this.$ga.event(
          'mirror',
          'notification',
          'ignored',
          this.mirror
        )
      },
      redirect(link) {
        this.$store.commit("mirror/changePreference", this.mirror)
        this.busy = true
        this.$ga.event(
          'mirror',
          'notification',
          'redirected',
          this.mirror,
          {
            transport: 'beacon'
          }
        )
        window.location = link;
      }
    },
  }
</script>

<style>
.stripped--dark {
  background: repeating-linear-gradient(
      -45deg,
      rgb(82, 140, 69),
      rgb(82, 140, 69) 45px,
      rgb(105, 172, 90) 45px,
      rgb(105, 172, 90) 90px
  ) !important;
}
.stripped--light {
  background: repeating-linear-gradient(
      -45deg,
      rgb(105, 172, 90),
      rgb(105, 172, 90) 45px,
      rgb(146, 197, 138) 45px,
      rgb(146, 197, 138) 90px
  ) !important;
}
  .normal {
    font-size: 12px;
    text-transform: initial !important;
    letter-spacing: .03rem !important;
  }
</style>