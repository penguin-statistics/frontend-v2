<template>
  <v-row>
    <v-col cols="12">
      <v-btn
        v-for="btn in styles"
        :key="btn"
        @click="invoke(btn)"
      >
        {{ btn }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import Haptics from "@/utils/native/haptics";

export default {
name: "CapacitorTest",
  data() {
    return {
      styles: ["light", "medium", "heavy", "vibrate", "selectionStart", "selectionChanged", "selectionEnd"]
    }
  },
  methods: {
    invoke(method) {
      Haptics[method]()
    }
  },
}
</script>

<style scoped>

</style>