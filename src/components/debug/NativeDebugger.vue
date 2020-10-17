<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12">
        <p>Counter: {{ counter }}</p>
        <v-btn
          large
          outlined
          @click="react"
        >
          Haptic
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "NativeDebugger",
  data() {
    return {
      counter: 0
    }
  },
  methods: {
    react() {
      this.counter += 1
    }
  }
}
</script>

<style scoped>

</style>