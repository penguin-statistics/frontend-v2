<i18n>
{
	"en": {
		"update": {
			"refresh": "Refresh",
			"success": "Website Updated!"
		}
	},
	"ja": {
		"update": {
			"refresh": "",
			"success": ""
		}
	},
	"ko": {
		"update": {
			"refresh": "",
			"success": ""
		}
	},
	"zh": {
		"update": {
			"refresh": "体验新版",
			"success": "更新啦！"
		}
	}
}
</i18n>

<template>
  <v-snackbar
    v-model="update.enabled"
    color="success"
    :timeout="0"
    bottom
  >
    <v-row
      align="center"
      class="mx-0"
    >
      <v-icon class="mr-4">
        mdi-file-check
      </v-icon>

      {{ $t('update.success') }}

      <v-spacer />

      <v-btn
        class="ml-4"
        color="secondary"
        depressed
        :loading="update.loading"
        @click="refresh"
      >
        <v-icon
          small
          class="mr-1"
        >
          mdi-refresh
        </v-icon>
        {{ $t('update.refresh') }}
      </v-btn>
    </v-row>
  </v-snackbar>
</template>

<script>
  export default {
    name: "PWAPopups",
    data() {
      return {
        update: {
          enabled: false,
          loading: false,
        }
      }
    },
    created () {
      if (this.$workbox) {
        this.$workbox.addEventListener("waiting", () => {
          this.update.enabled = true;
        });
      }
    },
    methods: {
      async refresh() {
        this.update.loading = true;
        await this.$workbox.messageSW({ type: "SKIP_WAITING" });
      },
    },
  }
</script>

<style scoped>

</style>