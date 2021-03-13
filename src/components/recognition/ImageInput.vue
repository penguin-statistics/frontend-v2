<template>
  <div
    class="file-input"
    @dragover="dragover"
    @drop="drop"
  >
    <v-file-input
      ref="fileInput"
      v-model="files"
      multiple
      filled
      :label="$t('report.recognition.queue')"
      persistent-hint
      class="image-input my-4"
      :hint="$t('report.recognition.tips.chooseImage')"
      counter
      show-size
      accept="image/*"
      :rules="rules"
      prepend-icon="mdi-image"
      @blur="onDrag = false"
      @change="files => $emit('input', files)"
      @update:error="e => $emit('valid', $refs.fileInput.valid)"
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
          {{ $t("report.recognition.tips.dragImage") }}
        </v-overlay>
        <v-overlay
          absolute
          :value="$vuetify.breakpoint.xsOnly && files.length === 0"
          color="success"
          opacity="0.9"
          @click.native="$refs.fileInput.$refs.input.click()"
        >
          {{ $t("report.recognition.tips.addImage") }}
        </v-overlay>
      </template>
      <template
        v-slot:selection="{ index, text }"
      >
        <template
          v-if="$vuetify.breakpoint.xsOnly"
        >
          <template
            v-if="index === 0"
          >
            <span
              class="overline mx-2"
            >
              {{ files.length }} File(s)
            </span>
          </template>
        </template>
        <template
          v-else
        >
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
      </template>
    </v-file-input>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
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
  name: 'ImageInput',
  props: {
    value: {
      type: Array,
      default () { return [] }
    }
  },
  data: () => ({
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
    },
    rules () {
      return [
        files => {
          for (const file of files) {
            // if (files.length > 50) return '超出50个文件数量限制'
            if (file.size > 50e6) return this.$t('report.recognition.tips.fileTooBig', {name: file.name, size: (file.size / 1e6).toFixed(1)})
            // if (file.lastModified < Date.now() - 1000 * 3600 * 36) return this.$t('report.recognition.tips.fileTooOld', {name: file.name})
          }
          return true
        }
      ]
    }
  },
  mounted () {
    document.addEventListener('dragenter', this.onDragEnter, {
      passive: true,
      capture: false
    })
  },
  beforeDestroy () {
    document.removeEventListener('dragenter', this.onDragEnter, {
      passive: true,
      capture: false
    })
  },
  methods: {
    removeFileByIndex (index) {
      this.files.splice(index, 1)
    },
    onDragEnter () {
      this.onDrag = true
    },
    dragover (event) {
      event.preventDefault()
    },
    drop (event) {
      event.preventDefault()
      const illegalFiles = [];
      const imageFilter = (file) => {
        if (file.type.split('/')[0] === 'image') {
          return true
        } else {
          illegalFiles.push(file.name)
          return false
        }
      }

      const filteredFiles = [...event.dataTransfer.files].filter(imageFilter);
      if (illegalFiles.length > 0) {
        this.snackbar = true
        this.snackbarMessage = this.$tc('report.recognition.tips.notImageFile', illegalFiles.length, {files: illegalFiles.join(', ')})
      }
      // TODO: Discussion needed. Drag and Drop should keep files that already exist?
      this.$emit('input', [...this.files, ...filteredFiles])
    }
  }
}
</script>
<style scoped>
  .file-input >>> .v-input__slot {
    min-height: 128px !important;
  }

  .image-input >>> .v-input__slot {
    cursor: pointer !important;
  }
  .image-input >>> .v-file-input__text {
    padding-top: 26px !important;
    align-items: start !important;
    height: 100% !important;
  }
</style>
