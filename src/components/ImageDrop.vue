<template>
  <div
    class="file-input"
    @dragover="dragover"
    @drop="drop"
  >
    <v-file-input
      ref="fileInput"
      v-model="files"
      outlined
      multiple
      label="识别图片队列"
      persistent-hint
      class="cursor-pointer my-4"
      hint="单击或拖拽加入图片，仅支持使用小于 50MB 大小的图片 (image/*)"
      counter
      show-size
      accept="image/*"
      :rules="rules"
      prepend-icon="mdi-image"
      @blur="onDrag = false"
      @change="Files => $emit('input', Files)"
    >
      <template
        v-slot:prepend-inner
      >
        <v-overlay
          absolute
          :value="onDrag"
          color="success"
          opacity="0.9"
        >
          将图片拖拽到此处
        </v-overlay>
      </template>
      <template v-slot:selection="{ index, text }">
        <v-chip
          v-if="index < 10"
          small
          close
          @click:close="removeFileByIndex(index)"
        >
          {{ text }}
        </v-chip>
        <span
          v-else-if="index === 10"
          class="overline mx-2"
        >
          +{{ files.length - 10 }} File(s)
        </span>
      </template>
    </v-file-input>
    <v-snackbar
      v-model="snackbar"
      timeout="2000"
      color="red darken-2"
    >
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          icon
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>

export default {
  name: 'ImageDrop',
  props: ['value'],
  data: () => ({
    rules: [
      files => {
        for (const file of files) {
          if (file.size > 50e6) return `"${file.name}" (${(file.size / 1e6).toFixed(1)}MB) 超出大小限制`
        }
        return true
      }
    ],
    onDrag: false,
    snackbar: false,
    snackbarMessage: ''
  }),
  computed: {
    files: {
      get () {
        return this.value
      },
      set (newFiles) {
        return newFiles
      }
    }
  },
  mounted () {
    document.addEventListener('dragenter', (event) => {
      this.$refs.fileInput.focus()
      this.onDrag = true
    }, false)
  },
  beforeDestroy () {
    document.removeEventListener('dragenter', e => {})
  },
  methods: {
    removeFileByIndex (index) {
      this.files.splice(index, 1)
    },
    dragover (event) {
      event.preventDefault()
    },
    drop (event) {
      event.preventDefault()

      const imageFilter = (file) => {
        if (file.type.split('/')[0] === 'image') {
          return true
        } else {
          this.snackbar = true
          this.snackbarMessage = file.name + ' is not an image file.'
          return false
        }
      }

      // TODO: Discussion needed. Drag and Drop should keep files that already exist?
      this.$emit('input', [...this.files, ...[...event.dataTransfer.files].filter(imageFilter)])
      this.$refs.fileInput.blur()
    }
  }
}
</script>
<style scoped>
  .file-input >>> .v-input__slot {
    min-height: 128px !important;
  }
</style>
