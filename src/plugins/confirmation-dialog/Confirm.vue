<template>
  <v-dialog
    eager
    value="true"
    :max-width="width"
    :persistent="persistent"
    @input="change"
    @keydown.esc="choose(false)"
  >
    <v-card tile>
      <v-toolbar
        v-if="Boolean(title)"
        dark
        :color="color"
        flat
      >
        <v-icon
          v-if="Boolean(icon)"
          left
        >
          {{ icon }}
        </v-icon>
        <v-toolbar-title
          class="white--text"
          v-text="title"
        />
      </v-toolbar>
      <v-card-text
        v-marked
        class="body-1 py-3"
        v-text="message"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :color="buttonFalseColor"
          text
          @click="choose(false)"
          v-text="buttonFalseText"
        />
        <v-btn
          :color="color || buttonTrueColor"
          @click="choose(true)"
          v-text="buttonTrueText"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { VCard, VCardActions, VCardText, VDialog, VIcon, VToolbar, VToolbarTitle, VSpacer, VBtn } from 'vuetify/lib'

export default {
  components: {
    VCard,
    VCardActions,
    VCardText,
    VDialog,
    VIcon,
    VToolbar,
    VToolbarTitle,
    VSpacer,
    VBtn
  },
  props: {
    buttonTrueText: {
      type: String,
      default: function () {
        return this.$t('meta.dialog.confirm')
      }
    },
    buttonFalseText: {
      type: String,
      default: function () {
        return this.$t('meta.dialog.cancel')
      }
    },
    buttonTrueColor: {
      type: String,
      default: 'warning'
    },
    buttonFalseColor: {
      type: String,
      default: 'grey'
    },
    color: {
      type: String,
      default: 'warning'
    },
    icon: {
      type: String,
      default () {
        return this.$vuetify.icons.values.warning
      }
    },
    message: {
      type: String,
      required: true
    },
    persistent: Boolean,
    title: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 450
    }
  },
  data () {
    return {
      value: false
    }
  },
  methods: {
    choose (value) {
      this.$emit('result', value)
      this.value = value
      this.$destroy()
    },
    change () {
      this.$destroy()
    }
  }
}
</script>
