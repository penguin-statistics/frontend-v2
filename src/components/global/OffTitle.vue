<template>
  <span
    class="font-weight-bold off-title--wrapper"
    :class="{'off-title--ea': isEastAsianLang, 'display-1': !small, 'headline off-title--small': small, 'ml-4': !noGutters}"
    :style="{'left': noGutters ? '0px' : null}"
  >
    <span
      v-for="(segment, i) in segments"
      :key="i"
      class="off-title--char"
      :class="{'off-title--space': segment === ' '}"
      v-text="segment"
    />
  </span>
</template>

<script>
export default {
  name: 'OffTitle',
  props: {
    content: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default () {
        return false
      }
    },
    noGutters: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    isEastAsianLang () {
      return ['zh', 'ja', 'ko'].includes(this.$i18n.locale)
    },
    segments () {
      if (this.isEastAsianLang) {
        // East asian languages (kanji)
        return this.content.split('')
      } else {
        return this.content.split(' ')
      }
    }
  }
}
</script>

<style scoped>
span.off-title--wrapper {
  position: relative;
  letter-spacing: -.1em !important;
  bottom: -20px;
  left: 0;
  z-index: 4;
}
span.off-title--ea {
  letter-spacing: -.18em !important;
}
span.off-title--small {
  bottom: -16px;
  left: -6px;
  letter-spacing: -.08em !important;
}
span.off-title--ea.off-title--small {
  letter-spacing: -.1em !important;
}
.off-title--char {
  font-family: "Source Han Serif", "Source Han Serif CN", "Songti SC",  serif;
  margin-right: .15em;
}
.off-title--ea .off-title--char {
  margin-right: 0;
}
.theme--light .off-title--char {
  color: #fff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 1),  0 0 10px rgba(0, 0, 0, 1);
}
.theme--dark .off-title--char {
  text-shadow: 0 0 5px rgba(0, 0, 0, 1),  0 0 10px rgba(0, 0, 0, 1),  0 0 20px rgba(0, 0, 0, 1);
}

.theme--light .off-title--small .off-title--char {
  text-shadow: 0 0 3px rgba(0, 0, 0, 1),  0 0 8px rgba(0, 0, 0, .8);
}
.theme--dark .off-title--small .off-title--char {
  text-shadow: 0 0 3px rgba(0, 0, 0, 1),  0 0 8px rgba(0, 0, 0, .8),  0 0 15px rgba(0, 0, 0, .6);
}
</style>
