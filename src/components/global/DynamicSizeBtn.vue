<template>
  <v-btn
    ref="btnWrapper"
    large
    rounded
    :loading="loading"
    color="primary"
    class="px-4 py-2 mb-2 overflow-hidden transition-all position-relative"
    :disabled="disabled"
    :outlined="disabled"
    @click="$emit('click')"
  >
    <!--    :name="disabled ? 'scroll-x-transition' : 'scroll-x-transition'"-->
    <!--    name="fade-transition"-->
    <transition
      :name="disabled ? 'scroll-y-reverse-transition' : 'scroll-y-transition'"
      @before-enter="setWidth"
    >
      <div
        v-if="disabled"
        key="invalid"
        ref="btnContent"
        class="d-flex align-center btn-content"
      >
        <span class="caption">
          无法开始识别
        </span>
        <v-divider
          vertical
          class="mx-2"
        />
        <span>
          {{ reason }}
        </span>
      </div>
      <div
        v-else
        key="valid"
        ref="btnContent"
        class="d-flex btn-content"
      >
        <div class="d-inline-flex align-center justify-center">
          <v-icon small>
            mdi-server
          </v-icon>
          <span class="caption ml-1">
            {{ $t("server.servers." + this.$store.getters["dataSource/server"]) }}
          </span>
        </div>
        <v-divider
          vertical
          class="mx-2"
        />
        <span>
          {{ $t("report.recognition.start", {amount: length}) }}
        </span>
      </div>
    </transition>
  </v-btn>
</template>

<script>
export default {
  name: "DynamicSizeBtn",
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    reason: {
      type: String,
      default: () => ""
    },
    length: {
      type: Number,
      default: () => 0
    }
  },
  watch: {
    reason() {
      this.update()
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      this.$nextTick(() => {
        this.setWidth(this.$refs.btnContent)
      })
    },
    setWidth(el) {
      if (!el) return
      this.$nextTick(() => {
        // 16 * 2: refers to "px-4" on the button element. Has to add padding since this is to just calculate
        // the inner content size
        this.$refs.btnWrapper.$el.style.width = (el.getBoundingClientRect().width + 16 * 2) + "px"
      })
    }
  },
}
</script>

<style scoped>
.transition-all {
  transition: all .375s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
}
.btn-content {
  position: absolute;
}
</style>